import { Module } from '@nestjs/common';
import { FeedService } from './feed.service.js';
import { FeedController } from './feed.controller.js';

@Module({
  controllers: [FeedController],
  providers: [FeedService],
})
export class FeedModule {}
