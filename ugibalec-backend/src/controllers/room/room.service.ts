import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Room, RoomDocument } from 'src/models/room/room.model';
import { Player, User, UserDocument } from 'src/models/user/user.model';
import { Wordpack, WordpackDocument } from 'src/models/wordpack/wordpack.model';
import { DtoFunctionsService } from 'src/services/dto-functions/dto-functions.service';
import * as bcrypt from 'bcrypt';

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
    const player: Player = {
      guessed: false,
      player: admin._id,
      points: 0,
    };

    const newRoom = new this.roomModel({
      title: room.title,
      admin: admin,
      password: await this.generateHash(room.password),
      maxPlayers: room.maxPlayers,
      playerList: [player],
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
      currentRoom.password = await this.generateHash(room.password);
      currentRoom.wordpack = wordpack;
      currentRoom.maxPlayers = room.maxPlayers;

      await currentRoom.save();
    }

    return currentRoom;
  }

  public async joinRoom(
    roomId: string,
    userId: string,
    password: string,
  ): Promise<boolean> {
    const room = await this.roomModel.findById(roomId);
    const user = await this.userModel.findById(userId);
    const player: Player = {
      guessed: false,
      player: user._id,
      points: 0,
    };

    if (room.password && !(await bcrypt.compare(password, room.password)))
      return false;

    if (room.playerList.length >= room.maxPlayers) return false;

    room.playerList.push(player);

    await room.save();

    return true;
  }

  public async leaveRoom(roomId: string, userId: string): Promise<boolean> {
    const room = await this.roomModel.findById(roomId);
    const user = await this.userModel.findById(userId);

    const index = room.playerList.indexOf(
      room.playerList.find(
        (player: Player) => user.id === player.player.toString(),
      ),
    );

    if (index > -1) {
      room.playerList.splice(index, 1);

      if (room.playerList.length === 0) {
        await room.delete();
        return true;
      } else if (room.admin.toString() === user.id) {
        room.admin = room.playerList[0].player;
      }

      await room.save();

      return true;
    }

    return false;
  }

  public async startGame(roomId: string, userId: string): Promise<boolean> {
    const room = await this.roomModel.findById(roomId);
    const user = await this.userModel.findById(userId);
    const wordpack = await this.wordpackModel.findById(
      room.wordpack.toString(),
    );
    //room.playerList = await this.dtoFunctions.getUsers(room.playerList);

    room.drawer = user;
    room.currentWord =
      wordpack.words[Math.floor(Math.random() * wordpack.words.length)];
    room.playerList.forEach(async (player: Player) => {
      const p = await this.userModel.findById(player.player.toString());
      p.gamesPlayed++;
      player.points = 0;

      await p.save();
    });

    await room.save();

    return true;
  }

  public async guess(
    roomId: string,
    userId: string,
    guess: string,
    points: number,
  ): Promise<number> {
    const room = await this.roomModel.findById(roomId);
    const user = await this.userModel.findById(userId);
    let guessed = 0;

    if (guess.toLowerCase() !== room.currentWord.toLowerCase()) return 0;

    const index = room.playerList.indexOf(
      room.playerList.find(
        (player: Player) => user.id === player.player.toString(),
      ),
    );

    const drawerIndex = room.playerList.indexOf(
      room.playerList.find(
        (player: Player) => room.drawer.toString() === player.player.toString(),
      ),
    );

    if (index > -1 && !room.playerList[index].guessed) {
      const player = await this.userModel.findById(
        room.playerList[index].player.toString(),
      );
      const drawer = await this.userModel.findById(room.drawer.toString());
      room.playerList[index].points += points;
      player.cumulativePoints += points;
      drawer.cumulativePoints += Math.floor(points / 2);
      room.playerList[index].guessed = true;
      room.playerList[drawerIndex].points += Math.floor(points / 2);

      room.markModified('playerList');
      await player.save();
      await room.save();
    }

    for (let i = 0; i < room.playerList.length; i++) {
      if (room.playerList[i].guessed) ++guessed;
    }

    return guessed === room.playerList.length - 1 ? 2 : 1;
  }

  private async generateHash(password: string): Promise<string> {
    if (password === '') return '';

    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(password, salt);

    return hash;
  }
}
