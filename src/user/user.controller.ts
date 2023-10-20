import {
  Body,
  Controller,
  Get,
  Post,
  HttpCode,
  HttpStatus,
  Req,
  Res,
  Patch,
  Query,
  Param,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { UserDTO, UserUpdateDTO } from './dto/user.dto';
import { UserService } from './user.service';
import {
  USER_DEACTIVATE,
  USER_EMAIL_WAS_SENT,
  USER_PASSWORD_UPDATED,
  USER_UPDATED,
} from './utils/user.messages';
import { IsPublic } from 'src/auth/decorators/is-public.decorator';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @IsPublic()
  @Get()
  @HttpCode(HttpStatus.OK)
  async getAll(@Res() response: Response): Promise<Response<UserDTO[]>> {
    const users = await this.userService.getAllUsers();

    return response.json(users);
  }

  @IsPublic()
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createUser(
    @Res() response: Response,
    @Body() data: UserDTO,
  ): Promise<Response<UserDTO>> {
    const createdUser = await this.userService.createUser(data);

    return response.json(createdUser);
  }

  @IsPublic()
  @Post('forget-password')
  @HttpCode(HttpStatus.OK)
  async resetPassword(
    @Res() response: Response,
    @Req() request: Request,
    @Body() data: Pick<UserDTO, 'email'>,
  ): Promise<Response<string>> {
    const { email } = data;

    await this.userService.forgetPassword(request, email);

    return response.json({
      message: USER_EMAIL_WAS_SENT,
    });
  }

  @IsPublic()
  @Post('new-password')
  @HttpCode(HttpStatus.OK)
  async newPassword(
    @Res() response: Response,
    @Body() data: Pick<UserDTO, 'password'>,
    @Query('token') token: string,
  ): Promise<Response<UserDTO>> {
    const { password } = data;

    const userWithNewPass = await this.userService.newPassword(token, password);

    return response.json({
      message: USER_PASSWORD_UPDATED,
      user: userWithNewPass,
    });
  }

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  async getUser(
    @Res() response: Response,
    @Param('id') id: string,
  ): Promise<Response<UserDTO>> {
    const user = await this.userService.getUserById(id);

    return response.json(user);
  }

  @Patch('update/:id')
  @HttpCode(HttpStatus.ACCEPTED)
  async updateUser(
    @Res() response: Response,
    @Param('id') id: string,
    @Body() data: UserUpdateDTO,
  ): Promise<Response<UserUpdateDTO>> {
    const updatedUser = await this.userService.updateUser(id, data);

    return response.json({
      message: USER_UPDATED,
      updatedUser,
    });
  }

  @Patch('/deactivate/:id')
  @HttpCode(HttpStatus.OK)
  async deactivateUser(
    @Res() response: Response,
    @Param('id') id: string,
  ): Promise<Response<string>> {
    await this.userService.deactivateUser(id);

    return response.json({
      message: USER_DEACTIVATE,
    });
  }
}
