import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User, UserSchema } from 'src/models/user/user.model';
import { MongooseModule } from '@nestjs/mongoose';
import { DtoFunctionsModule } from 'src/services/dto-functions/dto-functions.module';

@Module({
  providers: [UserService],
  controllers: [UserController],
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    DtoFunctionsModule,
  ],
})
export class UserModule {}
