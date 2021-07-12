import { Controller, Get, UseGuards } from "@nestjs/common";
import { AccessPolicyGuard, UseAccessPolicies } from "src";
import { TestingAccessPolicy } from "./testing.access-policy";

@UseAccessPolicies(TestingAccessPolicy)
@UseGuards(AccessPolicyGuard)
@Controller()
export class TestingController {
  @Get("a")
  a() {}
}
