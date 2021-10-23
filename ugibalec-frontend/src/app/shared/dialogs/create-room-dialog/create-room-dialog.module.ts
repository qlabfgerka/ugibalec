import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CreateRoomDialogRoutingModule } from './create-room-dialog-routing.module';
import { CreateRoomDialogComponent } from './create-room-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';

@NgModule({
  declarations: [CreateRoomDialogComponent],
  imports: [
    CommonModule,
    CreateRoomDialogRoutingModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
  ],
  exports: [CreateRoomDialogComponent],
})
export class CreateRoomDialogModule {}
