import { Component, OnInit } from '@angular/core';
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
export class RoomsComponent implements OnInit {
  public rooms: Array<RoomDTO>;
  public displayedColumns: string[] = ['title', 'players', 'locked', 'join'];
  public dataSource: MatTableDataSource<RoomDTO>;

  constructor(
    private readonly router: Router,
    private readonly roomService: RoomService,
    private readonly dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.refreshRooms();
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
        if (room.password === password) {
          this.router.navigate([`lobby/${room.id}`]);
        }
      });
    } else {
      this.router.navigate([`lobby/${room.id}`]);
    }
  }
}
