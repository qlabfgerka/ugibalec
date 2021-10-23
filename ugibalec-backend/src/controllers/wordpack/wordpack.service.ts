import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Wordpack, WordpackDocument } from 'src/models/wordpack/wordpack.model';
import { DtoFunctionsService } from 'src/services/dto-functions/dto-functions.service';

@Injectable()
export class WordpackService {
  constructor(
    @InjectModel(Wordpack.name) private wordpackModel: Model<WordpackDocument>,
    private readonly dtoFunctions: DtoFunctionsService,
  ) {}

  public async getWordpacks(): Promise<Array<Wordpack>> {
    const wordpacks = await this.wordpackModel.find().exec();

    return this.dtoFunctions.wordpacksToDTO(wordpacks);
  }
}
