import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { GroupController } from './group.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { GroupService } from './group.service';
import { VerifyGroupNameAvailability } from './middleware/verifyGroupNameAvailability.middleware';

@Module({
  imports: [PrismaModule],
  controllers: [GroupController],
  providers: [GroupService],
})
export class GroupModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(VerifyGroupNameAvailability)
      .forRoutes({ path: '/group', method: RequestMethod.POST });
  }
}
