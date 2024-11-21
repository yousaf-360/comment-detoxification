import { HttpService } from '@nestjs/axios';
import { firstValueFrom, catchError } from 'rxjs';
import { AxiosError } from 'axios';
import { SupabaseService } from '../../supabase/supabase.service';
export async function makeOpenAIRequest(
    httpService: HttpService,
    url: string,
    apiKey: string,
    systemMessage: string,
    userMessage: string,
  ): Promise<string> {
    const requestPayload = {
      model: "gpt-4o-mini",
      messages: [
        { role: 'system', content: systemMessage },
        { role: 'user', content: userMessage },
      ],
    };
  
    try {
      const { data } = await firstValueFrom(
        httpService.post(url, requestPayload, {
          headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
        }).pipe(
          catchError((error: AxiosError) => {
            console.error('API Request Error:', error.toJSON ? error.toJSON() : error);
            throw new Error(
              `Failed to process API request: ${error.response?.data || error.message || 'Unknown error'}`,
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

  export async function storeRecord(
    supabaseService: SupabaseService,
    tableName: string,
    record: Record<string, any>, 
  ): Promise<void> {
    const supabase = supabaseService.getClient();
  
    const { error } = await supabase.from(tableName).insert([record]);
  
    if (error) {
      throw new Error(`Unexpected error inserting into ${tableName}: ${error.message}`);
    }
  }
  