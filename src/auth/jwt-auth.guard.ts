import { Injectable, ExecutionContext,UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    canActivate(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest();
        const authHeader = request.headers['authorization'];
      
        if (!authHeader || !authHeader.startsWith('Bearer')) {
          throw new UnauthorizedException('Invalid or missing Authorization header');
        }
      
        return super.canActivate(context); 
      }
      
}
