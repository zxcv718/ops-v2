import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class TokenDto {
  @ApiProperty({ description: 'JWT 액세스 토큰' })
  accessToken!: string;

  @ApiProperty({ description: 'JWT 리프레시 토큰' })
  refreshToken!: string;
}

export class RefreshTokenDto {
  @ApiProperty({ description: '리프레시 토큰' })
  @IsString()
  refreshToken!: string;
}
