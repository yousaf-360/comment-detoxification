import { Test, TestingModule } from '@nestjs/testing';
import { CommentDetoxificationService } from './comment-detoxification.service';

describe('CommentDetoxificationService', () => {
  let service: CommentDetoxificationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CommentDetoxificationService],
    }).compile();

    service = module.get<CommentDetoxificationService>(CommentDetoxificationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
