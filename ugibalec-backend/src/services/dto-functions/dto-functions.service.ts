import { Injectable } from '@nestjs/common';
import { User } from 'src/models/user/user.model';

@Injectable()
export class DtoFunctionsService {
  public userToDTO(user: User): User {
    const userDTO: User = {
      id: user.id,
      email: user.email,
      username: user.username,
      nickname: user.nickname,
      wins: user.wins,
      cumulativePoints: user.cumulativePoints,
      gamesPlayed: user.gamesPlayed,
    };

    return userDTO;
  }
}
