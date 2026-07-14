import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { UploadApiResponse } from 'cloudinary';
import { Post, Prisma } from 'prisma/generated/prisma/client.js';
import { CloudinaryService } from '../cloudinary/cloudinary.service.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreatePostDto } from './dto/create-post.dto.js';

@Injectable()
export class PostService {
  constructor(
    private prisma: PrismaService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async create(createPostDto: CreatePostDto, image?: Express.Multer.File) {
    let uploadedImage: UploadApiResponse | null = null;
    try {
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
          userId: '4f9a3c72-9b16-4d1e-8f2c-5a6b7c8d9e0f',
          content: createPostDto.text,
          imageUrl: uploadedImage?.secure_url,
          imagePublicId: uploadedImage?.public_id,
        },
      });
      const post = await this.prisma.post.findUnique({
        where: { id: createdPost.id },
        select: {
          id: true,
          content: true,
          imageUrl: true,
          visibility: true,
          likeCount: true,
          commentCount: true,
          createdAt: true,
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
          comments: {
            select: {
              id: true,
              content: true,
              userId: true,
              createdAt: true,
            },
          },
        },
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

  findAll(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.PostWhereUniqueInput;
    where?: Prisma.PostWhereInput;
    orderBy?: Prisma.PostOrderByWithRelationInput;
  }) {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.post.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
      select: {
        id: true,
        content: true,
        imageUrl: true,
        visibility: true,
        likeCount: true,
        commentCount: true,
        createdAt: true,
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
        comments: {
          select: {
            id: true,
            content: true,
            userId: true,
            createdAt: true,
          },
        },
      },
    });
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
}
