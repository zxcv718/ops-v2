import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Request,
  UnauthorizedException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthService } from './auth.service.js';
import { JwtAuthGuard } from './guards/jwt-auth.guard.js';
import { LoginDto, TokenDto, RefreshTokenDto } from './dto/index.js';
import type { UserPayload } from './auth.service.js';

interface RequestWithUser {
  user: {
    sub: string;
    email: string;
    role: string;
  };
}

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: '로그인' })
  @ApiResponse({ status: 200, description: '로그인 성공', type: TokenDto })
  @ApiResponse({ status: 401, description: '인증 실패' })
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

  @ApiOperation({ summary: '토큰 갱신' })
  @ApiResponse({ status: 200, description: '토큰 갱신 성공', type: TokenDto })
  @ApiResponse({ status: 401, description: '유효하지 않은 리프레시 토큰' })
  @Post('refresh')
  async refresh(@Body() refreshDto: RefreshTokenDto): Promise<TokenDto> {
    return this.authService.refreshTokens(refreshDto.refreshToken);
  }

  @ApiOperation({ summary: '내 정보 조회' })
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: '사용자 정보' })
  @ApiResponse({ status: 401, description: '인증 필요' })
  @UseGuards(JwtAuthGuard)
  @Get('me')
  async me(@Request() req: RequestWithUser): Promise<UserPayload> {
    const user = await this.authService.getUserById(req.user.sub);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return user;
  }

  @ApiOperation({ summary: '로그아웃' })
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: '로그아웃 성공' })
  @UseGuards(JwtAuthGuard)
  @Post('logout')
  logout(): { message: string } {
    return { message: 'Logged out successfully' };
  }
}
