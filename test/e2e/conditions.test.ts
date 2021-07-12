import { Test } from "@nestjs/testing";
import { AccessPolicyModule, Effect } from "src";
import supertest from "supertest";
import { TestingAccessPolicy } from "./testing.access-policy";
import { TestingController } from "./testing.controller";

describe("Conditions", () => {
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

  describe("Logic", () => {
    describe("And", () => {
      describe("All Passed", () => {
        beforeEach(async () => {
          jest
            .spyOn(TestingAccessPolicy.prototype, "statements", "get")
            .mockReturnValue([
              {
                actions: ["a"],
                effect: Effect.Allow,
                conditions: [() => true, () => true],
              },
            ]);

          response = await requester.get("/a/");
        });

        it("should return status 200", () => {
          expect(response.status).toBe(200);
        });
      });

      describe("Any Not Passed", () => {
        beforeEach(async () => {
          jest
            .spyOn(TestingAccessPolicy.prototype, "statements", "get")
            .mockReturnValue([
              {
                actions: ["a"],
                effect: Effect.Allow,
                conditions: [() => true, () => false],
              },
            ]);

          response = await requester.get("/a/");
        });

        it("should return status 403", () => {
          expect(response.status).toBe(403);
        });
      });
    });

    describe("Or", () => {
      describe("All Passed", () => {
        beforeEach(async () => {
          jest
            .spyOn(TestingAccessPolicy.prototype, "statements", "get")
            .mockReturnValue([
              {
                actions: ["a"],
                effect: Effect.Allow,
                conditions: [[() => true, () => true]],
              },
            ]);

          response = await requester.get("/a/");
        });

        it("should return status 200", () => {
          expect(response.status).toBe(200);
        });
      });

      describe("Partial Passed", () => {
        beforeEach(async () => {
          jest
            .spyOn(TestingAccessPolicy.prototype, "statements", "get")
            .mockReturnValue([
              {
                actions: ["a"],
                effect: Effect.Allow,
                conditions: [[() => true, () => false]],
              },
            ]);

          response = await requester.get("/a/");
        });

        it("should return status 200", () => {
          expect(response.status).toBe(200);
        });
      });
    });
  });

  describe("Async", () => {
    describe("Not Passed", () => {
      beforeEach(async () => {
        jest
          .spyOn(TestingAccessPolicy.prototype, "statements", "get")
          .mockReturnValue([
            {
              actions: ["a"],
              effect: Effect.Allow,
              conditions: [async () => false],
            },
          ]);
        response = await requester.get("/a/");
      });

      it("should return status 403", () => {
        expect(response.status).toBe(403);
      });
    });
  });
});
