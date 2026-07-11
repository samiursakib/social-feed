import { Module } from '@nestjs/common';
import { LikeService } from './like.service.js';
import { LikeController } from './like.controller.js';

@Module({
  controllers: [LikeController],
  providers: [LikeService],
})
export class LikeModule {}
