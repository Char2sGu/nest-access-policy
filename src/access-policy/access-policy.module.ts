import { Module } from "@nestjs/common";
import { AccessPolicyService } from "./access-policy.service";

@Module({
  providers: [AccessPolicyService],
  exports: [AccessPolicyService],
})
export class AccessPolicyModule {}
