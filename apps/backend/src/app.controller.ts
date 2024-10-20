import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Guard } from '@august-tv/server/utils';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Guard.scope('public')
  getInfo(): string {
    return this.appService.getInfo();
  }
}
