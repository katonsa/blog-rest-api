import { Router } from 'express';
import {
  createPost,
  deletePost,
  getPost,
  getPosts,
  updatePost,
} from '../controllers/post.controller';
import { validate } from '../middlewares/validate.middleware';
import {
  createPostSchema,
  getAllPostsQuerySchema,
  postParamsSchema,
  updatePostSchema,
} from '../schemas/post.schema';

const router = Router();

router.get('/', validate(getAllPostsQuerySchema, 'query'), getPosts);
router.post('/', validate(createPostSchema), createPost);
router.get('/:id', validate(postParamsSchema, 'params'), getPost);
router.put(
  '/:id',
  validate(postParamsSchema, 'params'),
  validate(updatePostSchema),
  updatePost
);
router.delete('/:id', validate(postParamsSchema, 'params'), deletePost);

export default router;
