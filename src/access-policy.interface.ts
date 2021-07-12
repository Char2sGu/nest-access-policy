import { AccessPolicyStatement } from "./access-policy-statement.interface";

export interface AccessPolicy<
  Action extends string = string,
  Request = unknown
> {
  statements: AccessPolicyStatement<Action, Request>[];
}
