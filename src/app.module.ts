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
import { CronModule } from './modules/cron/cron.module';
import { ModuleRef } from '@nestjs/core';
// import { RedisModule } from './modules/redis/redis.module';
import { PaymentModule } from './payment/payment.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // RedisModule.forRootAsync({
    //   imports: [ConfigModule],
    //   useFactory: (config: ConfigService) => {
    //     return {
    //       store: redisStore,
    //       url: config.get('REDIS_URL'),
    //       password: config.get('REDIS_PASSWORD'),
    //     };
    //   },
    //   inject: [ConfigService],
    // }),

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
        ssl: true,
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
    CronModule,
    // RedisModule,
    PaymentModule,
  ],
})
export class AppModule {
  constructor(private readonly moduleRef: ModuleRef) {}
}
