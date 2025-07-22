import { Controller, Get, Post, Body } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('hello')
  createHello(@Body() body: any): string {
    // Example handler, adjust as needed
    return `Received: ${JSON.stringify(body)}`;
  }
}