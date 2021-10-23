import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type WordpackDocument = Wordpack & Document;

@Schema()
export class Wordpack {
  id?: string | undefined | null = null;

  @Prop()
  title: string;

  @Prop([String])
  words: string[];
}

export const WordpackSchema = SchemaFactory.createForClass(Wordpack);
