import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  Type,
} from "@nestjs/common";
import { ModuleRef } from "@nestjs/core";
import { ACCESS_POLICY_TOKEN } from "./access-policy-token.symbol";
import { AccessPolicy } from "./access-policy.interface";
import { AccessPolicyService } from "./access-policy.service";

@Injectable()
export class AccessPolicyGuard implements CanActivate {
  @Inject()
  moduleRef!: ModuleRef;

  @Inject()
  service!: AccessPolicyService;

  async canActivate(context: ExecutionContext) {
    const policies = this.getPolicies(context.getClass());

    if (policies) {
      const action = context.getHandler().name;
      for (const policy of policies)
        await this.service.check(policy, action, policy.context(context));
    }

    return true;
  }

  protected getPolicies(controllerType: Type) {
    const tokens: (string | symbol | Type)[] | undefined = Reflect.getMetadata(
      ACCESS_POLICY_TOKEN,
      controllerType
    );
    return tokens?.map((token) => this.moduleRef.get<any, AccessPolicy>(token));
  }
}
