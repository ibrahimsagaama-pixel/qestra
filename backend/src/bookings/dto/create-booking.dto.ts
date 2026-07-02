import { IsDateString, IsIn, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateBookingDto {
  @IsUUID()
  providerId: string;

  @IsUUID()
  serviceId: string;

  @IsIn(['WEDDING', 'ANNIVERSARY', 'BIRTHDAY', 'PARTY', 'DINNER', 'CORPORATE', 'OTHER'])
  eventType: string;

  @IsDateString()
  eventDate: string;

  @IsOptional()
  @IsNumber()
  guestCount?: number;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
