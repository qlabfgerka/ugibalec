import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';

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

export class Player {
  id?: string | undefined | null = null;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  player: User;

  @Prop()
  points: number;

  @Prop()
  guessed: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
export const PlayerSchema = SchemaFactory.createForClass(Player);
