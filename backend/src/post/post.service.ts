import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { UploadApiResponse } from 'cloudinary';
import {
  Post,
  Prisma,
  TargetType,
} from '../../prisma/generated/prisma/client.js';
import { CreateCommentDto } from '../../src/comment/dto/create-comment.dto.js';
import { AuthenticatedRequest } from '../auth/types/authenticated-req.js';
import { CloudinaryService } from '../cloudinary/cloudinary.service.js';
import { commentSelect } from '../comment/dto/query-comment.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreatePostDto } from './dto/create-post.dto.js';
import { PostDto, postSelect } from './dto/query-post.dto.js';

@Injectable()
export class PostService {
  constructor(
    private prisma: PrismaService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async create(
    req: AuthenticatedRequest,
    createPostDto: CreatePostDto,
    image?: Express.Multer.File,
  ) {
    let uploadedImage: UploadApiResponse | null = null;
    try {
      const user = req.user;
      if (image) {
        uploadedImage = await this.cloudinaryService.uploadFile(image);
        if (!uploadedImage.public_id) {
          return {
            success: false,
            message: 'Could not upload image',
          };
        }
      }
      const createdPost = await this.prisma.post.create({
        data: {
          userId: user.id,
          content: createPostDto.text,
          imageUrl: uploadedImage?.secure_url,
          imagePublicId: uploadedImage?.public_id,
        },
      });
      const post = await this.prisma.post.findUnique({
        where: { id: createdPost.id },
        ...postSelect,
      });
      return { success: true, message: 'Post uploaded', data: post };
    } catch (error) {
      console.error(error);
      if (uploadedImage?.public_id) {
        try {
          await this.cloudinaryService.removeFile(uploadedImage.public_id);
        } catch (cleanupError) {
          console.error(cleanupError);
        }
      }
      throw new InternalServerErrorException('Failed to upload post');
    }
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.PostWhereUniqueInput;
    where?: Prisma.PostWhereInput;
    orderBy?: Prisma.PostOrderByWithRelationInput;
  }): Promise<{ success: boolean; data: PostDto[] }> {
    const { skip, take, cursor, where, orderBy } = params;
    const posts = await this.prisma.post.findMany({
      ...postSelect,
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
    return {
      success: true,
      data: posts,
    };
  }

  findOne(
    postWhereUniqueInput: Prisma.PostWhereUniqueInput,
  ): Promise<Post | null> {
    return this.prisma.post.findUnique({
      where: postWhereUniqueInput,
    });
  }

  // update(id: string, updatePostDto: UpdatePostDto) {
  //   return `This action updates a #${id} post`;
  // }

  remove(where: Prisma.PostWhereUniqueInput): Promise<Post> {
    return this.prisma.post.delete({
      where,
    });
  }

  async likePost(postId: string, userId: string) {
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
      select: { id: true },
    });

    if (!post) {
      throw new NotFoundException('Post not found.');
    }

    const alreadyLiked = await this.prisma.like.findUnique({
      where: {
        userId_targetType_targetId: {
          userId,
          targetType: TargetType.POST,
          targetId: postId,
        },
      },
    });

    if (alreadyLiked) {
      throw new BadRequestException('Post already liked.');
    }

    const [like] = await this.prisma.$transaction([
      this.prisma.like.create({
        data: {
          userId,
          targetType: TargetType.POST,
          targetId: postId,
          postId,
        },
        select: {
          id: true,
          userId: true,
        },
      }),

      this.prisma.post.update({
        where: {
          id: postId,
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

  async unlikePost(postId: string, userId: string) {
    const like = await this.prisma.like.findUnique({
      where: {
        userId_targetType_targetId: {
          userId,
          targetType: TargetType.POST,
          targetId: postId,
        },
      },
    });

    if (!like) {
      throw new BadRequestException('Post is not liked.');
    }

    await this.prisma.$transaction([
      this.prisma.like.delete({
        where: {
          id: like.id,
        },
      }),

      this.prisma.post.update({
        where: {
          id: postId,
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
      message: 'Post unliked.',
    };
  }

  async createComment(postId: string, userId: string, dto: CreateCommentDto) {
    const post = await this.prisma.post.findUnique({
      where: {
        id: postId,
      },
      select: {
        id: true,
      },
    });

    if (!post) {
      throw new NotFoundException('Post not found.');
    }

    const [comment] = await this.prisma.$transaction([
      this.prisma.comment.create({
        data: {
          postId,
          userId,
          content: dto.content,
        },
        select: commentSelect,
      }),

      this.prisma.post.update({
        where: {
          id: postId,
        },
        data: {
          commentCount: {
            increment: 1,
          },
        },
      }),
    ]);

    return {
      success: true,
      message: 'Comment created.',
      data: comment,
    };
  }
}
