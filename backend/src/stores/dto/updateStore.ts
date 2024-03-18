import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateStoreDto {
  @IsNotEmpty()
  @IsString()
  storeNumber: string;

  @IsOptional()
  @IsString()
  storeType: string;

  @IsOptional()
  @IsString()
  status: string;

  @IsOptional()
  @IsString()
  information: string | null;
}
