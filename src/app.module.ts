import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SupabaseService } from './supabase/supabase.service';
// import { SupabaseController } from './supabase/supabase.controller';
import { SupabaseModule } from './supabase/supabase.module';
import { CommentDetoxificationModule } from './comment-detoxification/comment-detoxification.module';
import { AxiosRetryModule } from 'nestjs-axios-retry';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import axiosRetry from 'axios-retry';
import { UsersService } from './users/users.service';
import { AuthService } from './auth/auth.service';
import { CommentDetoxificationService } from './comment-detoxification/comment-detoxification.service';
import { AuthController } from './auth/auth.controller';
import { CommentDetoxificationController } from './comment-detoxification/comment-detoxification.controller';
import { HttpModule } from '@nestjs/axios';
import { JwtModule } from '@nestjs/jwt';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, 
      envFilePath: '.env',
    }),
    HttpModule,
    JwtModule,
    SupabaseModule,
    CommentDetoxificationModule,
    AuthModule,
    UsersModule,
  ],
  controllers: [AuthController, CommentDetoxificationController],
  providers: [ SupabaseService, UsersService, AuthService, CommentDetoxificationService],
})
export class AppModule {}
