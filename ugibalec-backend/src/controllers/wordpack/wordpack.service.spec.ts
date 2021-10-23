import { Test, TestingModule } from '@nestjs/testing';
import { WordpackService } from './wordpack.service';

describe('WordpackService', () => {
  let service: WordpackService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WordpackService],
    }).compile();

    service = module.get<WordpackService>(WordpackService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
