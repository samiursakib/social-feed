import { Module } from '@nestjs/common';
import { PostService } from './post.service.js';
import { PostController } from './post.controller.js';
import { CloudinaryService } from '../cloudinary/cloudinary.service.js';

@Module({
  controllers: [PostController],
  providers: [PostService, CloudinaryService],
})
export class PostModule {}
