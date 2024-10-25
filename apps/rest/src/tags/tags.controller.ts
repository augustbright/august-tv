import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { TagsService } from './tags.service';
import { Guard } from '@august-tv/server/utils';
import { CreateTagDto } from '@august-tv/server/dto';

@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Get('/search')
  @Guard.scope('user')
  async searchTags(@Query('q') query: string) {
    return this.tagsService.searchTags(query);
  }

  @Post('/create')
  @Guard.scope('user')
  async createTag(@Body() body: CreateTagDto) {
    return this.tagsService.createTag(body);
  }
}
