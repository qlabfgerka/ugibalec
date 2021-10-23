import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-password-dialog',
  templateUrl: './password-dialog.component.html',
  styleUrls: ['./password-dialog.component.scss'],
})
export class PasswordDialogComponent implements OnInit {
  public passwordForm: FormGroup;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly dialogRef: MatDialogRef<PasswordDialogComponent>
  ) {}

  ngOnInit(): void {
    this.passwordForm = this.formBuilder.group({
      password: ['', [Validators.required]],
    });
  }

  public enterPassword(): void {
    if (this.passwordForm.valid) {
      this.dialogRef.close(this.passwordForm.get('password').value);
    }
  }

  public get errorControl() {
    return this.passwordForm.controls;
  }
}
