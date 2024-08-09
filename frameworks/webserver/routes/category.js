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
  router
    .route('/')
    .get(
      [authMiddleware, redisCachingMiddleware(redisClient, 'category')],
      controller.fetchAllCategories
    );
  router
    .route('/:id')
    .get(
      [authMiddleware, redisCachingMiddleware(redisClient, 'category')],
      controller.fetchCategoryById
    );

  // POST endpoints
  router.route('/').post(authMiddleware, controller.addNewCategory);

  // PUT endpoints
  router.route('/:id').put(authMiddleware, controller.updateCategoryById);

  // DELETE endpoints
  router.route('/:id').delete(authMiddleware, controller.deleteCategoryById);

  return router;
}
