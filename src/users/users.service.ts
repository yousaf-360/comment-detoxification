import { Injectable, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import * as bcrypt from 'bcrypt';
import { HttpService } from '@nestjs/axios';
import axiosRetry from 'axios-retry';

interface User {
  email: string;
  password: string;
}

@Injectable()
export class UsersService {
  private readonly supabase;

  constructor(
    private readonly supabaseService: SupabaseService,
    private readonly httpService: HttpService,
  ) {
    this.supabase = this.supabaseService.getClient();
    axiosRetry(this.httpService.axiosRef, {
        retries: 5,
        retryDelay: (retryCount) => {
          const delay = retryCount * 1000;
          console.log(`Retrying request... Attempt #${retryCount}, Delay: ${delay}ms`);
          return delay;
        },
        retryCondition: (error) => {
          console.log('Retry Condition:', error.response?.status || error.message);
          return axiosRetry.isNetworkOrIdempotentRequestError(error) || error.response?.status === 400;
        },
        onRetry: (error, retryCount) => {
          console.error(`Retry attempt #${retryCount} due to error: ${error}`);
        },
      }); 
  }
  async createUser(email: string, password: string): Promise<any> {
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const { data, error } = await this.supabase
        .from('users')
        .insert([{ email, password: hashedPassword }])
        .select()
        .single();

      if (error) {
        console.error(`Error creating user: ${error.message}`);
        throw new InternalServerErrorException('Unable to create user. Please try again.');
      }

      return data;
    } catch (error) {
      console.error('Unexpected error while creating user:', error.message);
      throw new InternalServerErrorException('Unexpected error occurred.');
    }
  }
  async validateEmail(email: string): Promise<User> {

    const { data, error } = await this.supabase
      .from('users')
      .select('*')
      .eq('email', email) 
      .single();

    if (error) {
      console.error(`Error fetching user by email: ${error.message}`);
      throw new Error(`User not found: ${error.message}`);
    }

    return data as User; 
  }

 
  async validatePassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  async userExists(email: string): Promise<boolean> {
    const { data, error } = await this.supabase
      .from('users')
      .select('email')
      .eq('email', email)
      .single();
  
    if (error && error.code !== 'PGRST116') { 
      console.error(`Error checking email existence: ${error.message}`);
      throw new Error('Unexpected error while checking user existence.');
    }
  
    return !!data; 
  }
  
}
