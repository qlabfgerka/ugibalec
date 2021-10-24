import { Injectable } from '@nestjs/common';
import { WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@Injectable()
export class SocketService {
  @WebSocketServer() public server: Server;
  public clients: Array<{ client: Socket; userId: string; roomId: string }>;
}
