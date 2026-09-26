import 'reflect-metadata';
import { after, before, describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { Body, Controller, Get, Post } from '@nestjs/common';
import type { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { IsString } from 'class-validator';
import request from 'supertest';
import type { Server } from 'node:http';
import { HealthModule } from '../src/health/health.module';
import { DatabaseService } from '../src/database/database.service';
import { configureApp } from '../src/common/configure-app';

class ExampleDto {
  @IsString() label!: string;
}
// Test-only controller exercises the global infrastructure; never registered in AppModule.
@Controller('test-infrastructure')
class InfrastructureController {
  @Post() validate(@Body() body: ExampleDto) {
    return body;
  }
  @Get('failure') failure(): never {
    throw new Error('sensitive-database-connection-string');
  }
}
describe('API infrastructure', () => {
  let app: INestApplication;
  let server: Server;
  let databaseFails = false;
  before(async () => {
    const module = await Test.createTestingModule({
      imports: [HealthModule],
      controllers: [InfrastructureController],
    })
      .overrideProvider(DatabaseService)
      .useValue({
        checkConnection: async () => {
          if (databaseFails) throw new Error('private connection details');
        },
      })
      .compile();
    app = module.createNestApplication({ logger: false });
    configureApp(app, ['http://localhost:5173']);
    await app.listen(0, '127.0.0.1');
    server = app.getHttpServer();
  });
  after(async () => {
    await app.close();
  });
  it('starts and serves the liveness contract', async () => {
    await request(server).get('/api/v1/health').expect(200, { status: 'ok' });
  });
  it('checks readiness through the database service', async () => {
    await request(server)
      .get('/api/v1/health/ready')
      .expect(200, { status: 'ok', database: 'connected' });
  });
  it('returns safe 503 on database failure, without failing liveness', async () => {
    databaseFails = true;
    try {
      const response = await request(server).get('/api/v1/health/ready').expect(503);
      assert.ok(!response.text.includes('private connection'));
      await request(server).get('/api/v1/health').expect(200);
    } finally {
      databaseFails = false;
    }
  });
  it('validates DTO fields and rejects unknown fields', async () => {
    await request(server).post('/api/v1/test-infrastructure').send({ label: 'valid' }).expect(201);
    await request(server)
      .post('/api/v1/test-infrastructure')
      .send({ label: 12, unexpected: true })
      .expect(400);
  });
  it('redacts unhandled errors and includes a request identifier', async () => {
    const response = await request(server).get('/api/v1/test-infrastructure/failure').expect(500);
    assert.ok(!response.text.includes('sensitive'));
    assert.ok(response.headers['x-request-id']);
    assert.match(response.text, /INTERNAL_ERROR/);
  });
  it('does not grant CORS permission to an unlisted origin', async () => {
    const response = await request(server)
      .get('/api/v1/health')
      .set('Origin', 'https://untrusted.example')
      .expect(200);
    assert.equal(response.headers['access-control-allow-origin'], undefined);
  });
  it('grants only the configured origin and has no business endpoints', async () => {
    const response = await request(server)
      .get('/api/v1/health')
      .set('Origin', 'http://localhost:5173')
      .expect(200);
    assert.equal(response.headers['access-control-allow-origin'], 'http://localhost:5173');
    await request(server).get('/api/v1/orders').expect(404);
  });
});
