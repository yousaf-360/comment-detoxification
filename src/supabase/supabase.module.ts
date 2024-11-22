import { Module } from '@nestjs/common';
// import { SupabaseController } from './supabase.controller';
import { SupabaseService } from './supabase.service';

@Module({
  controllers: [],
  providers: [SupabaseService],
  exports: [SupabaseService],

})
export class SupabaseModule {}
