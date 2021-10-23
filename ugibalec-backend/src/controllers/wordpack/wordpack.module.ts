import { Module } from '@nestjs/common';
import { WordpackService } from './wordpack.service';
import { WordpackController } from './wordpack.controller';
import { Wordpack, WordpackSchema } from 'src/models/wordpack/wordpack.model';
import { MongooseModule } from '@nestjs/mongoose';
import { DtoFunctionsModule } from 'src/services/dto-functions/dto-functions.module';

@Module({
  providers: [WordpackService],
  controllers: [WordpackController],
  imports: [
    MongooseModule.forFeature([
      { name: Wordpack.name, schema: WordpackSchema },
    ]),
    DtoFunctionsModule,
  ],
})
export class WordpackModule {}
