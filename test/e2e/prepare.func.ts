import { Injectable, UseGuards, Controller, Get } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import {
  AccessPolicy,
  UseAccessPolicies,
  AccessPolicyGuard,
  AccessPolicyModule,
} from "src";
import supertest from "supertest";

export async function prepare<
  Policy extends AccessPolicy<Action, Context>,
  Action extends string,
  Context extends unknown
>(context: Policy["context"], statements: Policy["statements"]) {
  @Injectable()
  class TestingAccessPolicy implements AccessPolicy<Action, Context> {
    statements = statements;
    context = context;
  }

  @UseAccessPolicies(TestingAccessPolicy)
  @UseGuards(AccessPolicyGuard)
  @Controller()
  class TestingController {
    @Get()
    get() {
      return;
    }
  }

  const module = await Test.createTestingModule({
    imports: [AccessPolicyModule],
    controllers: [TestingController],
    providers: [TestingAccessPolicy],
  }).compile();

  const app = await module.createNestApplication().init();
  const requester = supertest(app.getHttpServer());
  return requester;
}
