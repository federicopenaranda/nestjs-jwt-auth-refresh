import { Body, Controller, Delete, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dtos/login.dto';
import { RefreshDto } from './dtos/refresh-jwt.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    // Validate user and return Access web token
    @Post('login')
    login(
        @Body() body: LoginDto
    ) {
        return this.authService.login(body.email, body.password);
    }

    // Validate refresh token and return new access token
    @Post('refresh')
    refresh(
        @Body() body: RefreshDto
    ) {
        return this.authService.refresh(body.refreshToken);
    }

    // Validate refresh token and user, then delete refresh token
    @Delete('logout')
    logout(
        @Body() body: RefreshDto
    ) {
        return this.authService.logout(body.refreshToken);
    }

    // Just for testing. Show saved refresh tokens.
    @Get('showTokens')
    showTokens() {
        return this.authService.showTokens();
    }

}
