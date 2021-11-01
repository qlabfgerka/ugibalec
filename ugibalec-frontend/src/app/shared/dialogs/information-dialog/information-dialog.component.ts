import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-information-dialog',
  templateUrl: './information-dialog.component.html',
  styleUrls: ['./information-dialog.component.scss'],
})
export class InformationDialogComponent implements OnInit {
  public information: string;

  constructor(@Inject(MAT_DIALOG_DATA) private data: any) {
    if (this.data) {
      this.information = this.data.information;
    }
  }

  ngOnInit(): void {}
}
