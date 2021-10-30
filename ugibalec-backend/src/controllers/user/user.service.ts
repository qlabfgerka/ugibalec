import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/models/user/user.model';
import { DtoFunctionsService } from 'src/services/dto-functions/dto-functions.service';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly dtoFunctions: DtoFunctionsService,
  ) {}

  public async getUser(id: string): Promise<User> {
    const user = await this.userModel.findById(id);

    return this.dtoFunctions.userToDTO(user);
  }

  public async updateUser(id: string, nickname: string): Promise<User> {
    const user = await this.userModel.findById(id);

    user.nickname = nickname;

    await user.save();

    return this.dtoFunctions.userToDTO(user);
  }
}
