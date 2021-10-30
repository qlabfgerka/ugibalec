import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { mergeMap, take } from 'rxjs/operators';
import { UserDTO } from 'src/app/models/user/user.model';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  public user: UserDTO;
  public isLoading: boolean;
  public nicknameForm: FormGroup;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly userService: UserService,
    private readonly formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.refreshUser();
  }

  public changeNickname(): void {
    if (this.nicknameForm.valid) {
      console.log();
      this.userService
        .changeNickname(this.nicknameForm.get('nickname').value)
        .pipe(take(1))
        .subscribe((user: UserDTO) => {
          this.user = user;
        });
    }
  }

  private refreshUser(): void {
    this.isLoading = true;
    this.route.paramMap
      .pipe(
        take(1),
        mergeMap((paramMap) =>
          this.userService.getUser(paramMap.get('id')).pipe(take(1))
        )
      )
      .subscribe((user: UserDTO) => {
        this.user = user;
        this.initForm();
        this.isLoading = false;
      });
  }

  private initForm(): void {
    this.nicknameForm = this.formBuilder.group({
      nickname: [this.user.nickname, [Validators.required]],
    });
  }
}
