import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type ProfileDocument = Profile & Document;

@Schema({ timestamps: true })
export class Profile {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true, unique: true })
  userId: string;

  @Prop()
  email: string;

  @Prop()
  username: string;

  @Prop()
  name: string;

  @Prop()
  birthDate: Date;

  @Prop()
  horoscope: string;

  @Prop()
  zodiac: string;

  @Prop()
  height: number;

  @Prop()
  weight: number;

  @Prop({ type: [String], default: [] })
  interests: string[];

  @Prop()
  bio: string;

  @Prop()
  gender: string;

  @Prop()
  photos: string[];
}

export const ProfileSchema = SchemaFactory.createForClass(Profile);
