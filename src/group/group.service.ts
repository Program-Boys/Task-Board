import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { GroupDTO, UpdateGroupDTO } from './dto/group.dto';
import { Prisma } from '@prisma/client';
import { randomUUID } from 'crypto';
import { select } from './utils/group.select';

@Injectable()
export class GroupService {
  constructor(private readonly prisma: PrismaService) {}

  async createGroup(dto: GroupDTO): Promise<GroupDTO> {
    const data: Prisma.GroupTaskCreateInput = {
      id: randomUUID(),
      groupName: dto.groupName,
    };

    const group = await this.prisma.groupTask.create({
      data,
    });

    return group;
  }

  async listGroups(): Promise<GroupDTO[]> {
    const groups = await this.prisma.groupTask.findMany({
      select,
    });

    return groups;
  }

  async updateGroup(
    data: UpdateGroupDTO,
    groupId: string,
  ): Promise<UpdateGroupDTO> {
    const groupUpdated = await this.prisma.groupTask.update({
      where: {
        id: groupId,
      },
      data,
    });

    return groupUpdated;
  }

  async deleteGroup(groupId: string): Promise<void> {
    await this.prisma.groupTask.delete({
      where: {
        id: groupId,
      },
    });

    return;
  }
}
