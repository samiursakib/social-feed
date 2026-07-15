import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CommentController } from './comment.controller.js';
import { CommentService } from './comment.service.js';

@Module({
  controllers: [CommentController],
  providers: [CommentService, PrismaService],
})
export class CommentModule {}
