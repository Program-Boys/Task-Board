import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { VerifyUserIdMiddleware } from './middlewares/verifyUserId.middleware';
import { VerifyUserEmailAvailability } from './middlewares/verifyUserEmailAvailability.middleware';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    PrismaModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET_NEW_PASS,
      signOptions: { expiresIn: 400 },
    }),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(VerifyUserIdMiddleware)
      .forRoutes(
        { path: 'users/:id', method: RequestMethod.GET },
        { path: 'users/update/:id', method: RequestMethod.PATCH },
        { path: 'users/deactivate/:id', method: RequestMethod.PATCH },
      );

    consumer
      .apply(VerifyUserEmailAvailability)
      .forRoutes({ path: 'users', method: RequestMethod.POST });
  }
}
