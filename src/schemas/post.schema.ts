import { z } from 'zod';

// Schema for post params
export const postParamsSchema = z.object({
  id: z.coerce.number().int().positive(),
});

// Schema for creating a post
export const createPostSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(50, 'Title exceeded maximum length.')
    .regex(/^[a-zA-Z ]*$/, 'Title cannot contain integer.')
    .transform((val) => val.trim()),
  content: z.string().min(1, 'Content is required'),
});

// Schema for updating a post
export const updatePostSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  content: z.string().min(1).optional(),
});

export const getAllPostsQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().optional(),
});

// Inferred types for use in controllers
export type PostParams = z.infer<typeof postParamsSchema>;
export type CreatePostBody = z.infer<typeof createPostSchema>;
export type UpdatePostBody = z.infer<typeof updatePostSchema>;
export type GetAllPostsQuery = z.infer<typeof getAllPostsQuerySchema>;
