import { TestBed } from '@angular/core/testing';

import { WordpackService } from './wordpack.service';

describe('WordpackService', () => {
  let service: WordpackService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WordpackService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
