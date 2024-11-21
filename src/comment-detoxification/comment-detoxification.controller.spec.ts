import { Test, TestingModule } from '@nestjs/testing';
import { CommentDetoxificationController } from './comment-detoxification.controller';

describe('CommentDetoxificationController', () => {
  let controller: CommentDetoxificationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommentDetoxificationController],
    }).compile();

    controller = module.get<CommentDetoxificationController>(CommentDetoxificationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
