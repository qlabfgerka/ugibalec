import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  public socket: Socket;

  constructor() {
    this.socket = io('http://localhost:3000');
  }

  /*public disconnect(): void {
    if (this.socket) this.socket.disconnect();
  }*/

  public joinRoom(roomId: string, userId: string): void {
    this.socket.emit('joinRoom', { roomId, userId });
  }

  public leaveRoom(roomId: string): void {
    this.socket.emit('leaveRoom', roomId);
  }

  public kickPlayer(roomId: string, userId: string): void {
    this.socket.emit('kick', { roomId, userId });
  }

  public updateDrawing(roomId: string, drawing: string, seconds: number): void {
    this.socket.emit('draw', { roomId, drawing, seconds });
  }
}
