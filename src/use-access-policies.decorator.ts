import { SetMetadata, Type } from "@nestjs/common";
import { ACCESS_POLICY_INJECTION_TOKENS } from "./access-policy-injection-tokens.symbol";

export const UseAccessPolicies = (...tokens: (string | symbol | Type)[]) =>
  SetMetadata(ACCESS_POLICY_INJECTION_TOKENS, tokens);
