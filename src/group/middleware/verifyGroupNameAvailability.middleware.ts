import {
  HttpException,
  Injectable,
  Logger,
  NestMiddleware,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';
import { GROUP_ALREADY_EXISTS } from '../utils/group.messages';

@Injectable()
export class VerifyGroupNameAvailability implements NestMiddleware {
  constructor(private readonly prisma: PrismaService) {}

  async use(request: Request, response: Response, next: NextFunction) {
    const { groupName } = request.body;

    const group = await this.prisma.groupTask.findFirst({
      where: {
        groupName,
      },
    });

    if (group) throw new HttpException(GROUP_ALREADY_EXISTS, 400);

    next();
  }
}
