import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { IsEmail, IsString, MinLength } from 'class-validator';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './auth.guards';
import type { AuthenticatedRequest } from './auth.types';

class LoginDto { @IsEmail() email!: string; @IsString() @MinLength(1) password!: string; }

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}
  @Post('login') login(@Body() body: LoginDto) { return this.auth.login(body.email, body.password); }
  @Get('me') @UseGuards(JwtAuthGuard) me(@Req() request: AuthenticatedRequest) { return this.auth.profile(request.user!.sub); }
}