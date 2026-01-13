import type { Request, Response } from 'express';
import { prisma } from '../db/prisma';

export const getPosts = async (req: Request, res: Response) => {
  const posts = await prisma.post.findMany({
    take: 10,
    orderBy: { createdAt: 'desc' },
  });
  res.json({
    data: posts,
    meta: {},
  });
};

export const getPost = async (req: Request, res: Response) => {
  const postId = req.params.id;

  const post = await prisma.post.findUnique({
    where: { id: Number(postId) },
  });

  if (!post) {
    return res
      .status(404)
      .json({ message: 'Post not found', code: 'ERR_NOT_FOUND' });
  }

  res.json(post);
};

export const createPost = async (req: Request, res: Response) => {
  const { title, content } = req.body;

  // Store the new post in the database
  const post = await prisma.post.create({
    data: {
      title,
      content,
    },
  });

  res.status(201).json(post);
};

export const updatePost = async (req: Request, res: Response) => {
  const postId = req.params.id;
  const { title, content } = req.body;

  if (!title && !content) {
    return res.status(422).json({
      message: 'At least one field is required',
      code: 'ERR_UNPROCESSABLE_ENTITY',
    });
  }

  const post = await prisma.post.update({
    where: { id: Number(postId) },
    data: {
      title,
      content,
    },
  });

  res.json(post);
};

export const deletePost = async (req: Request, res: Response) => {
  const postId = req.params.id;
  await prisma.post.delete({
    where: { id: Number(postId) },
  });
  res.status(204).send();
};
