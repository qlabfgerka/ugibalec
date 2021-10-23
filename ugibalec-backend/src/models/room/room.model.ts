import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Document } from 'mongoose';
import { User } from '../user/user.model';
import { Wordpack } from '../wordpack/wordpack.model';

export type RoomDocument = Room & Document;

@Schema()
export class Room {
  id?: string | undefined | null = null;

  @Prop()
  title: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  admin: User;

  @Prop()
  password: string;

  @Prop()
  maxPlayers: number;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] })
  playerList: User[];

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Wordpack' })
  wordpack: Wordpack;
}

export const RoomSchema = SchemaFactory.createForClass(Room);
