import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { SocketService } from 'src/app/services/socket/socket.service';
import { AuthService } from 'src/app/services/user/auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  constructor(
    private readonly authService: AuthService,
    private readonly socketService: SocketService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {}

  public get isLoggedIn(): boolean {
    return this.authService.isLoggedIn;
  }

  public logout(): void {
    this.authService
      .logout()
      .pipe(take(1))
      .subscribe(() => {
        this.authService.deleteTokens();

        this.router.navigate(['login']);
      });
  }

  public leaveRoom(): void {
    this.socketService.socket.off('roomChanged');
    this.socketService.socket.off('kicked');
    this.socketService.socket.off('gameStarted');
  }
}
