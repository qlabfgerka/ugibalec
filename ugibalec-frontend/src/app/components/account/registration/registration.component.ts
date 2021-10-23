import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { throwError } from 'rxjs';
import { catchError, mergeMap, take } from 'rxjs/operators';
import { TokenDTO } from 'src/app/models/token/token.model';
import { UserDTO } from 'src/app/models/user/user.model';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss'],
})
export class RegistrationComponent implements OnInit {
  public registerForm: FormGroup;
  public error: string;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly userService: UserService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      username: ['', [Validators.required]],
      email: ['', [Validators.email, Validators.required]],
      password: ['', [Validators.required]],
      repeat: ['', [Validators.required]],
    });
  }

  public register(): void {
    this.error = '';
    if (this.registerForm.valid) {
      if (
        this.registerForm.get('password').value !==
        this.registerForm.get('repeat').value
      ) {
        this.error = 'Passwords do not match';
        this.registerForm.get('repeat').setErrors({ incorrect: true });
        return;
      }

      const user: UserDTO = {
        username: this.registerForm.get('username').value,
        email: this.registerForm.get('email').value,
        password: this.registerForm.get('password').value,
        nickname: '',
        cumulativePoints: 0,
        gamesPlayed: 0,
        wins: 0,
      };

      this.userService
        .register(user)
        .pipe(
          take(1),
          mergeMap(() => this.userService.login(user)),
          catchError((error) => throwError(error))
        )
        .subscribe(
          (tokens: TokenDTO) => {
            this.userService.saveTokens(tokens);

            this.router.navigate(['']);
          },
          (error) => {
            this.error = error.error.error;
            console.log(this.error);
            this.registerForm.setErrors({ incorrect: true });
          }
        );
    }
  }

  public get errorControl() {
    return this.registerForm.controls;
  }
}
