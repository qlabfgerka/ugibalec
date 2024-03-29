import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Room } from 'src/models/room/room.model';
import { Player, User, UserDocument } from 'src/models/user/user.model';
import { Wordpack, WordpackDocument } from 'src/models/wordpack/wordpack.model';

@Injectable()
export class DtoFunctionsService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Wordpack.name) private wordpackModel: Model<WordpackDocument>,
  ) {}

  public userToDTO(user: User): User {
    if (!user) return undefined;
    const userDTO: User = {
      id: user.id,
      email: user.email,
      username: user.username,
      nickname: user.nickname,
      wins: user.wins,
      cumulativePoints: user.cumulativePoints,
      gamesPlayed: user.gamesPlayed,
    };

    return userDTO;
  }

  public usersToDTO(users: Array<User>): Array<User> {
    const usersDTO = new Array<User>();

    users.forEach((user: User) => {
      usersDTO.push(this.userToDTO(user));
    });

    return usersDTO;
  }

  public async playerToDTO(player: Player): Promise<Player> {
    const playerToDTO: Player = {
      id: player.id,
      player: this.userToDTO(await this.getUser(player.player)),
      guessed: player.guessed,
      points: player.points,
    };

    return playerToDTO;
  }

  public async playersToDTO(players: Array<Player>): Promise<Array<Player>> {
    const playersDTO = new Array<Player>();

    for (const player of players) {
      playersDTO.push(await this.playerToDTO(player));
    }

    return playersDTO;
  }

  public wordpackToDTO(wordpack: Wordpack): Wordpack {
    const wordpackDTO: Wordpack = {
      id: wordpack.id,
      title: wordpack.title,
      words: wordpack.words,
    };

    return wordpackDTO;
  }

  public wordpacksToDTO(wordpacks: Array<Wordpack>): Array<Wordpack> {
    const wordpacksDTO = new Array<Wordpack>();

    wordpacks.forEach((wordpack: Wordpack) => {
      wordpacksDTO.push(this.wordpackToDTO(wordpack));
    });

    return wordpacksDTO;
  }

  public async roomToDTO(room: Room): Promise<Room> {
    const roomDTO: Room = {
      id: room.id,
      playerList: await this.playersToDTO(room.playerList),
      maxPlayers: room.maxPlayers,
      password: room.password,
      title: room.title,
      wordpack: this.wordpackToDTO(await this.getWordpack(room.wordpack)),
      admin: this.userToDTO(await this.getUser(room.admin)),
      currentWord: room.currentWord,
      drawer: this.userToDTO(await this.getUser(room.drawer)),
      rounds: room.rounds,
    };

    return roomDTO;
  }

  public async roomsToDTO(rooms: Array<Room>): Promise<Array<Room>> {
    const roomsDTO = new Array<Room>();

    for (const room of rooms) {
      roomsDTO.push(await this.roomToDTO(room));
    }

    return roomsDTO;
  }

  public async getUsers(users: Array<User>): Promise<Array<User>> {
    const usersDTO = new Array<User>();

    for (const user of users) {
      if (user.nickname) {
        usersDTO.push(await this.getUser(user));
      } else usersDTO.push(await this.getUser(user));
    }

    return usersDTO;
  }

  public async getUser(user: User): Promise<User> {
    if (!user) return undefined;
    if (user.nickname) {
      return await this.userModel.findById(user.id);
    } else return await this.userModel.findById(user.toString());
  }

  public async getWordpack(wordpack: Wordpack): Promise<Wordpack> {
    if (wordpack.title) {
      return await this.wordpackModel.findById(wordpack.id);
    } else return await this.wordpackModel.findById(wordpack.toString());
  }
}
