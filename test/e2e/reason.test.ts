import { Test } from "@nestjs/testing";
import { AccessPolicyModule, Effect } from "src";
import supertest from "supertest";
import { prepare } from "./prepare.func";

describe("Reason", () => {
  let requester: supertest.SuperTest<supertest.Test>;

  it("should return the error as `error` the reason as `message` when the reason is defined", async () => {
    requester = await prepare(
      () => null,
      [{ actions: ["get"], effect: Effect.Forbid, reason: "test" }]
    );
    await requester
      .get("/")
      .expect(403)
      .expect(({ body: { error, message } }) => {
        expect(error).toBe("Forbidden");
        expect(message).toBe("test");
      });
  });

  it("should return an `undefined` as `error` and the error as `message` when the reason is not defined", async () => {
    requester = await prepare(
      () => null,
      [{ actions: ["get"], effect: Effect.Forbid }]
    );
    await requester
      .get("/")
      .expect(403)
      .expect(({ body: { error, message } }) => {
        expect(error).toBeUndefined();
        expect(message).toBe("Forbidden");
      });
  });
});
