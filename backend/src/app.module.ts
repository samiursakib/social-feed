import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller.js';
import { PostsService } from './post.service.js';
import { UsersService } from './user.service.js';
import { PrismaService } from './prisma.service.js';
import { AuthModule } from './auth/auth.module.js';
import { UserModule } from './user/user.module.js';
import { PostModule } from './post/post.module.js';
import { CommentModule } from './comment/comment.module.js';
import { ReplyModule } from './reply/reply.module.js';
import { LikeModule } from './like/like.module.js';
import { UploadModule } from './upload/upload.module.js';
import { FeedModule } from './feed/feed.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    UserModule,
    PostModule,
    CommentModule,
    ReplyModule,
    LikeModule,
    UploadModule,
    FeedModule,
  ],
  controllers: [AppController],
  providers: [PrismaService, UsersService, PostsService],
})
export class AppModule {}
