import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { take } from 'rxjs/operators';
import { UserDTO } from 'src/app/models/user/user.model';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  public loginForm: FormGroup;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly userService: UserService
  ) {}

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  public login(): void {
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
        .subscribe((result) => {
          console.log(result);
        });
    }
  }

  public get errorControl() {
    return this.loginForm.controls;
  }
}
