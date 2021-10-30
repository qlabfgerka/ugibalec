import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { Wordpack } from 'src/models/wordpack/wordpack.model';
import { JwtAuthGuard } from '../user/auth/guards/jwt-auth.guard';
import { WordpackService } from './wordpack.service';

@Controller('wordpack')
export class WordpackController {
  constructor(private readonly wordpackService: WordpackService) {}

  @Get()
  public async getWordpacks(): Promise<Array<Wordpack>> {
    return await this.wordpackService.getWordpacks();
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  public async createWordpack(
    @Body('wordpack') wordpack: Wordpack,
  ): Promise<Wordpack> {
    return await this.wordpackService.createWordpack(wordpack);
  }
}
