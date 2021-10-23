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
import { JwtAuthGuard } from '../user/auth/guards/jwt-auth.guard';
import { RoomService } from './room.service';

@Controller('room')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

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
    return await this.roomService.updateRoom(req.user.id, room);
  }
}
