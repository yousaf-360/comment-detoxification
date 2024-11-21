import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { SupabaseService } from '../supabase/supabase.service';
import axiosRetry from 'axios-retry';
import { makeOpenAIRequest, storeRecord } from './utils/utils';

@Injectable()
export class CommentDetoxificationService {
  constructor(
    private readonly httpService: HttpService,
    private readonly supabaseService: SupabaseService,
  ) {
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

  private async callOpenAI(systemMessage: string, userMessage: string): Promise<string> {
    const url = process.env.CHATGPT_API_URL;
    const key = process.env.CHATGPT_API_KEY;

    if (!url || !key) {
      throw new Error('CHATGPT_API_URL or CHATGPT_API_KEY is not defined in the environment variables');
    }

    return makeOpenAIRequest(this.httpService, url, key, systemMessage, userMessage);
  }

  async detoxifyComment(comment: string): Promise<string> {
    const systemMessage = 'You are a helpful assistant who detoxifies comments. If a comment is not toxic return the same sentence';
    const userMessage = `Detoxify this comment: "${comment}"`;
    const detoxifiedComment = await this.callOpenAI(systemMessage, userMessage);
    return detoxifiedComment.replace(/^"|"$/g, '');
  }

  async storeComment(originalComment: string, detoxifiedComment: string): Promise<void> {
    await storeRecord(this.supabaseService, 'comments', {
      original_comment: originalComment,
      detoxified_comment: detoxifiedComment,
    });
  }

  async rateToxification(comment: string): Promise<string> {
    const systemMessage = "You are a helpful assistant specialized in classifying the toxicity of comments. Your responses must always consist of a single word.";
    const userMessage = `Classify the toxicity of the following comment: "${comment}". Respond with one word only, such as "Non-Toxic", "Mild", "Moderate", or "Severe". Do not include any explanations or additional text.`;    
    return this.callOpenAI(systemMessage, userMessage);
  }

  async storeRating(comment: string, rating: string): Promise<void> {
    await storeRecord(this.supabaseService, 'rating', {
      comment,
      rating,
    });
  }
}
