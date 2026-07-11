import { Module } from '@nestjs/common';
import { ReplyService } from './reply.service.js';
import { ReplyController } from './reply.controller.js';

@Module({
  controllers: [ReplyController],
  providers: [ReplyService],
})
export class ReplyModule {}
