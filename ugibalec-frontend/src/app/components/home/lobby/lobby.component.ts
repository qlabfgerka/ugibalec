import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { mergeMap, take } from 'rxjs/operators';
import { RoomDTO } from 'src/app/models/room/room.model';
import { UserDTO } from 'src/app/models/user/user.model';
import { WordpackDTO } from 'src/app/models/wordpack/wordpack.model';
import { RoomService } from 'src/app/services/room/room.service';
import { WordpackService } from 'src/app/services/wordpack/wordpack.service';

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.scss'],
})
export class LobbyComponent implements OnInit {
  public room: RoomDTO;
  public dataSource: MatTableDataSource<UserDTO>;
  public displayedColumns: string[] = ['name', 'kick'];
  public roomForm: FormGroup;
  public wordpacks: Array<WordpackDTO>;
  public isLoading: boolean;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly roomService: RoomService,
    private readonly wordpackService: WordpackService,
    private readonly formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.route.params
      .pipe(
        mergeMap((params: Params) =>
          forkJoin([
            this.roomService.getRoom(params.id).pipe(take(1)),
            this.wordpackService.getWordpacks().pipe(take(1)),
          ])
        )
      )
      .subscribe((response) => {
        this.room = response[0];
        this.wordpacks = response[1];
        this.dataSource = new MatTableDataSource(this.room.playerList);

        this.roomForm = this.formBuilder.group({
          title: [this.room.title, [Validators.required]],
          password: [this.room.password],
          maxPlayers: [
            this.room.maxPlayers,
            [Validators.required, Validators.min(3), Validators.max(8)],
          ],
          wordpack: [this.room.wordpack.id, [Validators.required]],
        });

        this.isLoading = false;
      });
  }

  public startGame(): void {
    this.router.navigate(['/game']);
  }

  public kickPlayer(id: string): void {
    console.log(id);
  }

  public updateRoom(): void {
    if (this.roomForm.valid) {
      this.room.maxPlayers = this.roomForm.get('maxPlayers').value;
      this.room.password = this.roomForm.get('password').value;
      this.room.title = this.roomForm.get('title').value;
      this.room.wordpack = this.wordpacks.find(
        (wordpack) => this.roomForm.get('wordpack').value === wordpack.id
      );

      this.roomService
        .updateRoom(this.room)
        .pipe(take(1))
        .subscribe((room: RoomDTO) => {
          this.room = room;
        });
    }
  }

  public get errorControl() {
    return this.roomForm.controls;
  }
}
