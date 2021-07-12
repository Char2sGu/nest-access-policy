import { Test } from "@nestjs/testing";
import { AccessPolicyModule, Effect } from "src";
import supertest from "supertest";
import { TestingAccessPolicy } from "./testing.access-policy";
import { TestingController } from "./testing.controller";

describe("Reason", () => {
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

  describe("Reason Defined", () => {
    beforeEach(async () => {
      jest
        .spyOn(TestingAccessPolicy.prototype, "statements", "get")
        .mockReturnValue([
          {
            actions: ["a"],
            effect: Effect.Forbid,
            reason: "test",
          },
        ]);
      response = await requester.get("/a/");
    });

    it("should return the expected body", () => {
      expect(response.body.error).toBe("Forbidden");
      expect(response.body.message).toBe("test");
    });
  });

  describe("Reason Undefined", () => {
    beforeEach(async () => {
      jest
        .spyOn(TestingAccessPolicy.prototype, "statements", "get")
        .mockReturnValue([
          {
            actions: ["a"],
            effect: Effect.Forbid,
          },
        ]);
      response = await requester.get("/a/");
    });

    it("should return the expected body", () => {
      expect(response.body.error).toBeUndefined();
      expect(response.body.message).toBe("Forbidden");
    });
  });
});
