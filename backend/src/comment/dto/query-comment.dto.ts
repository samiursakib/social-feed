import { Prisma } from 'prisma/generated/prisma/client.js';

export const commentSelect = {
  id: true,
  content: true,
  createdAt: true,
  likeCount: true,
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
  replies: {
    orderBy: {
      createdAt: 'asc' as const,
    },
    select: {
      id: true,
      content: true,
      createdAt: true,
      likeCount: true,
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
    },
  },
} satisfies Prisma.CommentSelect;
