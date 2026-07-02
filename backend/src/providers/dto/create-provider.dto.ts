import { IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateProviderDto {
  @IsString()
  @IsNotEmpty()
  businessName: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsIn(['BAND', 'FLORIST', 'CAKE', 'HOST', 'DECORATOR', 'PHOTOGRAPHER', 'VENUE', 'CATERING', 'OTHER'])
  category: string;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  website?: string;
}
