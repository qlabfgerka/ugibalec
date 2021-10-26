import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { mergeMap, take } from 'rxjs/operators';
import { RoomDTO } from 'src/app/models/room/room.model';
import { PlayerDTO, UserDTO } from 'src/app/models/user/user.model';
import { RoomService } from 'src/app/services/room/room.service';
import { SocketService } from 'src/app/services/socket/socket.service';
import { AuthService } from 'src/app/services/user/auth/auth.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
})
export class GameComponent implements OnInit {
  @ViewChild('canvas', { static: false }) canvas: ElementRef<HTMLCanvasElement>;

  public displayedColumns: string[] = ['name', 'points'];
  public dataSource: MatTableDataSource<PlayerDTO>;
  public room: RoomDTO;
  public isLoading: boolean;
  public context: CanvasRenderingContext2D;
  public drawing: boolean;
  public interval: ReturnType<typeof setInterval>;
  public counter: number;
  public seconds: number;
  public guessForm: FormGroup;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly roomService: RoomService,
    private readonly authService: AuthService,
    private readonly socketService: SocketService,
    private readonly formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.guessForm = this.formBuilder.group({
      guess: ['', [Validators.required]],
    });

    this.refreshRoom(true);

    this.socketService.socket.on(
      'drawingChanged',
      (data: { drawing: string; seconds: number }) => {
        const image = new Image();
        image.onload = () => {
          this.context.drawImage(image, 0, 0);
        };
        image.src = data.drawing;
        if (data.seconds % 1000 === 0) {
          this.seconds = data.seconds;
        }
      }
    );

    this.socketService.socket.on('guessed', () => {
      this.refreshRoom();
    });
  }

  public guess(): void {
    if (this.guessForm.valid && this.getUserID !== this.room.drawer.id) {
      this.roomService
        .guess(
          this.room.id,
          this.guessForm.get('guess').value,
          Math.floor(this.seconds / 1000)
        )
        .pipe(take(1))
        .subscribe((result: number) => {
          console.log(result);
        });
    }
  }

  public get getUserID(): string {
    return this.authService.getUserID();
  }

  public get getUser(): PlayerDTO {
    return this.room.playerList.find(
      (player: PlayerDTO) => player.player.id === this.getUserID
    );
  }

  private refreshRoom(init: boolean = false): void {
    this.isLoading = true;
    if (init) {
      this.counter = 60000 * 1;
      this.seconds = 60000 * 1;
    }

    this.route.paramMap
      .pipe(
        take(1),
        mergeMap((paramMap) =>
          this.roomService.getRoom(paramMap.get('id')).pipe(take(1))
        )
      )
      .subscribe((room: RoomDTO) => {
        this.room = room;
        this.room.playerList = this.room.playerList.sort(
          (a, b) => b.points - a.points
        );
        this.dataSource = new MatTableDataSource(this.room.playerList);

        if (init) {
          this.initCanvas();
        }

        this.isLoading = false;
      });
  }

  private initCanvas(): void {
    this.drawing = false;
    this.context = this.canvas.nativeElement.getContext('2d');

    if (this.room.drawer.id === this.getUserID) {
      if (this.room.drawer.id === this.getUserID) {
        this.interval = setInterval(() => {
          this.counter -= 50;
          this.socketService.updateDrawing(
            this.room.id,
            this.canvas.nativeElement.toDataURL(),
            this.counter
          );
          if (this.counter === 0) console.log('time up');
        }, 50);
      } else {
        if (this.interval) clearInterval(this.interval);
      }

      this.canvas.nativeElement.addEventListener('mouseup', () => {
        this.drawing = false;
        this.context.beginPath();
      });
      this.canvas.nativeElement.addEventListener('mousedown', () => {
        this.drawing = true;
      });
      this.canvas.nativeElement.addEventListener('mousemove', (event) => {
        if (!this.drawing) return;

        const rect = this.canvas.nativeElement.getBoundingClientRect();
        const x = Math.round(
          ((event.clientX - rect.left) / (rect.right - rect.left)) *
            this.canvas.nativeElement.width
        );
        const y = Math.round(
          ((event.clientY - rect.top) / (rect.bottom - rect.top)) *
            this.canvas.nativeElement.height
        );

        this.context.lineWidth = 5;
        this.context.lineCap = 'round';

        this.context.lineTo(x, y);
        this.context.stroke();
        this.context.beginPath();
        this.context.moveTo(x, y);
      });
    }
  }
}
