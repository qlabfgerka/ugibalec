import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { WordpackDTO } from 'src/app/models/wordpack/wordpack.model';
import { WordpackService } from 'src/app/services/wordpack/wordpack.service';

@Component({
  selector: 'app-wordpacks',
  templateUrl: './wordpacks.component.html',
  styleUrls: ['./wordpacks.component.scss'],
})
export class WordpacksComponent implements OnInit {
  public wordpackForm: FormGroup;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly wordpackService: WordpackService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.wordpackForm = this.formBuilder.group({
      title: ['', [Validators.required]],
      words: this.formBuilder.array([['']]),
    });
  }

  public createWordpack(): void {
    if (this.wordpackForm.valid) {
      const wordpack: WordpackDTO = {
        title: this.wordpackForm.get('title').value,
        words: [],
      };
      this.words.value.forEach((word: string) => {
        if (word.length > 0) wordpack.words.push(word);
      });

      this.wordpackService
        .createWordpack(wordpack)
        .pipe(take(1))
        .subscribe(() => {
          this.router.navigate(['']);
        });
    }
  }

  public addField(): void {
    this.words.push(this.formBuilder.control(''));
  }

  public get words(): FormArray {
    return this.wordpackForm.get('words') as FormArray;
  }
}
