import { IsEnum, IsInt, IsObject, IsOptional, IsString, Min, MinLength } from 'class-validator';
import { DeliveryEventType, IssueType, LoadingEventType } from '../../generated/prisma/enums';

export class RecordLoadingEventDto {
  @IsString()
  @MinLength(1)
  tripId!: string;

  @IsEnum(LoadingEventType)
  type!: LoadingEventType;

  @IsOptional()
  @IsString()
  orderId?: string;

  @IsOptional()
  @IsObject()
  details?: Record<string, unknown>;
}

export class RecordDeliveryEventDto {
  @IsString()
  @MinLength(1)
  clientEventId!: string;

  @IsString()
  @MinLength(1)
  tripStopId!: string;

  @IsEnum(DeliveryEventType)
  type!: DeliveryEventType;

  @IsOptional()
  @IsString()
  receiverName?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsString()
  reference?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  baseVersion?: number;

  @IsOptional()
  @IsObject()
  details?: Record<string, unknown>;
}

export class CreateIssueDto {
  @IsEnum(IssueType)
  type!: IssueType;

  @IsString()
  @MinLength(3)
  title!: string;

  @IsString()
  @MinLength(3)
  description!: string;

  @IsOptional()
  @IsString()
  orderId?: string;

  @IsOptional()
  @IsString()
  deliveryId?: string;
}
