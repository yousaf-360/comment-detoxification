import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import axiosRetry from 'axios-retry';
import { HttpService } from '@nestjs/axios';
import { jwtConstants } from './constants';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService:UsersService,
        private readonly jwtService:JwtService,
    ){
        this.jwtService = new JwtService({secret:jwtConstants.secret || process.env.JWT_SECRET})
    }

    async validateUser(email:string, password:string):Promise<{email:string}>{
        const user = await this.userService.validateEmail(email);
        if(!user){
            throw new UnauthorizedException('Invalid email');
        }
        const isPasswordValid = await this.userService.validatePassword(password, user.password);
        if(!isPasswordValid){
            throw new UnauthorizedException('Invalid password');
        }

        return {email:user.email};
    }

    async login(email: string,password: string): Promise<{access_token:string}>{
        const userEmail = await this.validateUser(email, password);
        if(!userEmail){
            throw new UnauthorizedException('Invalid credentials');

        }
        return {
            access_token: await this.jwtService.signAsync(userEmail)
        };
    }

    async signup(email:string, password:string): Promise<{access_token:string}>{
        const userEmail = await this.userService.userExists(email);
        if(userEmail){
            throw new Error('email already exists');
        }
        await this.userService.createUser(email,password);
        return this.login(email,password);
    }


}
