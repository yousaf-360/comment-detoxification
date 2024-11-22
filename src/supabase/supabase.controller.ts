import { Controller, Get } from '@nestjs/common';
import { SupabaseService } from './supabase.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';


// @Controller('supabase')
// @ApiTags('Supabase')
// export class SupabaseController {
//   constructor(private readonly supabaseService: SupabaseService) {}

//   @Get()
//   @ApiOperation({ summary: 'Check Supabase connection status' })
//   async checkConnection(): Promise<{ success: boolean; message: string }> {
//     try {
//       const supabase = this.supabaseService.getClient();

//       const { data, error } = await supabase.auth.getSession();

//       if (error) {
//         return { success: false, message: `Connection failed: ${error.message}` };
//       }

//       return { success: true, message: 'Supabase connection is successful!' };
//     } catch (err) {
//       return { success: false, message: `Unexpected error: ${err.message}` };
//     }
//   }
// }
