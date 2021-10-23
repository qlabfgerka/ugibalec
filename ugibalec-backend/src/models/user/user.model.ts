import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  id?: string | undefined | null = null;

  @Prop()
  username: string;

  @Prop()
  nickname: string;

  @Prop()
  email: string;

  @Prop()
  password?: string;

  @Prop()
  gamesPlayed: number;

  @Prop()
  cumulativePoints: number;

  @Prop()
  wins: number;

  @Prop()
  refreshToken?: string;

  @Prop()
  refreshTokenExpiry?: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
