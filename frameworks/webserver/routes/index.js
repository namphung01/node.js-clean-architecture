import postRouter from './post';
import categoryRouter from './category';
import userRouter from './user';
import authRouter from './auth';

export default function routes(app, express, redisClient) {
  app.use('/api/v1/posts', postRouter(express, redisClient));
  app.use('/api/v1/category', categoryRouter(express, redisClient));
  app.use('/api/v1/users', userRouter(express, redisClient));
  app.use('/api/v1/login', authRouter(express, redisClient));
}
