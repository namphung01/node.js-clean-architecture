import categoryController from '../../../adapters/controllers/categoryController';
import categoryDbRepository from '../../../application/repositories/categoryDbRepository';
import categoryDbRepositoryMongoDB from '../../database/mongoDB/repositories/categoryRepositoryMongoDB';
import categoryRedisRepository from '../../../application/repositories/categoryRedisRepository';
import categoryRedisRepositoryImpl from '../../database/redis/categoryRepositoryRedis';
import redisCachingMiddleware from '../middlewares/redisCachingMiddleware';
import authMiddleware from '../middlewares/authMiddleware';

export default function categoryRouter(express, redisClient) {
  const router = express.Router();

  // load controller with dependencies
  const controller = categoryController(
    categoryDbRepository,
    categoryDbRepositoryMongoDB,
    redisClient,
    categoryRedisRepository,
    categoryRedisRepositoryImpl
  );

  // GET endpoints
  /**
   * @openapi
   * '/api/v1/category':
   *  get:
   *     tags:
   *     - Category
   *     summary: Get category
   *     security:
   *       - BearerAuth: []
   *     responses:
   *       200:
   *         description: Success
   */
  router
    .route('/')
    .get(
      [authMiddleware, redisCachingMiddleware(redisClient, 'category')],
      controller.fetchAllCategories
    );
  /**
   * @openapi
   * '/api/v1/category/{id}':
   *  get:
   *     tags:
   *     - Category
   *     summary: Get category
   *     parameters:
   *      - name: id
   *        in: path
   *        description: The unique id of the category
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
      [authMiddleware, redisCachingMiddleware(redisClient, 'category')],
      controller.fetchCategoryById
    );

  // POST endpoints
  /**
   * @openapi
   * '/api/v1/category':
   *  post:
   *     tags:
   *     - Category
   *     summary: Create a category
   *     requestBody:
   *      required: true
   *      content:
   *        application/json:
   *           schema:
   *            type: object
   *            required:
   *              - title
   *            properties:
   *              title:
   *                type: string
   *                default: category1
   *     responses:
   *      200:
   *        description: Created
   */
  router.route('/').post(authMiddleware, controller.addNewCategory);

  // PUT endpoints
  /**
   * @openapi
   * '/api/v1/category/{id}':
   *  put:
   *     tags:
   *     - Category
   *     summary: Update a category
   *     parameters:
   *      - name: id
   *        in: path
   *        description: The unique id of the category
   *        required: true
   *     requestBody:
   *      required: true
   *      content:
   *        application/json:
   *           schema:
   *            type: object
   *            required:
   *              - title
   *            properties:
   *              title:
   *                type: string
   *                default: category1
   *     responses:
   *      200:
   *        description: Created
   */
  router.route('/:id').put(authMiddleware, controller.updateCategoryById);

  // DELETE endpoints
  /**
   * @openapi
   * '/api/v1/category/{id}':
   *  delete:
   *     tags:
   *     - Category
   *     summary: Remove category by id
   *     parameters:
   *      - name: id
   *        in: path
   *        description: The unique id of the category
   *        required: true
   *     responses:
   *      200:
   *        description: Success
   */
  router.route('/:id').delete(authMiddleware, controller.deleteCategoryById);

  return router;
}
