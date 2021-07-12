import { Injectable } from "@nestjs/common";
import { AccessPolicy, AccessPolicyStatement } from "src";

@Injectable()
export class TestingAccessPolicy implements AccessPolicy {
  get statements(): AccessPolicyStatement[] {
    return [];
  }
}
