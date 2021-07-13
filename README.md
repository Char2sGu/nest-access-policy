# Nest Access Policy

Declarative and centralized access control.

> Inspired by [drf-access-policy](https://github.com/rsinger86/drf-access-policy/).

# Tutorial

## Creating the Access Policy

An `AccessPolicy` is a special provider where we define our access statements.

> A common usage is to make access policies and controllers have one-to-one relationships.

```ts
// books.access-policy.ts

@Injetable()
export class BooksAccessPolicy implements AccessPolicy {
  statements: AccessPolicyStatement[] = [
    {
      actions: ["list", "create", "retrieve", "update", "destroy"],
      effect: Effect.Allow,
    },
  ];
}
```

Each method of the controller is considered as an _action_. The `actions` defines the names of the actions controlled by the statement.

There are two kinds of statements: **_allow_ statements** with `effect` set to `Effect.Allow` and **_forbid_ statements** with `effect` set to `Effect.Forbid`. An action is allowed only when all _allow_ statements are passed (**at least one**) and no _forbid_ statements are passed.

Therefore, it is recommended to allow all the actions in the first statement as above and manage the permissions in next statements.

> The `AccessPolicy`, `AccessPolicyStatement`, `AccessPolicyCondition` types takes two optional type args, the first is the actions' type while the second is the request's type.

---

Now let's define the really important parts:

```ts
// books.access-policy.ts

@Injetable()
export class BooksAccessPolicy implements AccessPolicy {
  private isOwn: AccessPolicyCondition = async ({ req }) =>
    (await this.getBook(req)).owner == req.user;

  private notOwn: AccessPolicyCondition = async (ctx) =>
    !(await this.isOwn(ctx));

  private isPublic: AccessPolicyCondition = async ({ req }) =>
    (await this.getBook(req)).isPublic;

  private notImmutable: AccessPolicyCondition = async ({ req }) =>
    !(await this.getBook(req)).isImmutable;

  statements: AccessPolicyStatement[] = [
    {
      actions: ["list", "create", "retrieve", "update", "destroy"],
      effect: Effect.Allow,
    },
    {
      actions: ["retrieve"],
      effect: Effect.Forbid,
      conditions: [this.notOwn],
    },
    {
      actions: ["update", "destroy"],
      effect: Effect.Allow,
      conditions: [this.notImmutable, [this.isOwn, this.isPublic]],
    },
  ];

  @Inject()
  private booksService: BooksService;

  private async getBook(req: Request) {
    if (!req.entity) {
      const id = Number(req.params.id);
      const book = await this.booksService.retrieve(id);
      if (!book) throw new NotFoundException();
      req.entity = book;
    }
    return req.entity;
  }
}
```

All the elements in `conditions` are considered a _condition group_, which can be either a single condition or a list of conditions.  
The logical relationship between the condition groups is _and_, and the one between the member conditions of each condition groups is _or_.

> Since an `AccessPolicy` is a class, we can define the common conditions in a public policy such as `BaseAccessPolicy` and inherit the common conditions from it.

> If you prefer to define the conditions after the statements, you can make the statements a `getter`.

---

Although the statements above work well, they lack of error messages. Actually they are also organized improperly: The failure of a statement should be able to be described as a single reason.

Let's fix this:

```ts
// books.access-policy.ts

@Injetable()
export class BooksAccessPolicy implements AccessPolicy {
  // ...
  statements: AccessPolicyStatement[] = [
    // ...
    {
      actions: ["retrieve", "update", "destroy"],
      effect: Effect.Allow,
      conditions: [[this.isOwn, this.isPublic]],
      reason: "Only your own books or public books can be managed",
    },
    {
      actions: ["update", "destroy"],
      effect: Effect.Allow,
      conditions: [this.notImmutable],
      reason: "The immutable books cannot be managed",
    },
  ];
  // ...
}
```

When checking the statements, if a statement causes the request to be denied, such as a failed _allow_ statement or a passed _forbid_ statement, an `ForbiddenException` will be thrown with the reason of the statement as its message.

## Applying the Access Policy

Now we've done with the `AccessPolicy`, it only takes a few steps to apply it.

Since the `AccessPolicy` is injectable, it should be added to the `providers` list of the module. Whatsmore, we will use a `AccessPolicyGuard` to protect our routes, who injects `AccessPolicyService` to check the statements, so we also need to import the `AccessPolicyModule`:

```ts
// books.module.ts

@Module({
  // ...
  imports: [
    // ...
    AccessPolicyModule,
    // ...
  ],
  providers: [
    // ...
    BooksAccessPolicy,
    // ...
  ],
  // ...
})
export class BooksModule {}
```

Finally, of course, use the guard and apply the policy:

```ts
// books.controller.ts

@UseAccessPolicies(BooksAccessPolicy)
@UseGuards(AccessPolicyGuard)
@Controller()
export class BooksController {}
```

> To access `req.user`, you should ensure the `AuthGuard` is before the `AccessPolicyGuard`. See the [request lifecycle](https://docs.nestjs.com/faq/request-lifecycle) for more help.
