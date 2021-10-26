import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { Room } from 'src/models/room/room.model';
import { User } from 'src/models/user/user.model';
import { SocketService } from 'src/services/socket/socket.service';
import { JwtAuthGuard } from '../user/auth/guards/jwt-auth.guard';
import { RoomService } from './room.service';

@Controller('room')
export class RoomController {
  constructor(
    private readonly roomService: RoomService,
    private readonly socketService: SocketService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  public async getRooms(): Promise<Array<Room>> {
    return await this.roomService.getRooms();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  public async getRoom(@Param('id') roomId: string): Promise<Room> {
    return await this.roomService.getRoom(roomId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('create')
  public async createRoom(
    @Request() req: any,
    @Body('room') room: Room,
  ): Promise<Room> {
    return await this.roomService.createRoom(req.user.id, room);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('update')
  public async updateRoom(
    @Request() req: any,
    @Body('room') room: Room,
  ): Promise<Room> {
    const result = await this.roomService.updateRoom(req.user.id, room);
    this.socketService.server
      .to(result.id)
      .emit('roomChanged', 'hello from server');
    return result;
  }

  @UseGuards(JwtAuthGuard)
  @Patch('join/:id')
  public async joinRoom(
    @Request() req: any,
    @Body('password') password: string,
    @Param('id') id: string,
  ): Promise<boolean> {
    const result = await this.roomService.joinRoom(id, req.user.id, password);

    if (result) {
      this.socketService.server.to(id).emit('roomChanged', 'hello from server');
    }

    return result;
  }

  @UseGuards(JwtAuthGuard)
  @Patch('leave/:id')
  public async leaveRoom(
    @Request() req: any,
    @Param('id') id: string,
  ): Promise<boolean> {
    const result = await this.roomService.leaveRoom(id, req.user.id);

    if (result) {
      this.socketService.server
        .to(id)
        .emit('roomChanged', 'goodbye from server');
    }

    return result;
  }

  @UseGuards(JwtAuthGuard)
  @Patch('kick/:id')
  public async kickPlayer(
    @Param('id') roomId: string,
    @Body('user') user: User,
  ): Promise<boolean> {
    const result = await this.roomService.leaveRoom(roomId, user.id);

    if (result) {
      this.socketService.server
        .to(roomId)
        .emit('roomChanged', 'goodbye from server');
    }

    return result;
  }

  @UseGuards(JwtAuthGuard)
  @Patch('start/:id')
  public async startGame(
    @Param('id') roomId: string,
    @Request() req: any,
  ): Promise<boolean> {
    const result = await this.roomService.startGame(roomId, req.user.id);

    if (result) {
      this.socketService.server.to(roomId).emit('gameStarted', 'game started');
    }

    return result;
  }
}
