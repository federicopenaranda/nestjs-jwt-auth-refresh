import { Injectable } from '@nestjs/common';
import { sign, verify } from 'jsonwebtoken';
import { UserService } from 'src/user/user.service';
import { RefreshJwt } from './entities/refresh-jwt.entity';

type LoginResponse = { accessToken: string, refreshToken: string };
type AccessPayload = { userId: number };
type RefreshPayload = { refreshTokenId: number, userId: number };

@Injectable()
export class AuthService {

    private refreshTokens: RefreshJwt[] = [];

    constructor(private readonly userService: UserService) {}

    login(email: string, password: string): LoginResponse {
        try {

            // 1) Validate user creds
            const user = this.userService.findUserByEmail(email);
            if ( user.password !== password ) throw new Error('Wrong password!');

            // 2) create access and refresh payloads to sign with JWT
            const accessPayload: AccessPayload = {
                userId: user.userId
            };
            const refreshPayload: RefreshPayload = {
                refreshTokenId: this.getNextRefreshTokenId(),
                userId: user.userId
            };

            // 3) Save created refresh token
            this.refreshTokens.push(refreshPayload);

            // 4) Sign and return tokens
            return {
                accessToken: sign(
                    accessPayload,
                    process.env.JWT_ACCESS_SECRET,
                    { expiresIn: '15m' }
                ),
                refreshToken: sign(
                    refreshPayload,
                    process.env.JWT_REFRESH_SECRET,
                    { expiresIn: '1h' }
                )
            }

        } catch(e) {
            throw e.message;
        }
    }


    refresh(refreshToken: string): Omit<LoginResponse, 'refreshToken'> {
        try {

            const decodedRefresh = verify(refreshToken, process.env.JWT_REFRESH_SECRET);
            if ( typeof decodedRefresh === 'string' ) throw new Error('Invalid Refresh Token.');

            this.userService.findUserById(decodedRefresh.userId);

            const accessPayload: AccessPayload = {
                userId: decodedRefresh.userId
            }

            return {
                accessToken: sign(
                    accessPayload,
                    process.env.JWT_ACCESS_SECRET,
                    { expiresIn: '15m' }
                )
            }

        } catch(e) {
            throw e;
        }
    }


    logout(refreshToken: string): string {
        try {

            const decodedRefresh = verify(refreshToken, process.env.JWT_REFRESH_SECRET);
            if ( typeof decodedRefresh === 'string' ) throw new Error('Invalid Refresh JWT');

            this.userService.findUserById(decodedRefresh.userId);

            this.refreshTokens = this.refreshTokens.filter( (token: RefreshJwt) => token.userId !== decodedRefresh.userId );
            return 'Logout successfull.'

        } catch(e) {
            throw e;
        }
    }


    showTokens() {
        return this.refreshTokens
    }


    getNextRefreshTokenId(): number {
        if ( this.refreshTokens.length === 0 ) return 1;
        return Math.max.apply( null, this.refreshTokens.map( (token: RefreshPayload) => token.refreshTokenId ) );
    }

}
