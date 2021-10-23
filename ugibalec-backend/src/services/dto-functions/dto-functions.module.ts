import { Module } from '@nestjs/common';
import { DtoFunctionsService } from './dto-functions.service';

@Module({
  providers: [DtoFunctionsService],
  exports: [DtoFunctionsService],
})
export class DtoFunctionsModule {}
