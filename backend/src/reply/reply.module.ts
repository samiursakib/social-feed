import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { ReplyController } from './reply.controller.js';
import { ReplyService } from './reply.service.js';

@Module({
  controllers: [ReplyController],
  providers: [ReplyService, PrismaService],
})
export class ReplyModule {}
