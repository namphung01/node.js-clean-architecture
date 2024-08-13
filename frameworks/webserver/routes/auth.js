import authController from '../../../adapters/controllers/authController';
import userDbRepository from '../../../application/repositories/userDbRepository';
import userDbRepositoryMongoDB from '../../database/mongoDB/repositories/userRepositoryMongoDB';
import authServiceInterface from '../../../application/services/authService';
import authServiceImpl from '../../services/authService';

export default function authRouter(express) {
  const router = express.Router();

  // load controller with dependencies
  const controller = authController(
    userDbRepository,
    userDbRepositoryMongoDB,
    authServiceInterface,
    authServiceImpl
  );

  // POST enpdpoints
  /**
   * @openapi
   * '/api/v1/login':
   *  post:
   *     tags:
   *     - Auth
   *     summary: Login
   *     requestBody:
   *      required: true
   *      content:
   *        application/json:
   *           schema:
   *            type: object
   *            required:
   *              - email
   *              - password
   *            properties:
   *              email:
   *                type: string
   *                default: nampx@email.com
   *              password:
   *                type: string
   *                default: nampx
   *     responses:
   *      200:
   *        description: Created
   */
  router.route('/').post(controller.loginUser);

  return router;
}
