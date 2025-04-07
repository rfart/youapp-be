import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as bcrypt from 'bcrypt';
import * as mongoose from 'mongoose';

export type UserDocument = Document & {
  email: string;
  username: string;
  password: string;
  interests: string[];
  profile: mongoose.Schema.Types.ObjectId;
  validatePassword: (password: string) => Promise<boolean>;
};

@Schema()
export class User {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true })
  password: string;
  
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Profile' })
  profile: mongoose.Schema.Types.ObjectId;
}

export const UserSchema = SchemaFactory.createForClass(User);

// Add the validatePassword method to the schema
UserSchema.methods.validatePassword = async function (password: string): Promise<boolean> {
  return bcrypt.compare(password, this.password);
};
