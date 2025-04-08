import { Controller, Headers, Get, Post, Put, Body, HttpStatus, HttpCode, UnauthorizedException } from '@nestjs/common';
import { UsersService } from './users.service';
import { ProfileService } from './profile.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Controller('api')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private profileService: ProfileService
  ) {}

  @Get('getProfile')
  @HttpCode(HttpStatus.OK)
  async getProfile(@Headers('x-access-token') token: string) {
    if (!token) {
      return {
        message: 'Access token is required',
        statusCode: HttpStatus.UNAUTHORIZED
      };
    }
    
    const user = await this.usersService.findProfileByToken(token);
    const profile = await this.profileService.findByUserId(user._id);
    
    return {
      message: 'Profile has been found successfully',
      data: {
        email: user.email || '',
        username: user.username || '',
        interests: profile?.interests || [],
        about: profile?.about || '',
        displayName: profile?.displayName || '',
        gender: profile?.gender || '',
        birthday: profile?.birthday || null,
        zodiac: profile?.zodiac || '',
        horoscope: profile?.horoscope || '',
        height: profile?.height || null,
        weight: profile?.weight || null,
        image: profile?.image || ''
      }
    };
  }

  @Post('createProfile')
  @HttpCode(HttpStatus.CREATED)
  async createProfile(
    @Headers('x-access-token') token: string,
    @Body() createProfileDto: CreateProfileDto
  ) {
    if (!token) {
      throw new UnauthorizedException('Access token is required');
    }
    
    const user = await this.usersService.findProfileByToken(token);
    const profile = await this.profileService.create(user._id, createProfileDto);
    
    return {
      message: 'Profile has been created successfully',
      data: profile
    };
  }

  @Put('updateProfile')
  @HttpCode(HttpStatus.OK)
  async updateProfile(
    @Headers('x-access-token') token: string,
    @Body() updateProfileDto: UpdateProfileDto
  ) {
    if (!token) {
      throw new UnauthorizedException('Access token is required');
    }
    
    const user = await this.usersService.findProfileByToken(token);
    const updatedProfile = await this.profileService.update(user._id, updateProfileDto);
    
    return {
      message: 'Profile has been updated successfully',
      data: updatedProfile
    };
  }
}
