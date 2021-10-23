import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HeaderRoutingModule } from './header-routing.module';
import { HeaderComponent } from './header.component';
import { MatToolbarModule } from '@angular/material/toolbar';

@NgModule({
  declarations: [HeaderComponent],
  imports: [CommonModule, HeaderRoutingModule, MatToolbarModule],
  exports: [HeaderComponent],
})
export class HeaderModule {}
