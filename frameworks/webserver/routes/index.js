import postRouter from './post';
import categoryRouter from './category';
// eslint-disable-next-line import/no-cycle
import userRouter from './user';
import authRouter from './auth';
import commentRouter from './comment';

export default function routes(app, express, redisClient) {
  app.use('/api/v1/posts', postRouter(express, redisClient));
  app.use('/api/v1/category', categoryRouter(express, redisClient));
  app.use('/api/v1/users', userRouter(express, redisClient));
  app.use('/api/v1/login', authRouter(express, redisClient));
  app.use('/api/v1/comments', commentRouter(express, redisClient));
}
