import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { TokenDTO } from 'src/app/models/token/token.model';
import { UserDTO } from 'src/app/models/user/user.model';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  public loginForm: FormGroup;
  public error: string;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly userService: UserService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  public login(): void {
    this.error = '';
    if (this.loginForm.valid) {
      const user: UserDTO = {
        username: this.loginForm.get('username').value,
        password: this.loginForm.get('password').value,
        cumulativePoints: 0,
        email: '',
        gamesPlayed: 0,
        nickname: '',
        wins: 0,
      };

      this.userService
        .login(user)
        .pipe(take(1))
        .subscribe(
          (tokens: TokenDTO) => {
            this.userService.saveTokens(tokens);

            this.router.navigate(['']);
          },
          (error) => {
            this.error = error.error.error;
          }
        );
    }
  }

  public get errorControl() {
    return this.loginForm.controls;
  }
}
