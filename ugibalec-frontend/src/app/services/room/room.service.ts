import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RoomDTO } from 'src/app/models/room/room.model';

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
}