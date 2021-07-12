import { ForbiddenException, Injectable } from "@nestjs/common";
import { AccessPolicyCondition } from "./access-policy-condition.interface";
import { AccessPolicy } from "./access-policy.interface";

@Injectable()
export class AccessPolicyService {
  async check(
    policy: AccessPolicy,
    { action, ...args }: Parameters<AccessPolicyCondition>[0]
  ) {
    let allow: boolean | null = null;
    for (const {
      actions,
      conditions = [],
      effect,
      reason,
    } of policy.statements) {
      if (!actions.includes(action)) continue;

      /**All of the condition groups are passed. */
      let isConditionsPassed = true;
      for (const v of conditions) {
        const group = v instanceof Array ? v : [v];
        /**One of the conditions of the group passed. */
        let isGroupPassed = false;
        for (const condition of group) {
          const isPassed = await condition({ action, ...args });
          if (isPassed) isGroupPassed = true;
        }

        if (!isGroupPassed) {
          isConditionsPassed = false;
          break;
        }
      }

      // forbid if any `allow` conditions are not passed
      if (effect == "allow") allow = isConditionsPassed;
      // forbid if any `forbid` conditions are passed
      if (effect == "forbid") allow = isConditionsPassed ? false : allow;

      if (allow == false) throw new ForbiddenException(reason);
    }

    // no statement matched
    if (!allow) throw new ForbiddenException();
  }
}
