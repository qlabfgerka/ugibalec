import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Room, RoomDocument } from 'src/models/room/room.model';
import { User, UserDocument } from 'src/models/user/user.model';
import { Wordpack, WordpackDocument } from 'src/models/wordpack/wordpack.model';
import { DtoFunctionsService } from 'src/services/dto-functions/dto-functions.service';

@Injectable()
export class RoomService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Room.name) private roomModel: Model<RoomDocument>,
    @InjectModel(Wordpack.name) private wordpackModel: Model<WordpackDocument>,
    private readonly dtoFunctions: DtoFunctionsService,
  ) {}

  public async getRooms(): Promise<Array<Room>> {
    const rooms = await this.roomModel.find().exec();

    return await this.dtoFunctions.roomsToDTO(rooms);
  }

  public async getRoom(roomId: string): Promise<Room> {
    const room = await this.roomModel.findById(roomId);

    return await this.dtoFunctions.roomToDTO(room);
  }

  public async createRoom(adminId: string, room: Room): Promise<Room> {
    const admin = await this.userModel.findById(adminId);
    const wordpack = await this.wordpackModel.findById(room.wordpack.id);

    const newRoom = new this.roomModel({
      title: room.title,
      admin: admin,
      password: room.password,
      maxPlayers: room.maxPlayers,
      playerList: [admin],
      wordpack: wordpack,
    });

    await newRoom.save();

    return await this.dtoFunctions.roomToDTO(newRoom);
  }

  public async updateRoom(adminId: string, room: Room): Promise<Room> {
    const admin = await this.userModel.findById(adminId);
    const roomAdmin = await this.userModel.findById(room.admin.id);
    const wordpack = await this.wordpackModel.findById(room.wordpack.id);
    const currentRoom = await this.roomModel.findById(room.id);

    if (
      this.dtoFunctions.userToDTO(admin).id ===
      this.dtoFunctions.userToDTO(roomAdmin).id
    ) {
      currentRoom.title = room.title;
      currentRoom.password = room.password;
      currentRoom.wordpack = wordpack;
      currentRoom.maxPlayers = room.maxPlayers;

      await currentRoom.save();
    }

    return currentRoom;
  }
}