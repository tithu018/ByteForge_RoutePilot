import {
  IsDateString,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
  MinLength,
} from 'class-validator';

export class CreatePlanDto {
  @IsString()
  @MinLength(1)
  name!: string;

  @IsDateString()
  deliveryDate!: string;

  @IsString()
  @MinLength(1)
  depotId!: string;
}

export class CreateCapacityScenarioDto {
  @IsString()
  @MinLength(1)
  depotId!: string;

  @IsOptional()
  @IsString()
  brandId?: string;

  @IsInt()
  @Min(2000)
  isoYear!: number;

  @IsInt()
  @Min(1)
  @Max(53)
  isoWeek!: number;

  @IsDateString()
  horizonStart!: string;

  @IsDateString()
  horizonEnd!: string;

  @IsNumber()
  @Min(0)
  totalVolumeM3!: number;

  @IsNumber()
  @Min(0)
  chilledVolumeM3!: number;

  @IsString()
  @MinLength(1)
  sourceLabel!: string;

  @IsOptional()
  @IsDateString()
  sourceRunDate?: string;

  @IsOptional()
  @IsString()
  note?: string;
}

export class ListCapacityScenarioQuery {
  @IsString()
  depotId!: string;

  @IsOptional()
  @IsInt()
  isoYear?: number;

  @IsOptional()
  @IsInt()
  isoWeek?: number;
}
