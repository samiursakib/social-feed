import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import {
  Post as PostModel,
  User as UserModel,
} from '../prisma/generated/prisma/client.js';
import { PostsService } from './post.service.js';
import { UsersService } from './user.service.js';

@Controller()
export class AppController {
  constructor(
    private readonly userService: UsersService,
    private readonly postService: PostsService,
  ) {}

  @Get('post/:id')
  async getPostById(@Param('id') id: string): Promise<PostModel | null> {
    return this.postService.post({ id: id });
  }

  @Get('feed')
  async getPublishedPosts(): Promise<PostModel[]> {
    console.log('feed');
    return this.postService.posts({
      take: 1,
    });
  }

  @Get('filtered-posts/:searchString')
  async getFilteredPosts(
    @Param('searchString') searchString: string,
  ): Promise<PostModel[]> {
    return this.postService.posts({
      where: {
        content: { contains: searchString },
      },
    });
  }

  @Post('post')
  async createDraft(
    @Body() postData: { title: string; content: string; authorEmail: string },
  ): Promise<PostModel> {
    const { content, authorEmail } = postData;
    return this.postService.createPost({
      content,
      user: {
        connect: { email: authorEmail },
      },
    });
  }

  @Post('user')
  async signupUser(
    @Body()
    userData: {
      firstName: string;
      lastName: string;
      email: string;
      passwordHash: string;
    },
  ): Promise<UserModel> {
    return this.userService.createUser(userData);
  }

  @Delete('post/:id')
  async deletePost(@Param('id') id: string): Promise<PostModel> {
    return this.postService.deletePost({ id });
  }
}
