import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { User } from './users/user.entity';
import { FriendshipModule } from './friendship/friendship.module';
import { Friendship } from './friendship/friendship.entity';

@Module({
  imports: [
    // ConfigModule.forRoot({ isGlobal: true }), // Loads .env variables globally
ConfigModule.forRoot({
  isGlobal: true,
  envFilePath: process.env.NODE_ENV === 'docker' ? '.env.docker' : '.env.local',
}),


    TypeOrmModule.forRootAsync({ // Use forRootAsync to inject ConfigService
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'), // Read from environment variable
        port: configService.get<number>('DB_PORT'), // Read from environment variable
        username: configService.get<string>('DB_USER'), // Read from environment variable
        password: configService.get<string>('DB_PASSWORD'), // Read from environment variable
        database: configService.get<string>('DB_DATABASE'), // Read from environment variable
        entities: [User,Friendship],
        synchronize: true, // Set to false in production!
      }),
      inject: [ConfigService],
    }),

    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => ({
        secret: config.get<string>('ACCESS_TOKEN_SECRET'), // from .env
        signOptions: { expiresIn: '7d' },
      }),
      inject: [ConfigService],
    }),

    UsersModule,

    FriendshipModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}