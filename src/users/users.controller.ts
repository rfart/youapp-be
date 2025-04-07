import { Controller, Headers, Get, UseGuards, HttpStatus, HttpCode } from '@nestjs/common';
import { UsersService } from './users.service';
import { XTokenAuthGuard } from '../auth/guards/x-token-auth.guard';

@Controller('api')
export class UsersController {
  constructor(private usersService: UsersService) {}

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
        
        return {
          message: 'Profile has been found successfully',
          data: {
            email: user.email || '',
            username: user.username || '',
            interests: user.interests || []
          }
        };
  }
}
