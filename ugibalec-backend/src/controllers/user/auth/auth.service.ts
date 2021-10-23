import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { nanoid } from 'nanoid';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { ExceptionMessages } from 'src/exceptions/exception.messages';
import { TokenDTO } from 'src/models/token/token.model';
import { User, UserDocument } from 'src/models/user/user.model';
import { DtoFunctionsService } from 'src/services/dto-functions/dto-functions.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly dtoFunctions: DtoFunctionsService,
    private readonly jwtService: JwtService,
  ) {}

  public async register(user: User): Promise<User> {
    const emailFound = await this.userModel.findOne({ email: user.email });
    const usernameFound = await this.userModel.findOne({
      username: user.username,
    });

    if (emailFound || usernameFound) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: ExceptionMessages.EMAIL_OR_USERNAME_IN_USE,
        },
        HttpStatus.FORBIDDEN,
      );
    }

    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(user.password, salt);

    const newUser = new this.userModel({
      email: user.email,
      username: user.username,
      nickname: user.username,
      password: hash,
      gamesPlayed: 0,
      cumulativePoints: 0,
      wins: 0,
    });

    await newUser.save();

    return this.dtoFunctions.userToDTO(newUser);
  }

  public async validateUser(username: string, password: string): Promise<User> {
    const result = await this.userModel.findOne({ username });

    if (!result) return null;

    const user = this.dtoFunctions.userToDTO(result);
    user.password = result.password;

    if (await bcrypt.compare(password, user.password)) return user;

    return null;
  }

  public async login(user: User): Promise<TokenDTO> {
    const payload = { user: user.username, id: user.id };
    const tokenDTO: TokenDTO = {
      accessToken: this.jwtService.sign(payload),
      refreshToken: await this.generateRefreshToken(user, nanoid(64)),
    };

    return tokenDTO;
  }

  public async getUserWithTokens(id: string): Promise<User> {
    const user = await this.userModel.findById(id);
    const userDTO = this.dtoFunctions.userToDTO(user);
    userDTO.refreshToken = user.refreshToken;
    userDTO.refreshTokenExpiry = user.refreshTokenExpiry;

    return userDTO;
  }

  private async generateRefreshToken(
    user: User,
    token: string,
  ): Promise<string> {
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + 7);

    const updatedUser = await this.userModel.findById(user.id);
    updatedUser.refreshToken = token;
    updatedUser.refreshTokenExpiry = expiry;

    await updatedUser.save();

    return token;
  }
}
