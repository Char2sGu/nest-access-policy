import { AccessPolicyCondition } from "./access-policy-condition.interface";
import { Effect } from "./effect.enum";

export interface AccessPolicyStatement<
  Action extends string = string,
  Request = unknown
> {
  actions: Action[];
  conditions: AccessPolicyCondition<Action, Request>[][];
  effect: Effect;
  reason?: string;
}
