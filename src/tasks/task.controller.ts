import {
  Body,
  Controller,
  Res,
  Post,
  Get,
  Req,
  HttpCode,
  HttpStatus,
  Query,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { TasksService } from './task.service';
import { Request, Response, response } from 'express';
import {
  FiltersTask,
  PaginationDTO,
  TaskDTO,
  UpdateTaskDTO,
} from './dto/tasks.dto';
import { TaskState, User } from '@prisma/client';

@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TasksService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createTask(
    @Req() request: Request,
    @Res() response: Response,
    @Query('groupId') groupId: string,
    @Body() taskData: TaskDTO,
  ): Promise<Response<TaskDTO>> {
    const { id } = request.user as User;

    const task = await this.taskService.createTask(id, groupId, taskData);

    return response.json(task);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async listUserTasks(
    @Query() filters: FiltersTask,
    @Req() request: Request,
    @Res() response: Response,
  ): Promise<Response<PaginationDTO>> {
    const { id } = request.user as User;

    const userTasks = await this.taskService.listUserTasks(id, filters);

    return response.json(userTasks);
  }

  @Patch('/update/:taskId')
  @HttpCode(HttpStatus.OK)
  async updateTaskState(
    @Query('progress') query: TaskState,
    @Param('taskId') taskId: string,
    @Res() response: Response,
  ): Promise<Response<TaskDTO>> {
    const taskUpdate = await this.taskService.updateTaskState(query, taskId);

    return response.json(taskUpdate);
  }

  @Patch('/:taskId')
  @HttpCode(HttpStatus.OK)
  async updateTask(
    @Param('taskId') taskId: string,
    @Res() response: Response,
    @Body() data: UpdateTaskDTO,
  ): Promise<Response<UpdateTaskDTO>> {
    const taskUpdate = await this.taskService.updateTask(data, taskId);

    return response.json(taskUpdate);
  }

  @Delete('/:taskId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteTask(@Param('taskId') taskId: string): Promise<void> {
    return await this.taskService.deleteTask(taskId);
  }
}
