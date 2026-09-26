import {
  IsDateString,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  Min,
  MinLength,
} from 'class-validator';
import { TemperatureType } from '../../generated/prisma/enums';

export class CreateOrderDto {
  @IsDateString()
  requestedDeliveryDate!: string;

  @IsOptional()
  @IsString()
  @Matches(/^DEMO-[A-Z0-9-]+$/)
  sourceId?: string;

  @IsEnum(TemperatureType)
  temperature!: TemperatureType;

  @IsInt()
  @Min(1)
  units!: number;

  @IsNumber()
  @Min(0)
  weightKg!: number;

  @IsNumber()
  @Min(0)
  volumeM3!: number;

  @IsOptional()
  @Matches(/^([01]\d|2[0-3]):[0-5]\d$/)
  requestedWindowOpen?: string;

  @IsOptional()
  @Matches(/^([01]\d|2[0-3]):[0-5]\d$/)
  requestedWindowClose?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  accessRequirement?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  mallWindow?: string;
}

export class ListOrdersQuery {
  @IsOptional()
  @IsDateString()
  requestedDeliveryDate?: string;
}
