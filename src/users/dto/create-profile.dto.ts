import { IsString, IsOptional, IsEnum, IsArray, IsDate, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProfileDto {
  @IsString()
  @IsOptional()
  about?: string;

  @IsString()
  @IsOptional()
  image?: string;

  @IsString()
  @IsOptional()
  displayName?: string;

  @IsEnum(['male', 'female', 'other'])
  @IsOptional()
  gender?: string;

  @IsArray()
  @IsOptional()
  interests?: string[];

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  birthday?: Date;

  @IsNumber()
  @IsOptional()
  height?: number;

  @IsNumber()
  @IsOptional()
  weight?: number;
}
