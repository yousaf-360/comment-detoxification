import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config'; // Import ConfigModule
import { SupabaseService } from './supabase/supabase.service';
import { SupabaseController } from './supabase/supabase.controller';
import { SupabaseModule } from './supabase/supabase.module';
import { CommentDetoxificationModule } from './comment-detoxification/comment-detoxification.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, 
      envFilePath: '.env',
    }),
    SupabaseModule,
    CommentDetoxificationModule,
  ],
  controllers: [ SupabaseController],
  providers: [ SupabaseService],
})
export class AppModule {}
