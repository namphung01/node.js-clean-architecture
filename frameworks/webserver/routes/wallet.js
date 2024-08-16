import walletController from '../../../adapters/controllers/walletController';
import walletDbRepository from '../../../application/repositories/walletDbRepository';
import walletRepositoryMongoDB from '../../database/mongoDB/repositories/walletRepositoryMongoDB';
// import redisCachingMiddleware from '../middlewares/redisCachingMiddleware';
import authMiddleware from '../middlewares/authMiddleware';

export default function walletRouter(express) {
  const router = express.Router();

  // load controller with dependencies
  const controller = walletController(
    walletDbRepository,
    walletRepositoryMongoDB
  );

  // GET endpoints
  /**
   * @openapi
   * '/api/v1/wallet':
   *  get:
   *     tags:
   *     - Wallet
   *     summary: Get wallet
   *     security:
   *       - BearerAuth: []
   *     responses:
   *       200:
   *         description: Success
   */
  router.route('/').get([authMiddleware], controller.fetchAllWallets);
  /**
   * @openapi
   * '/api/v1/wallet/{id}':
   *  get:
   *     tags:
   *     - Wallet
   *     summary: Get wallet
   *     parameters:
   *      - name: id
   *        in: path
   *        description: The unique id of the wallet
   *        required: true
   *     security:
   *       - BearerAuth: []
   *     responses:
   *       200:
   *         description: Success
   */
  router.route('/:id').get([authMiddleware], controller.fetchWalletById);

  // POST endpoints
  /**
   * @openapi
   * '/api/v1/wallet':
   *  post:
   *     tags:
   *     - Wallet
   *     summary: Create a wallet
   *     requestBody:
   *      required: true
   *      content:
   *        application/json:
   *           schema:
   *            type: object
   *            required:
   *              - name
   *            properties:
   *              name:
   *                type: string
   *                default: wallet1
   *              userId:
   *                type: integer
   *                default: 1
   *     responses:
   *      200:
   *        description: Created
   */
  router.route('/').post(authMiddleware, controller.addNewWallet);

  // PUT endpoints
  /**
   * @openapi
   * '/api/v1/wallet/{id}':
   *  put:
   *     tags:
   *     - Wallet
   *     summary: Update a wallet
   *     parameters:
   *      - name: id
   *        in: path
   *        description: The unique id of the wallet
   *        required: true
   *     requestBody:
   *      required: true
   *      content:
   *        application/json:
   *           schema:
   *            type: object
   *            properties:
   *              name:
   *                type: string
   *                default: wallet1
   *              amount:
   *                type: string
   *                default: 100000
   *     responses:
   *      200:
   *        description: Created
   */
  router.route('/:id').put(authMiddleware, controller.updateWalletById);

  // DELETE endpoints
  /**
   * @openapi
   * '/api/v1/wallet/{id}':
   *  delete:
   *     tags:
   *     - Wallet
   *     summary: Remove wallet by id
   *     parameters:
   *      - name: id
   *        in: path
   *        description: The unique id of the wallet
   *        required: true
   *     responses:
   *      200:
   *        description: Success
   */
  router.route('/:id').delete(authMiddleware, controller.deleteWalletById);

  return router;
}
