import { Provider } from '@nestjs/common';
import Redis from 'ioredis';

export type RedisClient = Redis;

export const redisProvider: Provider = {
  useFactory: (): RedisClient => {
    return new Redis({
      host: 'redis-11941.c252.ap-southeast-1-1.ec2.cloud.redislabs.com',
      port: 11941,
      password: 'wpy1EaMzVpeYkJf6swbhJ4MKs85EpbmG',
    });
  },
  provide: 'REDIS_CLIENT',
};
