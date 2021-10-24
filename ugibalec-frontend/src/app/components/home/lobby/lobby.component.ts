import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, NavigationEnd, Params, Router } from '@angular/router';
import { forkJoin, Subscription } from 'rxjs';
import { mergeMap, take } from 'rxjs/operators';
import { RoomDTO } from 'src/app/models/room/room.model';
import { UserDTO } from 'src/app/models/user/user.model';
import { WordpackDTO } from 'src/app/models/wordpack/wordpack.model';
import { RoomService } from 'src/app/services/room/room.service';
import { SocketService } from 'src/app/services/socket/socket.service';
import { AuthService } from 'src/app/services/user/auth/auth.service';
import { WordpackService } from 'src/app/services/wordpack/wordpack.service';

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.scss'],
})
export class LobbyComponent implements OnInit, OnDestroy {
  public room: RoomDTO;
  public dataSource: MatTableDataSource<UserDTO>;
  public displayedColumns: string[] = ['name', 'kick'];
  public roomForm: FormGroup;
  public wordpacks: Array<WordpackDTO>;
  public isLoading: boolean;
  public userId: string;
  private subscription: Subscription;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly roomService: RoomService,
    private readonly wordpackService: WordpackService,
    private readonly formBuilder: FormBuilder,
    private readonly socketService: SocketService,
    private readonly authService: AuthService
  ) {}

  ngOnInit(): void {
    this.userId = this.authService.getUserID();
    this.refreshRoom();

    this.socketService.socket.on('roomChanged', () => {
      this.refreshRoom();
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.socketService.socket.off('roomChanged');

    this.socketService.leaveRoom(this.room.id);
    this.roomService
      .leaveRoom(this.room.id)
      .pipe(take(1))
      .subscribe(() => {});
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
        .subscribe(() => {
          this.refreshRoom();
        });
    }
  }

  public get errorControl() {
    return this.roomForm.controls;
  }

  private refreshRoom(): void {
    this.isLoading = true;

    this.subscription = this.route.paramMap
      .pipe(
        take(1),
        mergeMap((paramMap) => {
          return forkJoin([
            this.roomService.getRoom(paramMap.get('id')).pipe(take(1)),
            this.wordpackService.getWordpacks().pipe(take(1)),
          ]);
        })
      )
      .subscribe((response) => {
        this.room = response[0];
        this.wordpacks = response[1];
        this.dataSource = new MatTableDataSource(this.room.playerList);
        console.log(this.room);

        this.roomForm = this.formBuilder.group({
          title: [this.room.title, [Validators.required]],
          password: [this.room.password],
          maxPlayers: [
            this.room.maxPlayers,
            [Validators.required, Validators.min(3), Validators.max(8)],
          ],
          wordpack: [this.room.wordpack.id, [Validators.required]],
        });

        if (this.room.admin.id !== this.userId) this.roomForm.disable();

        this.isLoading = false;
      });
  }
}
