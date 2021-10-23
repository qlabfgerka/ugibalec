import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RoomsRoutingModule } from './rooms-routing.module';
import { RoomsComponent } from './rooms.component';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { CreateRoomDialogModule } from 'src/app/shared/dialogs/create-room-dialog/create-room-dialog.module';
import { MatIconModule } from '@angular/material/icon';
import { PasswordDialogModule } from 'src/app/shared/dialogs/password-dialog/password-dialog.module';

@NgModule({
  declarations: [RoomsComponent],
  imports: [
    CommonModule,
    RoomsRoutingModule,
    MatTableModule,
    MatButtonModule,
    CreateRoomDialogModule,
    MatIconModule,
    PasswordDialogModule,
  ],
})
export class RoomsModule {}
