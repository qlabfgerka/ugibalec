import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WordpacksComponent } from './wordpacks.component';

const routes: Routes = [{ path: '', component: WordpacksComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WordpacksRoutingModule {}
