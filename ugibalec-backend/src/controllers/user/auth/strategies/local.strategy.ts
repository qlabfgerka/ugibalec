import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { ExceptionMessages } from 'src/exceptions/exception.messages';
import { User } from 'src/models/user/user.model';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(username: string, password: string): Promise<User> {
    const user = await this.authService.validateUser(username, password);

    if (!user) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: ExceptionMessages.INCORRECT_USERNAME_OR_PASSWORD,
        },
        HttpStatus.FORBIDDEN,
      );
    }
    return user;
  }
}
