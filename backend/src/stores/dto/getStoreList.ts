import { IsNotEmpty, IsString } from 'class-validator';

export class GetStoreListDto {
  @IsNotEmpty()
  @IsString()
  type: string;

  @IsNotEmpty()
  @IsString()
  storeType: string;
}
