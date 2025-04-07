import { Controller, Post, Body, UseGuards, Request, Get, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getProfile(@Request() req) {
    return req.user;
  }
}

@Controller('api')
export class ApiAuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() credentials: { username?: string; email?: string; password: string }) {
    const usernameOrEmail = credentials.username || credentials.email;
    if (!usernameOrEmail || !credentials.password) {
      throw new UnauthorizedException('Username/email and password are required');
    }
    return this.authService.loginWithCredentials(
      usernameOrEmail,
      credentials.password,
    );
  }

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }
}
