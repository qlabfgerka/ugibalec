import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';
import { ExceptionMessages } from 'src/exceptions/exception.messages';

@Injectable()
export class JwtRefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refreshtoken',
) {
  constructor(
    private configService: ConfigService,
    private authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true,
      secretOrKey: configService.get('JWT_SECRET'),
      passReqToCallback: true,
    });
  }

  async validate(
    req: any,
    payload: { username: string; id: string },
  ): Promise<{ username: string; id: string }> {
    const user = await this.authService.getUserWithTokens(payload.id);

    if (!user) {
      console.log('0');
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: ExceptionMessages.USER_NOT_FOUND,
        },
        HttpStatus.FORBIDDEN,
      );
    }

    if (req.body.refreshToken != user.refreshToken) {
      console.log('1');
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: ExceptionMessages.REFRESH_TOKEN_EXCEPTION,
        },
        HttpStatus.FORBIDDEN,
      );
    }

    if (new Date() > new Date(user.refreshTokenExpiry)) {
      console.log('2');
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: ExceptionMessages.REFRESH_TOKEN_EXCEPTION,
        },
        HttpStatus.FORBIDDEN,
      );
    }

    return { username: payload.username, id: payload.id };
  }
}
