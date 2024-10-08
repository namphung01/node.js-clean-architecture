export default {
  port: process.env.PORT || 1234,
  ip: process.env.HOST || '0.0.0.0',
  mongo: {
    uri:
      process.env.MONGO_URL ||
      'mongodb://root:123123@172.16.10.53:27017/nodejs-clean-architecture?authSource=admin'
  },
  redis: {
    uri: process.env.REDIS_URL || 'redis://localhost:6379'
  },
  jwtSecret: process.env.JWT_SECRET || 'jkl!±@£!@ghj1237'
};
