import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { User } from '../users/schemas/user.schema';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    try {
      const user = await this.usersService.findOneByEmail(email);
      const isPasswordValid = await user.validatePassword(password);
      
      if (isPasswordValid) {
        const { password, ...result } = user.toObject();
        return result;
      }
      
      return null;
    } catch (error) {
      return null;
    }
  }

  async login(user: any) {
    const payload: JwtPayload = { email: user.email, sub: user._id };
    
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user._id,
        email: user.email,
      },
    };
  }

  async register(createUserDto: CreateUserDto) {
    const newUser = await this.usersService.create(createUserDto);
    
    const payload: JwtPayload = { 
      email: newUser.email, 
      sub: newUser._id.toString() 
    };
    
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: newUser._id,
        email: newUser.email,
      },
    };
  }
}
