import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PasswordDialogRoutingModule } from './password-dialog-routing.module';
import { PasswordDialogComponent } from './password-dialog.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [PasswordDialogComponent],
  imports: [
    CommonModule,
    PasswordDialogRoutingModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatButtonModule,
  ],
  exports: [PasswordDialogComponent],
})
export class PasswordDialogModule {}
