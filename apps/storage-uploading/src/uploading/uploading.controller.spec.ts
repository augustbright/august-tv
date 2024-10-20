import { Test, TestingModule } from '@nestjs/testing';
import { UploadingController } from './uploading.controller';

describe('UploadingController', () => {
  let controller: UploadingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UploadingController],
    }).compile();

    controller = module.get<UploadingController>(UploadingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
