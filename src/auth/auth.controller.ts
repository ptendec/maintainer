import { Body, Controller, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';

import { Req } from '@nestjs/common';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FastifyReply, FastifyRequest } from 'fastify';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto, LoginUserResDto } from './dto/login-user.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { UserDto } from './dto/user.dto';

interface UserPayload {
  id: number;
  email: string;
}

export interface RequestWithUser extends FastifyRequest {
  user: UserPayload;
}

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('register')
  @ApiBody({ type: CreateUserDto })
  @ApiCreatedResponse({ type: UserDto })
  async register(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Post('login')
  @ApiBody({ type: LoginUserDto })
  @ApiResponse({
    status: 200,
    description: 'User logged in successfully.',
    type: LoginUserResDto,
  })
  async login(
    @Req() req: RequestWithUser,
    @Res({ passthrough: true }) res: FastifyReply,
  ) {
    const { accessToken, refreshToken } = await this.authService.login(
      req.user,
    );
    res.setCookie('refresh_token', refreshToken, {
      httpOnly: true,
      path: '/',
    });
    return { accessToken, user: req.user };
  }

  @Post('refresh')
  @ApiResponse({
    status: 200,
    description: 'Token refreshed successfully.',
    type: RefreshTokenDto,
  })
  async refresh(
    @Req() request: FastifyRequest,
    @Res({ passthrough: true }) res: FastifyReply,
  ) {
    const refreshToken = request.cookies['refresh_token'];
    if (!refreshToken) {
      throw new Error('Refresh token not found');
    }

    const { accessToken, refreshToken: newRefreshToken } =
      await this.authService.refreshToken(refreshToken);

    res.setCookie('refresh_token', newRefreshToken, {
      httpOnly: true,
      path: '/',
    });

    return { accessToken };
  }
}
