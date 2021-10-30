import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WordpacksRoutingModule } from './wordpacks-routing.module';
import { WordpacksComponent } from './wordpacks.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [WordpacksComponent],
  imports: [
    CommonModule,
    WordpacksRoutingModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
  ],
})
export class WordpacksModule {}
