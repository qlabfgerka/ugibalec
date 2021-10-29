import { Component, HostListener } from '@angular/core';
import { take } from 'rxjs/operators';
import { RoomService } from './services/room/room.service';
import { SocketService } from './services/socket/socket.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor(
    private readonly roomService: RoomService,
    private readonly socketService: SocketService
  ) {}

  @HostListener('window:beforeunload')
  beforeUnloadHandler(): void {
    this.roomService
      .leaveRooms()
      .pipe(take(1))
      .subscribe(() => {
        this.socketService.stopListening();
      });
  }

  public title: string = 'Ugibalec';
}
