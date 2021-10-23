import { Test, TestingModule } from '@nestjs/testing';
import { DtoFunctionsService } from './dto-functions.service';

describe('DtoFunctionsService', () => {
  let service: DtoFunctionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DtoFunctionsService],
    }).compile();

    service = module.get<DtoFunctionsService>(DtoFunctionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
