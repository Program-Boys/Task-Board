import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { TaskController } from './task.controller';
import { TasksService } from './task.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { VerifyTaskIdMiddleware } from './middlewares/verifyTaskId.middleware';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    PrismaModule,
    JwtModule.register({
      secret: process.env.JWT_PAGINATION,
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [TaskController],
  providers: [TasksService],
})
export class TaskModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(VerifyTaskIdMiddleware).forRoutes(
      {
        path: 'tasks/update/:taskId',
        method: RequestMethod.PATCH,
      },
      { path: 'tasks/:taskId', method: RequestMethod.PATCH },
      { path: 'tasks/:taskId', method: RequestMethod.DELETE },
    );
  }
}
