import { SetMetadata, Type } from "@nestjs/common";
import { metadataKeys } from "../constants";

export const UseAccessPolicies = (...tokens: (string | symbol | Type)[]) =>
  SetMetadata(metadataKeys.ACCESS_POLICY_TOKEN, tokens);
