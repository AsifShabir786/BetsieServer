import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module'; // <-- Import UsersModule
import { User } from './users/user.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres', // your postgres username
      password: 'Betsie', // your postgres password
      database: 'postgres', // your database name
      entities: [User],
      synchronize: true,
    }),
    UsersModule, // <-- Register here
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
