import { Test, TestingModule } from '@nestjs/testing';
import { WordpackController } from './wordpack.controller';

describe('WordpackController', () => {
  let controller: WordpackController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WordpackController],
    }).compile();

    controller = module.get<WordpackController>(WordpackController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
