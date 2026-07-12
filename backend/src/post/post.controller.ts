import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreatePostDto } from './dto/create-post.dto.js';
import { FindPostsDto } from './dto/find-posts.dto.js';
import { PostService } from './post.service.js';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  create(
    @UploadedFile() image: Express.Multer.File,
    @Body() dto: CreatePostDto,
  ) {
    return this.postService.create(dto, image);
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
}
