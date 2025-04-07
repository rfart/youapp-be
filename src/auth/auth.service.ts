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
      if (!user) return null;
      
      const isPasswordValid = await user.validatePassword(password);
      
      if (isPasswordValid) {
        // Handle the user object using Document methods or manual approach
        const userObject = user.toObject ? user.toObject() : JSON.parse(JSON.stringify(user));
        const { password, ...result } = userObject;
        return result;
      }
      
      return null;
    } catch (error) {
      return null;
    }
  }

  async login(user: any) {
    const payload: JwtPayload = { email: user.email, sub: user._id.toString() };
    
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
      },
    };
  }

  async loginWithCredentials(usernameOrEmail: string, password: string) {
    // Check if input is email or username
    const isEmail = usernameOrEmail.includes('@');
    
    let user;
    if (isEmail) {
      user = await this.usersService.findOneByEmail(usernameOrEmail);
    } else {
      // Assuming you have a method to find by username in your UserService
      // If not, you would need to add one
      user = await this.usersService.findOneByUsername(usernameOrEmail);
    }

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await user.validatePassword(password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload: JwtPayload = { email: user.email, sub: user._id.toString() };
    
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
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
        username: newUser.username,
      },
    };  }
}
