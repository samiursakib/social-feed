import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import type { AuthenticatedRequest } from '../auth/types/authenticated-req.js';
import { CreateCommentDto } from '../comment/dto/create-comment.dto.js';
import { CreatePostDto } from './dto/create-post.dto.js';
import { FindPostsDto } from './dto/find-posts.dto.js';
import { PostService } from './post.service.js';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(FileInterceptor('image'))
  create(
    @Req() req: AuthenticatedRequest,
    @Body() dto: CreatePostDto,
    @UploadedFile() image: Express.Multer.File,
  ) {
    return this.postService.create(req, dto, image);
  }

  @Get()
  findAll(@Query() query: FindPostsDto) {
    const { skip, take, orderBy = 'desc' } = query;
    return this.postService.findAll({
      skip,
      take,
      orderBy: { createdAt: orderBy },
    });
  }

  @Get(':id')
  findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.postService.findOne({ id });
  }

  // @Patch(':id')
  // update(
  //   @Param('id', new ParseUUIDPipe()) id: string,
  //   @Body() updatePostDto: UpdatePostDto,
  // ) {
  //   return this.postService.update(id, updatePostDto);
  // }

  @Delete(':id')
  remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.postService.remove({ id });
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/like')
  likePost(
    @Param('id', ParseUUIDPipe) postId: string,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.postService.likePost(postId, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id/like')
  unlikePost(
    @Param('id', ParseUUIDPipe) postId: string,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.postService.unlikePost(postId, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/comment')
  createComment(
    @Param('id', ParseUUIDPipe) postId: string,
    @Req() req: AuthenticatedRequest,
    @Body() dto: CreateCommentDto,
  ) {
    return this.postService.createComment(postId, req.user.id, dto);
  }
}
