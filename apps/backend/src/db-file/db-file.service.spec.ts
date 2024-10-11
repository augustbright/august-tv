import { Test, TestingModule } from '@nestjs/testing';
import { DbFileService } from './db-file.service';

describe('DbFileService', () => {
  let service: DbFileService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DbFileService],
    }).compile();

    service = module.get<DbFileService>(DbFileService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
