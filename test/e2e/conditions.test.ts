import { Effect } from "src";
import supertest from "supertest";
import { prepare } from "./prepare.func";

describe("Conditions", () => {
  let requester: supertest.SuperTest<supertest.Test>;

  describe("Logical", () => {
    describe("And", () => {
      it("should pass when all the conditions are passed", async () => {
        requester = await prepare(
          () => null,
          [
            {
              actions: ["get"],
              effect: Effect.Allow,
              conditions: [() => true, () => true],
            },
          ]
        );
        await requester.get("/").expect(200);
      });

      it("should fail when any condition is failed", async () => {
        requester = await prepare(
          () => null,
          [
            {
              actions: ["get"],
              effect: Effect.Allow,
              conditions: [() => true, () => false],
            },
          ]
        );
        await requester.get("/").expect(403);
      });
    });

    describe("Or", () => {
      it("should pass when all the conditions are passed", async () => {
        requester = await prepare(
          () => null,
          [
            {
              actions: ["get"],
              effect: Effect.Allow,
              conditions: [[() => true]],
            },
          ]
        );
        await requester.get("/").expect(200);
      });

      it("should pass when partial conditions are passed", async () => {
        requester = await prepare(
          () => null,
          [
            {
              actions: ["get"],
              effect: Effect.Allow,
              conditions: [[() => true, () => false]],
            },
          ]
        );
        await requester.get("/").expect(200);
      });

      it("should fail when all the condition are failed", async () => {
        requester = await prepare(
          () => null,
          [
            {
              actions: ["get"],
              effect: Effect.Allow,
              conditions: [[() => false]],
            },
          ]
        );
      });
    });
  });

  describe("Async", () => {
    it("should fail when all the conditions are failed", async () => {
      requester = await prepare(
        () => null,
        [
          {
            actions: ["get"],
            effect: Effect.Allow,
            conditions: [async () => false],
          },
        ]
      );
      await requester.get("/").expect(403);
    });
  });
});
