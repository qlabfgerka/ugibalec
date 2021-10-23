import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./rooms/rooms.module').then((m) => m.RoomsModule),
      },
      {
        path: `lobby`,
        loadChildren: () =>
          import('./lobby/lobby.module').then((m) => m.LobbyModule),
      },
      {
        path: `game`,
        loadChildren: () =>
          import('./game/game.module').then((m) => m.GameModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeRoutingModule {}
