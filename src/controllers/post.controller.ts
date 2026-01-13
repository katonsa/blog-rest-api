import type { Request, Response } from 'express';
import { prisma } from '../db/prisma';
import type {
  CreatePostBody,
  PostParams,
  UpdatePostBody,
} from '../schemas/post.schema';

export const getPosts = async (req: Request, res: Response) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 10));
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

export const getPost = async (req: Request, res: Response) => {
  const postId = req.params.id as unknown as number;

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

export const createPost = async (
  req: Request<{}, {}, CreatePostBody>,
  res: Response
) => {
  const { title, content } = req.body;

  const post = await prisma.post.create({
    data: {
      title,
      content,
    },
  });

  res.status(201).json(post);
};

export const updatePost = async (
  req: Request<any, any, UpdatePostBody>,
  res: Response
) => {
  const postId = req.params.id as unknown as number;
  const { title, content } = req.body;

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

export const deletePost = async (req: Request, res: Response) => {
  const postId = req.params.id as unknown as number;
  await prisma.post.delete({
    where: { id: postId },
  });
  res.status(204).send();
};
