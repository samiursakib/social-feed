import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import type { AuthenticatedRequest } from '../auth/types/authenticated-req.js';
import { CreateReplyDto } from '../reply/dto/create-reply.dto.js';
import { CommentService } from './comment.service.js';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  // @Post()
  // create(@Body() createCommentDto: CreateCommentDto) {
  //   return this.commentService.create(createCommentDto);
  // }

  @Get()
  findAll() {
    return this.commentService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.commentService.findOne(+id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateCommentDto: UpdateCommentDto) {
  //   return this.commentService.update(+id, updateCommentDto);
  // }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.commentService.remove(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/like')
  likeComment(
    @Param('id', ParseUUIDPipe) commentId: string,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.commentService.likeComment(commentId, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id/like')
  unlikeComment(
    @Param('id', ParseUUIDPipe) commentId: string,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.commentService.unlikeComment(commentId, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/reply')
  createReply(
    @Param('id', ParseUUIDPipe) commentId: string,
    @Req() req: AuthenticatedRequest,
    @Body() dto: CreateReplyDto,
  ) {
    return this.commentService.createReply(commentId, req.user.id, dto);
  }
}
