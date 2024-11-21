import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { SupabaseService } from '../supabase/supabase.service';
import { CommentDetoxificationController } from './comment-detoxification.controller';
import { CommentDetoxificationService } from './comment-detoxification.service';

@Module({
  imports:[HttpModule],
  controllers: [CommentDetoxificationController],
  providers: [CommentDetoxificationService, SupabaseService]
})
export class CommentDetoxificationModule {}
