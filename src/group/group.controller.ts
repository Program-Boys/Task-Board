import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Res,
} from '@nestjs/common';
import { GroupDTO, UpdateGroupDTO } from './dto/group.dto';
import { Response, response } from 'express';
import { GroupService } from './group.service';

@Controller('group')
export class GroupController {
  constructor(private readonly groupServices: GroupService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createGroup(
    @Body() data: GroupDTO,
    @Res() response: Response,
  ): Promise<Response<GroupDTO>> {
    const createdGroup = await this.groupServices.createGroup(data);

    return response.json(createdGroup);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async listGroups(@Res() response: Response): Promise<Response<GroupDTO[]>> {
    const groups = await this.groupServices.listGroups();

    return response.json(groups);
  }

  @Patch('/:groupId')
  @HttpCode(HttpStatus.ACCEPTED)
  async updateGroup(
    @Param('groupId') groupId: string,
    @Res() response: Response,
    @Body() data: UpdateGroupDTO,
  ): Promise<Response<GroupDTO>> {
    const updatedGroup = await this.groupServices.updateGroup(data, groupId);

    return response.json(updatedGroup);
  }

  @Delete('/:groupId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteGroup(@Param('groupId') groupId: string): Promise<void> {
    return await this.groupServices.deleteGroup(groupId);
  }
}
