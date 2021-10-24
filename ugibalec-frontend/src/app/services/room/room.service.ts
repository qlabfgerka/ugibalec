import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RoomDTO } from 'src/app/models/room/room.model';
import { UserDTO } from 'src/app/models/user/user.model';

@Injectable({
  providedIn: 'root',
})
export class RoomService {
  private readonly hostname: string = 'http://localhost:3000';

  constructor(private readonly httpClient: HttpClient) {}

  public getRooms(): Observable<Array<RoomDTO>> {
    return this.httpClient.get<Array<RoomDTO>>(`${this.hostname}/room`);
  }

  public getRoom(roomId: string): Observable<RoomDTO> {
    return this.httpClient.get<RoomDTO>(`${this.hostname}/room/${roomId}`);
  }

  public createRoom(room: RoomDTO): Observable<RoomDTO> {
    return this.httpClient.post<RoomDTO>(`${this.hostname}/room/create`, {
      room,
    });
  }

  public updateRoom(room: RoomDTO): Observable<RoomDTO> {
    return this.httpClient.patch<RoomDTO>(`${this.hostname}/room/update`, {
      room,
    });
  }

  public joinRoom(roomId: string, password: string): Observable<boolean> {
    return this.httpClient.patch<boolean>(
      `${this.hostname}/room/join/${roomId}`,
      { password }
    );
  }

  public leaveRoom(roomId: string): Observable<boolean> {
    return this.httpClient.patch<boolean>(
      `${this.hostname}/room/leave/${roomId}`,
      {}
    );
  }

  public kickPlayer(roomId: string, user: UserDTO): Observable<boolean> {
    return this.httpClient.patch<boolean>(
      `${this.hostname}/room/kick/${roomId}`,
      { user }
    );
  }
}
