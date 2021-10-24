import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { SocketService } from 'src/services/socket/socket.service';

@WebSocketGateway({ cors: true })
export class RoomGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private readonly socketService: SocketService) {}

  afterInit(server: Server): void {
    this.socketService.server = server;
  }

  handleConnection(client: any, ...args: any[]): void {
    console.log(`${client.id} connected`);
  }

  handleDisconnect(client: any): void {
    console.log(`${client.id} disconnected`);
  }

  @SubscribeMessage('joinRoom')
  public handleJoinRoom(client: Socket, roomId: string): void {
    client.join(roomId);
    client.emit('joinedRoom', roomId);
  }

  @SubscribeMessage('leaveRoom')
  public handleLeaveRoom(client: Socket, roomId: string): void {
    client.leave(roomId);
    client.emit('leftRoom', roomId);
  }
}
