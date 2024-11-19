// import { Inject, Injectable } from '@nestjs/common';
// import { RedisClient } from './redis.provider';

// @Injectable()
// export class RedisService {
//   public constructor(
//     @Inject('REDIS_CLIENT')
//     private readonly client: RedisClient,
//   ) {}

//   async set(key: string, value: string, expirationSeconds: number) {
//     await this.client.set(key, value, 'EX', expirationSeconds);
//   }

//   async get(key: string): Promise<string | null> {
//     return await this.client.get(key);
//   }

//   async pushToList(listKey: string, value: string) {
//     await this.client.rpush(listKey, value);
//   }

//   async getList(key: string) {
//     return await this.client.lrange(key, 0, -1);
//   }
// }
