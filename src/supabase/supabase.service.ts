import { Injectable } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SupabaseService {
    private readonly supabase: SupabaseClient
    constructor(private readonly configService: ConfigService){
        this.supabase = createClient(
            this.configService.get<string>('SUPABASE_URL'),
            this.configService.get<string>('SUPABASE_KEY'),
    )
    }
    getClient():SupabaseClient{
        return this.supabase;
    }


}
