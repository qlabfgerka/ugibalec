import { Controller, Get } from '@nestjs/common';
import { Wordpack } from 'src/models/wordpack/wordpack.model';
import { WordpackService } from './wordpack.service';

@Controller('wordpack')
export class WordpackController {
  constructor(private readonly wordpackService: WordpackService) {}

  @Get()
  public async getWordpacks(): Promise<Array<Wordpack>> {
    return await this.wordpackService.getWordpacks();
  }
}
