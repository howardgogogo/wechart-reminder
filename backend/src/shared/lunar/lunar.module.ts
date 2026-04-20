import { Module } from '@nestjs/common';
import { LunarService } from './lunar.service';

@Module({
  providers: [LunarService],
  exports: [LunarService],
})
export class LunarModule {}
