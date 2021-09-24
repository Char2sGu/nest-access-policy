import { Effect } from "src";
import supertest from "supertest";
import { prepare } from "./prepare.func";

describe("Effect", () => {
  let requester: supertest.SuperTest<supertest.Test>;

  it("should pass when no condition is matched", async () => {
    requester = await prepare(() => null, []);
    await requester.get("/").expect(403);
  });

  it("should pass when all conditions are passed", async () => {
    requester = await prepare(
      () => null,
      [{ actions: ["get"], effect: Effect.Allow }]
    );
    await requester.get("/").expect(200);
  });

  it("should fail when any Allow statements is failed", async () => {
    requester = await prepare(
      () => null,
      [{ actions: ["get"], effect: Effect.Allow, conditions: [() => false] }]
    );
    await requester.get("/").expect(403);
  });

  it("should fail when any Forbid statements is passed", async () => {
    requester = await prepare(
      () => null,
      [{ actions: ["get"], effect: Effect.Forbid }]
    );
    await requester.get("/").expect(403);
  });
});
