import { Guard } from '@august-tv/server/utils';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { CategoryDto } from '@august-tv/server/dto';
import { CategoriesService } from '@august-tv/server/modules';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  @Guard.scope('public')
  async getCategories() {
    return this.categoriesService.getCategories();
  }

  @Post()
  @Guard.scope('admin')
  async createCategory(@Body() data: CategoryDto) {
    return this.categoriesService.createCategory(data);
  }

  @Patch(':id')
  @Guard.scope('admin')
  async updateCategory(
    @Body() data: CategoryDto,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.categoriesService.updateCategory(id, data);
  }

  @Delete(':id')
  @Guard.scope('admin')
  async deleteCategory(@Param('id', ParseIntPipe) id: number) {
    return this.categoriesService.deleteCategory(id);
  }
}
