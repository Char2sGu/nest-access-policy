import { Effect } from "src";
import supertest from "supertest";
import { prepare } from "./prepare.func";

describe("Context", () => {
  let requester: supertest.SuperTest<supertest.Test>;

  it("should fail", async () => {
    requester = await prepare(
      () => false,
      [
        {
          actions: ["get"],
          effect: Effect.Allow,
          conditions: [(value) => value],
        },
      ]
    );
    await requester.get("/").expect(403);
  });
});
