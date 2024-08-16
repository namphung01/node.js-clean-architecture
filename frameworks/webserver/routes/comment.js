import commentController from "../../../adapters/controllers/commentController";
import authMiddleware from "../middlewares/authMiddleware";
import redisCachingMiddleware from "../middlewares/redisCachingMiddleware";


export default function commentRouter(express, redisClient) {
    const router = express.Router();

    // load controller with dependencies
    const controller = commentController();

    // GET endpoints
    router
        .route('/')
        .get(
            [authMiddleware, redisCachingMiddleware(redisClient, 'comment')],
            controller.getAllComment
        );

    router
        .route('/:id')
        .get(
            [authMiddleware, redisCachingMiddleware(redisClient, 'comment')],
            controller.getCommentById
        );

    // POST endpoints
    router
        .route('/')
        .post(
            [authMiddleware],
            controller.addNewComment
        );

    // PUT endpoints
    router
        .route('/:id')
        .put(
            [authMiddleware],
            controller.updateComment
        );

    // DELETE endpoints
    router
        .route('/:id')
        .delete(
            [authMiddleware],
            controller.deleteComment
        );
        
    return router;
}