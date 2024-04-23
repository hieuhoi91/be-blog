import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { PostsModule } from './modules/posts/posts.module';
import { UploadModule } from './modules/upload/upload.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { TagModule } from './modules/tag/tag.module';
import { CommentsModule } from './modules/comments/comments.module';
import { WebsocketsModule } from './modules/websockets/websockets.module';
import { RecommenderModule } from './modules/recommender/recommender.module';
import * as redisStore from 'cache-manager-redis-store';
import { CacheModule } from '@nestjs/cache-manager';
import { RedisClientOptions } from 'redis';

@Module({
  imports: [
    CacheModule.registerAsync<RedisClientOptions>({
      imports: [ConfigModule],
      isGlobal: true,
      useFactory: (config: ConfigService) => {
        return {
          store: redisStore,
          url: config.get('REDIS_URL'),
          password: config.get('REDIS_PASSWORD'),
        };
      },
      inject: [ConfigService],
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get('DB_HOST'),
        port: config.get('DB_PORT'),
        username: config.get('DB_USERNAME'),
        password: config.get('DB_PASSWORD'),
        database: config.get('DB_DATABASE'),
        entities: ['src/module/**/*.entity.ts'],
        // logging: true,
        autoLoadEntities: true,
        synchronize: true, // Chỉ dùng trong môi trường development
        ssl: Boolean(JSON.parse(config.get('SSL'))),
      }),
    }),

    AuthModule,
    UsersModule,
    PostsModule,
    UploadModule,
    CategoriesModule,
    TagModule,
    CommentsModule,
    WebsocketsModule,
    RecommenderModule,
  ],
})
export class AppModule {}
