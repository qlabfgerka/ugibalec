import {
  Body,
  Controller,
  Post,
  UseGuards,
  Request,
  Get,
} from '@nestjs/common';
import { TokenDTO } from 'src/models/token/token.model';
import { User } from 'src/models/user/user.model';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { JwtRefreshAuthGuard } from './guards/jwt-refresh-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  public async register(@Body('user') user: User): Promise<User> {
    return await this.authService.register(user);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  public async login(@Request() req: any): Promise<TokenDTO> {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtRefreshAuthGuard)
  @Post('refreshToken')
  public async refreshToken(@Request() req: any): Promise<TokenDTO> {
    return await this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('test')
  public async test(): Promise<string> {
    return 'test';
  }
}
