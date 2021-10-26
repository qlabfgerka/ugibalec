import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { mergeMap, take } from 'rxjs/operators';
import { RoomDTO } from 'src/app/models/room/room.model';
import { PlayerDTO } from 'src/app/models/user/user.model';
import { RoomService } from 'src/app/services/room/room.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
})
export class GameComponent implements OnInit {
  public displayedColumns: string[] = ['name', 'points'];
  public dataSource: MatTableDataSource<PlayerDTO>;
  public room: RoomDTO;
  public isLoading: boolean;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly roomService: RoomService
  ) {}

  ngOnInit(): void {
    this.refreshRoom();
  }

  private refreshRoom(): void {
    this.isLoading = true;

    this.route.paramMap
      .pipe(
        take(1),
        mergeMap((paramMap) =>
          this.roomService.getRoom(paramMap.get('id')).pipe(take(1))
        )
      )
      .subscribe((room: RoomDTO) => {
        this.room = room;
        /*this.room.playerList = this.room.playerList.sort(
          (a, b) => a.points - b.points
        );*/
        console.log(this.room);
        this.dataSource = new MatTableDataSource(this.room.playerList);
        this.isLoading = false;
      });
  }
}
