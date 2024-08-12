import userController from '../../../adapters/controllers/userController';
import userDbRepository from '../../../application/repositories/userDbRepository';
import userDbRepositoryMongoDB from '../../database/mongoDB/repositories/userRepositoryMongoDB';
import authServiceInterface from '../../../application/services/authService';
import authServiceImpl from '../../services/authService';
import authMiddleware from '../middlewares/authMiddleware';

export default function userRouter(express) {
  const router = express.Router();

  // load controller with dependencies
  const controller = userController(
    userDbRepository,
    userDbRepositoryMongoDB,
    authServiceInterface,
    authServiceImpl
  );

  // GET enpdpoints
  /**
   * @openapi
   * '/api/v1/users/{id}':
   *  get:
   *     tags:
   *     - Users
   *     summary: Get user
   *     parameters:
   *      - name: id
   *        in: path
   *        description: The unique id of the user
   *        required: true
   *     security:
   *       - BearerAuth: []
   *     responses:
   *       200:
   *         description: Success
   */
  router.route('/:id').get(authMiddleware, controller.fetchUserById);
  /**
   * @openapi
   * '/api/v1/users':
   *  get:
   *     tags:
   *     - Users
   *     summary: Get users
   *     security:
   *       - BearerAuth: []
   *     responses:
   *       200:
   *         description: Success
   */
  router.route('/').get(authMiddleware, controller.fetchUsersByProperty);

  // POST enpdpoints
  /**
   * @openapi
   * '/api/v1/users':
   *  post:
   *     tags:
   *     - Users
   *     summary: Create a user
   *     requestBody:
   *      required: true
   *      content:
   *        application/json:
   *           schema:
   *            type: object
   *            required:
   *              - username
   *              - email
   *              - password
   *            properties:
   *              username:
   *                type: string
   *                default: nampx
   *              email:
   *                type: string
   *                default: nampx@gmail.com
   *              password:
   *                type: string
   *                default: nampx123
   *     responses:
   *      200:
   *        description: Created
   */
  router.route('/').post(controller.addNewUser);

  return router;
}
