import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { SupabaseModule } from '../supabase/supabase.module'; 
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [SupabaseModule, HttpModule], 
  providers: [UsersService], 
  controllers: [UsersController], 
  exports: [UsersService], 
})
export class UsersModule {}
