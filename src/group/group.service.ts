import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AddingFilters, GroupDTO, UpdateGroupDTO } from './dto/group.dto';
import { Prisma } from '@prisma/client';
import { randomUUID } from 'crypto';
import { select } from './utils/group.select';
import { GROUP_NOT_FOUND } from './utils/group.messages';
import { TASK_NOT_FOUND } from 'src/tasks/utils/tasks.messages';

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

  async addingTaskInGroup(filters: AddingFilters): Promise<GroupDTO> {
    const { groupId, taskId } = filters;

    return await this.prisma.$transaction(
      async (prismaTx: Prisma.TransactionClient) => {
        const group = await prismaTx.groupTask.findFirst({
          where: {
            id: groupId,
          },
        });

        if (!group) throw new HttpException(GROUP_NOT_FOUND, 404);

        const task = await prismaTx.task.findFirst({
          where: {
            id: taskId,
          },
        });

        if (!task) throw new HttpException(TASK_NOT_FOUND, 404);

        const updateGroup = await prismaTx.groupTask.update({
          where: {
            id: group.id,
          },
          data: {
            tasks: {
              connect: {
                id: taskId,
              },
            },
          },
          include: {
            tasks: true,
          },
        });

        return updateGroup;
      },
    );
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
