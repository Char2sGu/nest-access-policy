import { ExecutionContext } from "@nestjs/common";
import { AccessPolicyStatement } from "./access-policy-statement.interface";

export interface AccessPolicy<
  Action extends string = string,
  Context = unknown
> {
  statements: AccessPolicyStatement<Action, Context>[];
  context(context: ExecutionContext): Context;
}
