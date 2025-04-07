import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type ProfileDocument = Profile & Document;

@Schema()
export class Profile {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  userId: MongooseSchema.Types.ObjectId;

  @Prop({ required: false })
  about: string;

  @Prop({ required: false })
  image: string;

  @Prop({ required: false })
  displayName: string;

  @Prop({ required: false, enum: ['male', 'female', 'other'] })
  gender: string;

  @Prop({ required: false, default: [] })
  interests: string[];

  @Prop({ required: false })
  birthday: Date;

  @Prop({ required: false })
  zodiac: string;

  @Prop({ required: false })
  horoscope: string;

  @Prop({ required: false, type: Number })
  height: number;

  @Prop({ required: false, type: Number })
  weight: number;
}

export const ProfileSchema = SchemaFactory.createForClass(Profile);

// Calculate zodiac sign based on birthday
ProfileSchema.pre('save', function(next) {
  if (this.birthday) {
    const month = this.birthday.getMonth() + 1;
    const day = this.birthday.getDate();
    
    // Calculate zodiac sign
    if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) {
      this.zodiac = 'Aries';
    } else if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) {
      this.zodiac = 'Taurus';
    } else if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) {
      this.zodiac = 'Gemini';
    } else if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) {
      this.zodiac = 'Cancer';
    } else if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) {
      this.zodiac = 'Leo';
    } else if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) {
      this.zodiac = 'Virgo';
    } else if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) {
      this.zodiac = 'Libra';
    } else if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) {
      this.zodiac = 'Scorpio';
    } else if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) {
      this.zodiac = 'Sagittarius';
    } else if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) {
      this.zodiac = 'Capricorn';
    } else if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) {
      this.zodiac = 'Aquarius';
    } else {
      this.zodiac = 'Pisces';
    }

    // Set the same value for horoscope as zodiac if not already set
    if (!this.horoscope) {
      this.horoscope = this.zodiac;
    }
  }
  next();
});
