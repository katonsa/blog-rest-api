import type { Request, RequestHandler, Response } from 'express';
import { prisma } from '../db/prisma';
import type {
  CreatePostBody,
  GetAllPostsQuery,
  PostParams,
  UpdatePostBody,
} from '../schemas/post.schema';

export const getPosts: RequestHandler = async (req: Request, res: Response) => {
  const { query } = req.validated as {
    query: GetAllPostsQuery;
  };

  const page = Math.max(1, query.page || 1);
  const limit = Math.min(100, Math.max(1, query.limit || 10));
  const skip = (page - 1) * limit;

  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.post.count(),
  ]);

  res.json({
    data: posts,
    meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
  });
};

export const getPost: RequestHandler = async (req: Request, res: Response) => {
  const postId = (req.validated?.params as PostParams).id;

  const post = await prisma.post.findUnique({
    where: { id: postId },
  });

  if (!post) {
    return res
      .status(404)
      .json({ message: 'Post not found', code: 'ERR_NOT_FOUND' });
  }

  res.json(post);
};

export const createPost: RequestHandler = async (
  req: Request,
  res: Response
) => {
  const { body } = req.validated as {
    body: CreatePostBody;
  };

  const { title, content } = body;

  const post = await prisma.post.create({
    data: {
      title,
      content,
    },
  });

  res.status(201).json(post);
};

export const updatePost: RequestHandler = async (
  req: Request,
  res: Response
) => {
  const { params, body } = req.validated as {
    params: PostParams;
    body: UpdatePostBody;
  };

  const postId = params.id;
  const { title, content } = body;

  const post = await prisma.post.findUnique({
    where: { id: postId },
  });

  if (!post) {
    return res
      .status(404)
      .json({ message: 'Post not found', code: 'ERR_NOT_FOUND' });
  }

  if (!title && !content) {
    return res.status(422).json({
      message: 'At least one field is required',
      code: 'ERR_UNPROCESSABLE_ENTITY',
    });
  }

  const updatedPost = await prisma.post.update({
    where: { id: postId },
    data: {
      title,
      content,
    },
  });

  res.json(updatedPost);
};

export const deletePost: RequestHandler = async (
  req: Request,
  res: Response
) => {
  const { params } = req.validated as {
    params: PostParams;
  };

  const postId = params.id;

  await prisma.post.delete({
    where: { id: postId },
  });
  res.status(204).send();
};
