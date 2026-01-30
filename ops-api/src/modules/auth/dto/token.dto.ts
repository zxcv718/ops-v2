import { IsString } from 'class-validator';

export class TokenDto {
  accessToken!: string;
  refreshToken!: string;
}

export class RefreshTokenDto {
  @IsString()
  refreshToken!: string;
}
