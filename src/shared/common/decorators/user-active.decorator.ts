import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { UserPayload } from "../interface/user-payload.interface";

export const UserActive = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): UserPayload => {
    const request = ctx.switchToHttp().getRequest();
    return {
      userId: request.user.userId,
      username: request.user.username,
    };
  },
);