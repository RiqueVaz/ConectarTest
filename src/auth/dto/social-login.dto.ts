import { IsEmail, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';
import { AuthProvider } from '../../users/entities/user.entity';

export class SocialLoginDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsEnum(AuthProvider)
  provider: AuthProvider;

  @IsNotEmpty()
  providerId: string;

  @IsOptional()
  avatar?: string;
}