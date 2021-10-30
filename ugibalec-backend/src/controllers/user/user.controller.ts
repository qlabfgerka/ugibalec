import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  UseGuards,
  Request,
} from '@nestjs/common';
import { User } from 'src/models/user/user.model';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  public async getUser(@Param('id') id: string): Promise<User> {
    return await this.userService.getUser(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('update')
  public async updateUser(
    @Body('nickname') nickname: string,
    @Request() req: any,
  ): Promise<User> {
    return await this.userService.updateUser(req.user.id, nickname);
  }
}
