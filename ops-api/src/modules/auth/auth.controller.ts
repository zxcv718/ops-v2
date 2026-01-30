import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Request,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { JwtAuthGuard } from './guards/jwt-auth.guard.js';
import type { LoginDto, TokenDto, RefreshTokenDto } from './dto/index.js';
import type { UserPayload } from './auth.service.js';

interface RequestWithUser {
  user: {
    sub: string;
    email: string;
    role: string;
  };
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto): Promise<TokenDto> {
    const user = await this.authService.validateUser(
      loginDto.email,
      loginDto.password,
    );

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.authService.login(user);
  }

  @Post('refresh')
  async refresh(@Body() refreshDto: RefreshTokenDto): Promise<TokenDto> {
    return this.authService.refreshTokens(refreshDto.refreshToken);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async me(@Request() req: RequestWithUser): Promise<UserPayload> {
    const user = await this.authService.getUserById(req.user.sub);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return user;
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  logout(): { message: string } {
    // JWT는 stateless이므로 서버에서 할 일 없음
    // 클라이언트에서 토큰 삭제 필요
    return { message: 'Logged out successfully' };
  }
}
