import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { PlayerDTO } from 'src/app/models/user/user.model';
import { RoomService } from 'src/app/services/room/room.service';
import { AuthService } from 'src/app/services/user/auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class RoomGuard implements CanActivate {
  constructor(
    private readonly roomService: RoomService,
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}
  canActivate(route: ActivatedRouteSnapshot): Observable<boolean | UrlTree> {
    const id = route.paramMap.get('id');

    return this.roomService.getRoom(id).pipe(
      take(1),
      map((room) =>
        room.playerList.find(
          (player: PlayerDTO) =>
            player.player.id === this.authService.getUserID()
        )
          ? true
          : this.router.createUrlTree([``])
      )
    );
  }
}
