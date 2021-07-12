import { ForbiddenException } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { AccessPolicyService, Effect } from "src";

describe("AccessPolicyService", () => {
  let service: AccessPolicyService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [AccessPolicyService],
    }).compile();
    service = module.get(AccessPolicyService);
  });

  let ret: unknown;
  describe(".check()", () => {
    describe("No Statement Matched", () => {
      it("should throw", () => {
        expect(
          service.check(
            {
              statements: [
                {
                  actions: ["_"],
                  conditions: [[async () => true]],
                  effect: Effect.Allow,
                },
              ],
            },
            { action: "", req: {} }
          )
        ).rejects.toThrow(ForbiddenException);
      });
    });

    describe("Empty Conditions", () => {
      it("should pass", () => {
        expect(
          service.check(
            {
              statements: [
                {
                  actions: [""],
                  conditions: [],
                  effect: Effect.Allow,
                },
              ],
            },
            { action: "", req: {} }
          )
        ).resolves.toBeUndefined();
      });
    });

    describe("All Allow Passed", () => {
      it("should pass", () => {
        expect(
          service.check(
            {
              statements: [
                {
                  actions: [""],
                  conditions: [],
                  effect: Effect.Allow,
                },
              ],
            },
            { action: "", req: {} }
          )
        ).resolves.toBeUndefined();
      });
    });

    describe("Any Allow Not Passed", () => {
      it("should throw", () => {
        expect(
          service.check(
            {
              statements: [
                {
                  actions: [""],
                  conditions: [],
                  effect: Effect.Allow,
                },
                {
                  actions: [""],
                  conditions: [[async () => false]],
                  effect: Effect.Allow,
                },
              ],
            },
            { action: "", req: {} }
          )
        ).rejects.toThrow(ForbiddenException);
      });
    });

    describe("Any Forbid Passed", () => {
      it("should throw", () => {
        expect(
          service.check(
            {
              statements: [
                {
                  actions: [""],
                  conditions: [],
                  effect: Effect.Forbid,
                },
              ],
            },
            { action: "", req: {} }
          )
        ).rejects.toThrow(ForbiddenException);
      });
    });

    describe("Reason Provided", () => {
      it("should throw with the reason as message", async () => {
        try {
          await service.check(
            {
              statements: [
                {
                  actions: [""],
                  conditions: [],
                  effect: Effect.Forbid,
                  reason: "test",
                },
              ],
            },
            { action: "", req: {} }
          );
        } catch (error) {
          expect(error.message).toBe("test");
        }
      });
    });
  });
});
