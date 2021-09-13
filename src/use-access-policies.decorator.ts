import { SetMetadata, Type } from "@nestjs/common";
import { ACCESS_POLICY_TOKEN } from "./access-policy-token.symbol";

export const UseAccessPolicies = (...tokens: (string | symbol | Type)[]) =>
  SetMetadata(ACCESS_POLICY_TOKEN, tokens);
