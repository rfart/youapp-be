import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Profile, ProfileDocument } from './schemas/profile.schema';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class ProfilesService {
  constructor(
    @InjectModel(Profile.name) private profileModel: Model<ProfileDocument>,
  ) {}

  async create(userId: string, createProfileDto: CreateProfileDto): Promise<Profile> {
    const existingProfile = await this.profileModel.findOne({ userId }).exec();
    
    if (existingProfile) {
      return this.update(userId, createProfileDto);
    }
    
    const createdProfile = new this.profileModel({
      userId,
      ...createProfileDto,
    });
    
    return createdProfile.save();
  }

  async findOneByUserId(userId: string): Promise<Profile> {
    const profile = await this.profileModel.findOne({ userId }).exec();
    
    if (!profile) {
      throw new NotFoundException(`Profile for user ${userId} not found`);
    }
    
    return profile;
  }

  async update(userId: string, updateProfileDto: UpdateProfileDto): Promise<Profile> {
    const updatedProfile = await this.profileModel
      .findOneAndUpdate({ userId }, updateProfileDto, { new: true })
      .exec();
    
    if (!updatedProfile) {
      throw new NotFoundException(`Profile for user ${userId} not found`);
    }
    
    return updatedProfile;
  }
}
