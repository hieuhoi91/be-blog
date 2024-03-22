import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { UserEntity } from './modules/users/user.entity';
import { PostsModule } from './modules/posts/posts.module';
import { PostEntity } from './modules/posts/post.entity';
import { UploadModule } from './modules/upload/upload.module';
import { CategoriesModule } from './modules/categories/categories.module';

@Module({
  imports: [
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
        entities: ['src/module/**/*.ts'],
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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
