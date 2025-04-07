import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Headers, HttpStatus, HttpCode } from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('profiles')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Request() req, @Body() createProfileDto: CreateProfileDto) {
    return this.profilesService.create(req.user.userId, createProfileDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  findMyProfile(@Request() req) {
    return this.profilesService.findOneByUserId(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me')
  update(@Request() req, @Body() updateProfileDto: UpdateProfileDto) {
    return this.profilesService.update(req.user.userId, updateProfileDto);
  }
  
  @Get('/api/getProfile')
  @HttpCode(HttpStatus.OK)
  async getProfile(@Headers('x-access-token') token: string) {
    if (!token) {
      return {
        message: 'Access token is required',
        statusCode: HttpStatus.UNAUTHORIZED
      };
    }
    
    const profile = await this.profilesService.findProfileByToken(token);
    
    return {
      message: 'Profile has been found successfully',
      data: {
        email: profile.email || '',
        username: profile.username || '',
        interests: profile.interests || []
      }
    };
  }
}
