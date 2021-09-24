export interface AccessPolicyCondition<Context = unknown> {
  (context: Context): boolean | Promise<boolean>;
}
