import { Injectable } from '@nestjs/common';
import { sign, verify } from 'jsonwebtoken';
import { UserService } from 'src/user/user.service';

type JwtResponse = { accessToken: string, refreshToken: string };
type RefreshToken = { refreshTokenId: number, userId: number };
type AccessPayload = { userId: number };
type RefreshPayload = { refreshTokenId: number, userId: number };

@Injectable()
export class AuthService {

    private refreshTokens: RefreshToken[] = [];

    constructor(private readonly userService: UserService) {}

    // Validate email and password, and return access and refresh tokens.
    login(email: string, password: string): JwtResponse {
        try {

            const user = this.userService.findUserByEmail(email);
            if ( user.password !== password ) throw new Error('Wrong password!');

            const accessPayload: AccessPayload = {
                userId: user.userId
            };
            const refreshPayload: RefreshPayload = {
                refreshTokenId: this.getNextRefreshTokenId(),
                userId: user.userId
            };

            this.refreshTokens.push(refreshPayload);

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
            };

        } catch(e) {
            throw e;
        }
    }

    // Validates refresh token and returns a new access token
    refresh(refreshToken: string): Omit<JwtResponse, 'refreshToken'> {
        try {
            const validRefreshToken = this.validateRefreshToken(refreshToken);
            this.userService.findUserById(validRefreshToken.userId);

            const accessPayload: AccessPayload = {
                userId: validRefreshToken.userId
            };

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


    // Validates refresh token and removes it from array
    logout(refreshToken: string): string {
        try {
            const validRefreshToken = this.validateRefreshToken(refreshToken);
            this.userService.findUserById(validRefreshToken.userId);
            this.refreshTokens = this.refreshTokens.filter(
                (token) => token.refreshTokenId !== validRefreshToken.refreshTokenId
            );
            return 'Logout successfull!';
        } catch(e) {
            throw e;
        }
    }


    validateRefreshToken(refreshToken: string): RefreshToken {
        try {
            const decodedToken = verify(refreshToken, process.env.JWT_REFRESH_SECRET);
            if ( typeof decodedToken === 'string' ) throw new Error('Invalid Refresh Token.');
            const foundRefreshToken = this.refreshTokens.find( (token) => token.refreshTokenId === decodedToken.refreshTokenId );
            if ( !foundRefreshToken ) throw new Error('Refresh Token not found');
            return foundRefreshToken;
        } catch(e) {
            throw e;
        }
    }


    getNextRefreshTokenId() {
        if ( this.refreshTokens.length === 0 ) return 1;
        return Math.max.apply( null, this.refreshTokens.map( (token) => token.refreshTokenId ) ) + 1;
    }


    showRefreshTokens() {
        return this.refreshTokens;
    }

}
