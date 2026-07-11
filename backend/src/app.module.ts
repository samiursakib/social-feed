import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller.js';
import { AuthModule } from './auth/auth.module.js';
import { CommentModule } from './comment/comment.module.js';
import { FeedModule } from './feed/feed.module.js';
import { LikeModule } from './like/like.module.js';
import { PostModule } from './post/post.module.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { ReplyModule } from './reply/reply.module.js';
import { UploadModule } from './upload/upload.module.js';
import { UserModule } from './user/user.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
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
})
export class AppModule {}
