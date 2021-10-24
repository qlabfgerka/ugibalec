import { Module } from '@nestjs/common';
import { RoomService } from './room.service';
import { RoomController } from './room.controller';
import { Room, RoomSchema } from 'src/models/room/room.model';
import { User, UserSchema } from 'src/models/user/user.model';
import { MongooseModule } from '@nestjs/mongoose';
import { DtoFunctionsModule } from 'src/services/dto-functions/dto-functions.module';
import { Wordpack, WordpackSchema } from 'src/models/wordpack/wordpack.model';
import { SocketModule } from 'src/services/socket/socket.module';

@Module({
  providers: [RoomService],
  controllers: [RoomController],
  imports: [
    MongooseModule.forFeature([
      { name: Room.name, schema: RoomSchema },
      { name: User.name, schema: UserSchema },
      { name: Wordpack.name, schema: WordpackSchema },
    ]),
    DtoFunctionsModule,
    SocketModule,
  ],
})
export class RoomModule {}
