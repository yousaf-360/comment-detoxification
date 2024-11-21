import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { SupabaseService } from '../supabase/supabase.service';
import { firstValueFrom, catchError } from 'rxjs';
import { AxiosError } from 'axios';

@Injectable()
export class CommentDetoxificationService {
    constructor (
        private readonly httpService: HttpService
        ,private readonly supabaseService: SupabaseService
    ){}      
    
    async detoxifyComment(originalComment: string): Promise<string> {
        const url = process.env.CHATGPT_API_URL;
        const key = process.env.CHATGPT_API_KEY;
      
        try {
          const requestPayload = {
            model: 'gpt-4o-mini',
            messages: [
              { role: 'system', content: 'You are a helpful assistant who detoxifies comments.' },
              { role: 'user', content: `Detoxify this comment: "${originalComment}"` },
            ],
          };
      
      
          const { data } = await firstValueFrom(
            this.httpService
              .post(
                url,
                requestPayload,
                {
                  headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${key}`,
                  },
                },
              )
              .pipe(
                catchError((error: AxiosError) => {
                  console.error('Full Error Details:', error.toJSON ? error.toJSON() : error);
                  throw new Error(
                    `Failed to detoxify comment: ${error.response?.data|| error.message || 'Unknown error'}`,
                  );
                }),
              ),
          );
      
      
          if (!data.choices || !data.choices[0]?.message?.content) {
            console.error('Unexpected API Response:', data);
            throw new Error('Invalid API response format');
          }
          return data.choices[0]?.message?.content?.trim();
        } catch (error) {
          console.error('Unexpected error:', error.message);
          throw new Error(`Unexpected error: ${error.message}`);
        }
      }
      
    async storeComment(originalComment:string,detoxifiedComment:string): Promise<void>{
        const supabase = this.supabaseService.getClient()
        const {error} = await supabase.from('comments').insert(
            [
                {
                    original_comment: originalComment,
                    detoxified_comment: detoxifiedComment
                }
            ]
        );
        if (error){
            throw new Error(`Unexpected error: ${error.message}`);
        }
    }
    }