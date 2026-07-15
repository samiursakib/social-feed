import { Prisma } from 'prisma/generated/prisma/client.js';

export const postSelect = {
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
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
        content: true,
        userId: true,
        likeCount: true,
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
        replies: {
          orderBy: {
            createdAt: 'asc',
          },
          select: {
            id: true,
            content: true,
            userId: true,
            likeCount: true,
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
          },
        },
      },
    },
  },
} satisfies Prisma.PostFindManyArgs;

export type PostDto = Prisma.PostGetPayload<typeof postSelect>;
