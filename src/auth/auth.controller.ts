import { Body, Controller, Delete, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dtos/login.dto';
import { RefreshDto } from './dtos/refresh.dto';

@Controller('auth')
export class AuthController {

    constructor(private readonly authService: AuthService) { }

    @Post('login')
    login(
        @Body() body: LoginDto
    ) {
        return this.authService.login(body.email, body.password);
    }

    @Post('refresh')
    refresh(
        @Body() body: RefreshDto
    ) {
        return this.authService.refresh(body.refreshToken);
    }

    @Delete('logout')
    delete(
        @Body() body: RefreshDto
    ) {
        return this.authService.logout(body.refreshToken);
    }

    @Get('showTokens')
    showTokens() {
        return this.authService.showRefreshTokens();
    }

}
