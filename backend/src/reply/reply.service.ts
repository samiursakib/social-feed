import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { TargetType } from '../../prisma/generated/prisma/client.js';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class ReplyService {
  constructor(private prisma: PrismaService) {}
  // create(createReplyDto: CreateReplyDto) {
  //   return 'This action adds a new reply';
  // }

  findAll() {
    return `This action returns all reply`;
  }

  findOne(id: number) {
    return `This action returns a #${id} reply`;
  }

  // update(id: number, updateReplyDto: UpdateReplyDto) {
  //   return `This action updates a #${id} reply`;
  // }

  remove(id: number) {
    return `This action removes a #${id} reply`;
  }

  async likeReply(replyId: string, userId: string) {
    const reply = await this.prisma.reply.findUnique({
      where: { id: replyId },
      select: { id: true },
    });

    if (!reply) {
      throw new NotFoundException('Reply not found.');
    }

    const alreadyLiked = await this.prisma.like.findUnique({
      where: {
        userId_targetType_targetId: {
          userId,
          targetType: TargetType.REPLY,
          targetId: replyId,
        },
      },
    });

    if (alreadyLiked) {
      throw new BadRequestException('Reply already liked.');
    }

    const [like] = await this.prisma.$transaction([
      this.prisma.like.create({
        data: {
          userId,
          targetType: TargetType.REPLY,
          targetId: replyId,
          replyId,
        },
        select: {
          id: true,
          userId: true,
        },
      }),

      this.prisma.reply.update({
        where: {
          id: replyId,
        },
        data: {
          likeCount: {
            increment: 1,
          },
        },
      }),
    ]);

    return like;
  }

  async unlikeReply(replyId: string, userId: string) {
    const like = await this.prisma.like.findUnique({
      where: {
        userId_targetType_targetId: {
          userId,
          targetType: TargetType.REPLY,
          targetId: replyId,
        },
      },
    });

    if (!like) {
      throw new BadRequestException('Reply is not liked.');
    }

    await this.prisma.$transaction([
      this.prisma.like.delete({
        where: {
          id: like.id,
        },
      }),

      this.prisma.reply.update({
        where: {
          id: replyId,
        },
        data: {
          likeCount: {
            decrement: 1,
          },
        },
      }),
    ]);

    return {
      success: true,
      userId,
      message: 'Reply unliked.',
    };
  }
}
