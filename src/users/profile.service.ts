import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Profile, ProfileDocument } from './schemas/profile.schema';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class ProfileService {
  constructor(
    @InjectModel(Profile.name) private profileModel: Model<ProfileDocument>,
  ) {}

  async create(userId: Types.ObjectId, createProfileDto: CreateProfileDto): Promise<Profile> {
    const existingProfile = await this.profileModel.findOne({ userId });
    
    if (existingProfile) {
      throw new Error('Profile already exists for this user');
    }
    
    const newProfile = new this.profileModel({
      userId,
      ...createProfileDto,
    });
    
    return newProfile.save();
  }

  async findByUserId(userId: Types.ObjectId): Promise<Profile> {
    const profile = await this.profileModel.findOne({ userId });
    if (!profile) {
      return null;
    }
    return profile;
  }

  async update(userId: Types.ObjectId, updateProfileDto: UpdateProfileDto): Promise<Profile> {
    const profile = await this.profileModel.findOne({ userId });
    
    if (!profile) {
      throw new NotFoundException('Profile not found');
    }
    
    Object.assign(profile, updateProfileDto);
    return profile.save();
  }
}
