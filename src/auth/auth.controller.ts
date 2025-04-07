import { Controller, Post, Body, UseGuards, Request, Get, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
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
