import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { RoomDTO } from 'src/app/models/room/room.model';
import { RoomService } from 'src/app/services/room/room.service';
import { MatDialog } from '@angular/material/dialog';
import { CreateRoomDialogComponent } from 'src/app/shared/dialogs/create-room-dialog/create-room-dialog.component';
import { MatTableDataSource } from '@angular/material/table';
import { PasswordDialogComponent } from 'src/app/shared/dialogs/password-dialog/password-dialog.component';

@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.scss'],
})
export class RoomsComponent implements OnInit, AfterViewInit, OnDestroy {
  public rooms: Array<RoomDTO>;
  public displayedColumns: string[] = ['title', 'players', 'locked', 'join'];
  public dataSource: MatTableDataSource<RoomDTO>;
  public interval: ReturnType<typeof setInterval>;

  constructor(
    private readonly router: Router,
    private readonly roomService: RoomService,
    private readonly dialog: MatDialog
  ) {}

  ngOnDestroy(): void {
    if (this.interval) clearInterval(this.interval);
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.refreshRooms();
    }, 500);
  }

  ngOnInit(): void {
    this.interval = setInterval(() => {
      this.refreshRooms();
    }, 5000);
  }

  public createRoom(): void {
    const dialogRef = this.dialog.open(CreateRoomDialogComponent);

    dialogRef.afterClosed().subscribe((room: RoomDTO) => {
      if (room) {
        this.roomService
          .createRoom(room)
          .pipe(take(1))
          .subscribe((newRoom: RoomDTO) => {
            this.router.navigate([`lobby/${newRoom.id}`]);
          });
      }
    });
  }

  public refreshRooms(): void {
    this.roomService
      .getRooms()
      .pipe(take(1))
      .subscribe((rooms: Array<RoomDTO>) => {
        this.rooms = rooms;
        this.dataSource = new MatTableDataSource(this.rooms);
      });
  }

  public joinRoom(room: RoomDTO): void {
    if (room.playerList.length >= room.maxPlayers) return;

    if (room.password) {
      const dialogRef = this.dialog.open(PasswordDialogComponent);

      dialogRef.afterClosed().subscribe((password: string) => {
        this.connect(room, password);
      });
    } else {
      this.connect(room, '');
    }
  }

  private connect(room: RoomDTO, password: string): void {
    this.roomService
      .joinRoom(room.id, password)
      .pipe(take(1))
      .subscribe((connected: boolean) => {
        if (connected) {
          if (room.currentWord) this.router.navigate([`game/${room.id}`]);
          else this.router.navigate([`lobby/${room.id}`]);
        }
      });
  }
}
