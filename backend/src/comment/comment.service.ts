import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { TargetType } from '../../prisma/generated/prisma/enums.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateReplyDto } from '../reply/dto/create-reply.dto.js';

@Injectable()
export class CommentService {
  constructor(private prisma: PrismaService) {}

  // create(createCommentDto: CreateCommentDto) {
  //   return 'This action adds a new comment';
  // }

  findAll() {
    return `This action returns all comment`;
  }

  findOne(id: number) {
    return `This action returns a #${id} comment`;
  }

  // update(id: number, updateCommentDto: UpdateCommentDto) {
  //   return `This action updates a #${id} comment`;
  // }

  remove(id: number) {
    return `This action removes a #${id} comment`;
  }

  async likeComment(commentId: string, userId: string) {
    const comment = await this.prisma.comment.findUnique({
      where: { id: commentId },
      select: { id: true },
    });

    if (!comment) {
      throw new NotFoundException('Comment not found.');
    }

    const alreadyLiked = await this.prisma.like.findUnique({
      where: {
        userId_targetType_targetId: {
          userId,
          targetType: TargetType.COMMENT,
          targetId: commentId,
        },
      },
    });

    if (alreadyLiked) {
      throw new BadRequestException('Comment already liked.');
    }

    const [like] = await this.prisma.$transaction([
      this.prisma.like.create({
        data: {
          userId,
          targetType: TargetType.COMMENT,
          targetId: commentId,
          commentId,
        },
        select: {
          id: true,
          userId: true,
        },
      }),

      this.prisma.comment.update({
        where: {
          id: commentId,
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

  async unlikeComment(commentId: string, userId: string) {
    const like = await this.prisma.like.findUnique({
      where: {
        userId_targetType_targetId: {
          userId,
          targetType: TargetType.COMMENT,
          targetId: commentId,
        },
      },
    });

    if (!like) {
      throw new BadRequestException('Comment is not liked.');
    }

    await this.prisma.$transaction([
      this.prisma.like.delete({
        where: {
          id: like.id,
        },
      }),

      this.prisma.comment.update({
        where: {
          id: commentId,
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
      message: 'Comment unliked.',
    };
  }

  async createReply(commentId: string, userId: string, dto: CreateReplyDto) {
    const comment = await this.prisma.comment.findUnique({
      where: {
        id: commentId,
      },
      select: {
        id: true,
      },
    });

    if (!comment) {
      throw new NotFoundException('Comment not found.');
    }

    const reply = await this.prisma.reply.create({
      data: {
        commentId,
        userId,
        content: dto.content,
      },
      select: {
        id: true,
        content: true,
        createdAt: true,
        likeCount: true,

        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },

        likes: {
          select: {
            id: true,
            userId: true,
          },
        },
      },
    });

    return {
      success: true,
      message: 'Reply created.',
      data: reply,
    };
  }
}
