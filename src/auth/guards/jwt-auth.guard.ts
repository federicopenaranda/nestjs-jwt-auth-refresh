import { ExecutionContext } from '@nestjs/common';
import { UnauthorizedException } from '@nestjs/common/exceptions';
import { AuthGuard } from '@nestjs/passport';
import { JsonWebTokenError } from 'jsonwebtoken';


export class JwtAuthGuard extends AuthGuard('jwt') {

    // Extra: Override the property name the strategy adds
    // to the request when validating the access token.
    constructor() {
        super({
            property: 'jwtAuthUser'
        })
    }

    handleRequest<TUser = any>(err: any, user: any, info: any, context: ExecutionContext, status?: any): TUser {
        if ( info instanceof JsonWebTokenError ) {
            throw new UnauthorizedException('Invalid JWT!');
        }
        return super.handleRequest(err, user, info, context, status);
    }

}