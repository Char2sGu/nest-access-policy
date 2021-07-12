import { Test } from "@nestjs/testing";
import { AccessPolicyModule, Effect } from "src";
import supertest from "supertest";
import { TestingAccessPolicy } from "./testing.access-policy";
import { TestingController } from "./testing.controller";

describe("Basic", () => {
  let requester: supertest.SuperTest<supertest.Test>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [AccessPolicyModule],
      controllers: [TestingController],
      providers: [TestingAccessPolicy],
    }).compile();

    const app = await module.createNestApplication().init();
    requester = supertest(app.getHttpServer());
  });

  let response: supertest.Response;

  describe("None Matched", () => {
    beforeEach(async () => {
      response = await requester.get("/a/");
    });

    it("should return status 403", () => {
      expect(response.status).toBe(403);
    });
  });

  describe("All Allow Passed", () => {
    beforeEach(async () => {
      jest
        .spyOn(TestingAccessPolicy.prototype, "statements", "get")
        .mockReturnValue([
          {
            actions: ["a"],
            effect: Effect.Allow,
          },
        ]);
      response = await requester.get("/a/");
    });

    it("should return status 200", () => {
      expect(response.status).toBe(200);
    });
  });

  describe("Any Allow Not Passed", () => {
    beforeEach(async () => {
      jest
        .spyOn(TestingAccessPolicy.prototype, "statements", "get")
        .mockReturnValue([
          {
            actions: ["a"],
            effect: Effect.Allow,
            conditions: [() => false],
          },
        ]);
      response = await requester.get("/a/");
    });

    it("should return status 403", () => {
      expect(response.status).toBe(403);
    });
  });

  describe("Any Forbid Passed", () => {
    beforeEach(async () => {
      jest
        .spyOn(TestingAccessPolicy.prototype, "statements", "get")
        .mockReturnValue([
          {
            actions: ["a"],
            effect: Effect.Forbid,
          },
        ]);
    });

    it("should return status 403", () => {
      expect(response.status).toBe(403);
    });
  });
});
