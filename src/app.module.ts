import { CacheModule, MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthTokenMiddleware } from './auth/authToken.middleware';
import { AuthModule } from './auth/auth.module';
import { SmokingAreaModule } from './pages/smoking-area/smoking-area.module';
import { UsersModule } from './pages/users/users.module';
import { AdminModule } from './pages/admin/admin.module';

@Module({
  imports: [
    CacheModule.register({
      isGlobal: true,
      ttl: 60 * 60 * 24,
      max: 1000,
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot({
      type: 'mariadb',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT) as number,
      username: process.env.DB_USER as string || 'abcd',
      password: process.env.DB_PASS,
      database: process.env.DB_DATABASE,
      timezone: 'Z',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    AdminModule,
    UsersModule,
    SmokingAreaModule,
    AuthModule,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthTokenMiddleware)
      .forRoutes({
        path: '*',
        method: RequestMethod.ALL,
      });
  }
}
