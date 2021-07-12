export interface AccessPolicyCondition<
  Action extends string = string,
  Request = unknown
> {
  ({}: { action: Action; req: Request }): boolean | Promise<boolean>;
}
