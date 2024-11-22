import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiUnauthorizedResponse } from '@nestjs/swagger';
import {AuthDto} from './dto/auth.dto'
import { AuthService } from './auth.service';
@Controller('auth')
export class AuthController {

    constructor(private readonly authService: AuthService){}
    @Post('signup')
    @ApiOperation({summary:'Sign up'})
    async signup(@Body() body:AuthDto){
        const {email,password} = body;
        return this.authService.signup(email,password);
    }
    @Post('login')
    @ApiOperation({summary:'Log in'})
    async login(@Body() body:AuthDto){
        const {email,password} = body;
        return this.authService.login(email,password);
    }
}
