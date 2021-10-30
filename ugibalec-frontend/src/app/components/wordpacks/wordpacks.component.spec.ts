import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WordpacksComponent } from './wordpacks.component';

describe('WordpacksComponent', () => {
  let component: WordpacksComponent;
  let fixture: ComponentFixture<WordpacksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WordpacksComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WordpacksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
