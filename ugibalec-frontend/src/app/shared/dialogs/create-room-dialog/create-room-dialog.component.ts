import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { take } from 'rxjs/operators';
import { RoomDTO } from 'src/app/models/room/room.model';
import { WordpackDTO } from 'src/app/models/wordpack/wordpack.model';
import { WordpackService } from 'src/app/services/wordpack/wordpack.service';

@Component({
  selector: 'app-create-room-dialog',
  templateUrl: './create-room-dialog.component.html',
  styleUrls: ['./create-room-dialog.component.scss'],
})
export class CreateRoomDialogComponent implements OnInit {
  public roomForm: FormGroup;
  public wordpacks: Array<WordpackDTO>;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly wordpackService: WordpackService,
    private readonly dialogRef: MatDialogRef<CreateRoomDialogComponent>
  ) {}

  ngOnInit(): void {
    this.roomForm = this.formBuilder.group({
      title: ['', [Validators.required]],
      password: [''],
      maxPlayers: [
        8,
        [Validators.required, Validators.min(3), Validators.max(8)],
      ],
      wordpack: ['', [Validators.required]],
    });

    this.wordpackService
      .getWordpacks()
      .pipe(take(1))
      .subscribe((wordpacks: Array<WordpackDTO>) => {
        this.wordpacks = wordpacks;
      });
  }

  public createRoom(): void {
    if (this.roomForm.valid) {
      const room: RoomDTO = {
        maxPlayers: this.roomForm.get('maxPlayers').value,
        password: this.roomForm.get('password').value,
        title: this.roomForm.get('title').value,
        wordpack: this.wordpacks.find(
          (wordpack) => this.roomForm.get('wordpack').value === wordpack.id
        ),
      };

      this.dialogRef.close(room);
    }
  }

  public get errorControl() {
    return this.roomForm.controls;
  }
}
