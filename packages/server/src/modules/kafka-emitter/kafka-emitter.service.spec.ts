import { Test, TestingModule } from '@nestjs/testing';
import { KafkaEmitterService } from './kafka-emitter.service';

describe('KafkaEmitterService', () => {
  let service: KafkaEmitterService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [KafkaEmitterService],
    }).compile();

    service = module.get<KafkaEmitterService>(KafkaEmitterService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
