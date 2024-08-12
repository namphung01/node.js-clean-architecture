import express from 'express';
import mongoose from 'mongoose';
import redis from 'redis';
import config from './config/config';
import expressConfig from './frameworks/webserver/express';
// eslint-disable-next-line import/no-cycle
import routes from './frameworks/webserver/routes';
import serverConfig from './frameworks/webserver/server';
import mongoDbConnection from './frameworks/database/mongoDB/connection';
import redisConnection from './frameworks/database/redis/connection';
import errorHandlingMiddleware from './frameworks/webserver/middlewares/errorHandlingMiddleware';

const app = express();

// i18n config
const path = require('path');
const { I18n } = require('i18n');

const i18n = new I18n({
  locales: ['en', 'vi'],
  directory: path.join(__dirname, 'locales'),
  defaultLocale: 'vi', // Ngôn ngữ mặc định
  header: 'accept-language' // Header mặc định để xác định ngôn ngữ
});

app.use(i18n.init);
// end i18n config

const server = require('http').createServer(app);

const { swaggerUi, swaggerDocs } = require('./frameworks/services/swagger'); // Đường dẫn đến file cấu hình Swagger

app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocs, {
    swaggerOptions: {
      persistAuthorization: true
    }
  })
);
// express.js configuration (middlewares etc.)
expressConfig(app);

// server configuration and start
serverConfig(app, mongoose, server, config).startServer();

// DB configuration and connection create
mongoDbConnection(mongoose, config, {
  autoIndex: false,
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  keepAlive: 120,
  connectTimeoutMS: 1000
}).connectToMongo();

const redisClient = redisConnection(redis, config).createRedisClient();

// routes for each endpoint
routes(app, express, redisClient);

// error handling middleware
app.use(errorHandlingMiddleware);

// Expose app
export default app;
