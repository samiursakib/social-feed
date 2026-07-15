import {
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
import { ReplyService } from './reply.service.js';

@Controller('reply')
export class ReplyController {
  constructor(private readonly replyService: ReplyService) {}

  // @Post()
  // create(@Body() createReplyDto: CreateReplyDto) {
  //   return this.replyService.create(createReplyDto);
  // }

  @Get()
  findAll() {
    return this.replyService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.replyService.findOne(+id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateReplyDto: UpdateReplyDto) {
  //   return this.replyService.update(+id, updateReplyDto);
  // }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.replyService.remove(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/like')
  likeReply(
    @Param('id', ParseUUIDPipe) replyId: string,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.replyService.likeReply(replyId, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id/like')
  unlikeReply(
    @Param('id', ParseUUIDPipe) replyId: string,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.replyService.unlikeReply(replyId, req.user.id);
  }
}
