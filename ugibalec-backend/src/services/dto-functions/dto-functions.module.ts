import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/models/user/user.model';
import { Wordpack, WordpackSchema } from 'src/models/wordpack/wordpack.model';
import { DtoFunctionsService } from './dto-functions.service';

@Module({
  providers: [DtoFunctionsService],
  exports: [DtoFunctionsService],
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Wordpack.name, schema: WordpackSchema },
    ]),
  ],
})
export class DtoFunctionsModule {}
