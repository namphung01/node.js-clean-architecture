import postController from '../../../adapters/controllers/postController';
import postDbRepository from '../../../application/repositories/postDbRepository';
import postDbRepositoryMongoDB from '../../database/mongoDB/repositories/postRepositoryMongoDB';
// import postRedisRepository from '../../../application/repositories/postRedisRepository';
// import postRedisRepositoryImpl from '../../database/redis/postRepositoryRedis';
import redisCachingMiddleware from '../middlewares/redisCachingMiddleware';
import authMiddleware from '../middlewares/authMiddleware';

export default function postRouter(express, redisClient) {
  const router = express.Router();

  // load controller with dependencies
  const controller = postController(
    postDbRepository,
    postDbRepositoryMongoDB
    // redisClient,
    // postRedisRepository,
    // postRedisRepositoryImpl
  );

  // GET endpoints
  /**
   * @openapi
   * '/api/v1/posts':
   *  get:
   *     tags:
   *     - Posts
   *     summary: Get posts
   *     security:
   *       - BearerAuth: []
   *     responses:
   *       200:
   *         description: Success
   */
  router
    .route('/')
    .get(
      [authMiddleware, redisCachingMiddleware(redisClient, 'posts')],
      controller.fetchAllPosts
    );
  /**
   * @openapi
   * '/api/v1/posts/{id}':
   *  get:
   *     tags:
   *     - Posts
   *     summary: Get post
   *     parameters:
   *      - name: id
   *        in: path
   *        description: The unique id of the post
   *        required: true
   *     security:
   *       - BearerAuth: []
   *     responses:
   *       200:
   *         description: Success
   */
  router
    .route('/:id')
    .get(
      [authMiddleware, redisCachingMiddleware(redisClient, 'post')],
      controller.fetchPostById
    );

  // POST endpoints
  /**
   * @openapi
   * '/api/v1/posts':
   *  post:
   *     tags:
   *     - Posts
   *     summary: Create a post
   *     requestBody:
   *      required: true
   *      content:
   *        application/json:
   *           schema:
   *            type: object
   *            required:
   *              - title
   *              - description
   *              - content
   *            properties:
   *              title:
   *                type: string
   *                default: post1
   *              description:
   *                type: string
   *                default: des1
   *              content:
   *                type: string
   *                default: content1
   *     responses:
   *      200:
   *        description: Created
   */
  router.route('/').post(authMiddleware, controller.addNewPost);

  // PUT endpoints
  /**
   * @openapi
   * '/api/v1/posts/{id}':
   *  put:
   *     tags:
   *     - Posts
   *     summary: Update a post
   *     parameters:
   *      - name: id
   *        in: path
   *        description: The unique id of the post
   *        required: true
   *     requestBody:
   *      required: true
   *      content:
   *        application/json:
   *           schema:
   *            type: object
   *            required:
   *              - title
   *              - description
   *              - content
   *            properties:
   *              title:
   *                type: string
   *                default: post1
   *              description:
   *                type: string
   *                default: des1
   *              content:
   *                type: string
   *                default: content1
   *     responses:
   *      200:
   *        description: Created
   */
  router.route('/:id').put(authMiddleware, controller.updatePostById);

  // DELETE endpoints
  /**
   * @openapi
   * '/api/v1/posts/{id}':
   *  delete:
   *     tags:
   *     - Posts
   *     summary: Remove post by id
   *     parameters:
   *      - name: id
   *        in: path
   *        description: The unique id of the post
   *        required: true
   *     responses:
   *      200:
   *        description: Success
   */
  router.route('/:id').delete(authMiddleware, controller.deletePostById);

  return router;
}
