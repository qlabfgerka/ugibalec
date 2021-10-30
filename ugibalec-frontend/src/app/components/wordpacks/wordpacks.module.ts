import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WordpacksRoutingModule } from './wordpacks-routing.module';
import { WordpacksComponent } from './wordpacks.component';

@NgModule({
  declarations: [WordpacksComponent],
  imports: [CommonModule, WordpacksRoutingModule],
})
export class WordpacksModule {}
