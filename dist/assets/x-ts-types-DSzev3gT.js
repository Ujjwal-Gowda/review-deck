const e=`<p class="goal">TypeScript Type Modelling &amp; Type Systems in Depth: Structural Typing, Discriminated Unions, Generics, Conditional &amp; Mapped Types, and Exhaustive Type Checking.</p>

<h3>The Philosophy: Structural Typing (Duck Typing with Proofs)</h3>
<p>In nominal type systems (Java, C++, C#), two classes with identical fields are incompatible unless they explicitly inherit from the same interface or class. TypeScript uses a <b>Structural Type System</b>: if an object has the required properties and matching types, it is compatible, regardless of what class created it.</p>

<div class="diagram">
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                              Structural vs Nominal Typing                              │
│                                                                                        │
│   class Point2D { x: number; y: number }                                               │
│   class Vector2D { x: number; y: number }                                              │
│                                                                                        │
│   function printCoord(p: Point2D) { console.log(p.x, p.y); }                           │
│                                                                                        │
│   const v = new Vector2D();                                                            │
│   printCoord(v); // ✅ 100% VALID IN TYPESCRIPT!                                      │
│                  // Java/C# would throw compile error: Type Mismatch!                  │
│                                                                                        │
│   ★ In TypeScript: Shapes matter, nominal names do NOT.                                │
└────────────────────────────────────────────────────────────────────────────────────────┘
</div>

<h3>Part 1: Discriminated Unions &amp; The Exhaustive \`never\` Check</h3>
<p>The single most powerful pattern in TypeScript is the <b>Discriminated Union</b> (Algebraic Tagged Union). Every variant has a shared literal tag (e.g. <code>kind</code> or <code>status</code>):</p>

<pre data-lang="typescript"><code class="language-typescript">type Payment =
  | { kind: "upi"; vpa: string; amountCents: number }
  | { kind: "card"; last4: string; network: "visa" | "mastercard"; amountCents: number }
  | { kind: "crypto"; txHash: string; currency: "ETH" | "USDC"; amountCents: number }
  | { kind: "cash"; amountCents: number };

// Exhaustive checking with the \`never\` type
function processPayment(p: Payment): string {
  switch (p.kind) {
    case "upi":
      return \`Processing UPI via \${p.vpa}\`;
    case "card":
      return \`Charging \${p.network} card ending in \${p.last4}\`;
    case "crypto":
      return \`Verifying \${p.currency} on-chain tx: \${p.txHash}\`;
    case "cash":
      return "Cash accepted at store register";
    default:
      // ⚠️ COMPILER SAFETY LOCK:
      // If someone adds a new variant to \`Payment\` (e.g. { kind: "apple_pay" })
      // and forgets to add a case statement here, TypeScript will REFUSE TO COMPILE!
      const _unreachable: never = p;
      throw new Error(\`Unhandled payment type: \${_unreachable}\`);
  }
}</code></pre>

<h3>Part 2: Generics &amp; Type Constraints</h3>
<p>Generics allow you to write reusable code while preserving exact input-to-output type relationships:</p>

<pre data-lang="typescript"><code class="language-typescript">// Type constraint: K MUST be a valid key of T
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const user = { id: 101, username: "dev_sara", email: "sara@corp.io" };
const username = getProperty(user, "username"); // Type is strictly \`string\`!
// getProperty(user, "invalidKey"); // ❌ Compile Error: Argument of type '"invalidKey"' is not assignable!</code></pre>

<h3>Part 3: Conditional Types &amp; The \`infer\` Keyword</h3>
<p>Conditional types enable type-level ternary logic (<code>T extends U ? X : Y</code>). The <code>infer</code> keyword extracts an internal type parameter dynamically:</p>

<pre data-lang="typescript"><code class="language-typescript">// 1. Unwrap Promise Return Type
type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;
type A = UnwrapPromise<Promise<string>>; // string
type B = UnwrapPromise<number>;          // number

// 2. Extract Element Type from Array
type ElementOf<T> = T extends (infer E)[] ? E : never;
type S = ElementOf<string[]>; // string

// 3. Extract Function Return Type
type MyReturnType<T> = T extends (...args: any[]) => infer R ? R : never;
type F = MyReturnType<() => { token: string }>; // { token: string }</code></pre>

<h3>Part 4: Mapped Types &amp; Deep Immutability</h3>
<p>Mapped types iterate over keys to transform object shapes:</p>

<pre data-lang="typescript"><code class="language-typescript">// How TypeScript's built-in Partial<T> is written:
type MyPartial<T> = {
  [K in keyof T]?: T[K];
};

// Recursive DeepReadonly
type DeepReadonly<T> = {
  readonly [K in keyof T]: T[K] extends object ? DeepReadonly<T[K]> : T[K];
};

interface AppConfig {
  database: {
    host: string;
    port: number;
    credentials: { user: string; pass: string };
  };
}

const config: DeepReadonly<AppConfig> = {
  database: { host: "localhost", port: 5432, credentials: { user: "admin", pass: "secret" } },
};
// config.database.port = 5433; // ❌ Compile Error: Cannot assign to 'port' because it is a read-only property!</code></pre>

<h3>Part 5: Template Literal Types (Type-Safe Strings)</h3>
<p>Construct complex event names, route patterns, and CSS units with mathematical precision:</p>

<pre data-lang="typescript"><code class="language-typescript">type Entity = "user" | "order" | "invoice";
type Action = "created" | "updated" | "deleted";

// Generates union of all 9 permutations: "user:created" | "user:updated" | ...
type EventType = \`\${Entity}:\${Action}\`;

type HttpMethod = "GET" | "POST" | "DELETE";
type Endpoint = \`/api/v1/\${string}\`;
type ApiRoute = \`\${HttpMethod} \${Endpoint}\`;

const validRoute: ApiRoute = "GET /api/v1/orders"; // ✅ Valid
// const invalidRoute: ApiRoute = "PATCH /orders"; // ❌ Compile Error!</code></pre>

<h3>Part 6: Bridging Runtime &amp; Compile-Time with Zod</h3>
<p>Remember: <b>TypeScript types exist ONLY at compile time.</b> When compiled to JavaScript, all interfaces, types, and generics are completely erased (zero runtime existence).</p>
<p>If an API returns a JSON payload, TypeScript cannot protect you from invalid data. Use <b>Zod</b> to validate runtime data and infer static TypeScript types from a single source of truth:</p>

<pre data-lang="typescript"><code class="language-typescript">import { z } from "zod";

// 1. Define the Runtime Validator
export const UserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  role: z.enum(["admin", "editor", "viewer"]),
  age: z.number().int().min(18).optional(),
});

// 2. Infer the Static TypeScript Type automatically
export type User = z.infer<typeof UserSchema>;

// 3. Safe Runtime Parsing
function handlePayload(unknownJson: unknown): User {
  const result = UserSchema.safeParse(unknownJson);
  if (!result.success) {
    throw new Error(\`Invalid user payload: \${result.error.message}\`);
  }
  // result.data is guaranteed to match the User type at runtime!
  return result.data;
}</code></pre>

<details class="ex">
  <summary><b>Drill: Why is \`type Role = (typeof ROLES)[number]\` better than a TypeScript \`enum\`?</b> (Click to expand)</summary>
  <pre data-lang="typescript"><code class="language-typescript">const ROLES = ["admin", "manager", "cashier"] as const;
type Role = (typeof ROLES)[number];</code></pre>
  <p><b>Question:</b> Why does modern production TypeScript avoid standard <code>enum Role { Admin, Manager }</code>?</p>
  <div class="callout key">
    <p><b>Answer: TypeScript enums generate awkward runtime code and lack string transparency!</b></p>
    <ul>
      <li>Numeric enums generate a reverse-mapped JavaScript object: <code>Role[Role["Admin"] = 0] = "Admin"</code>, which bloats bundles and allows accidental assignment of arbitrary numbers (e.g. <code>const r: Role = 999</code> compiles!).</li>
      <li><code>const ROLES = [...] as const</code> is zero runtime overhead, easy to iterate with <code>ROLES.includes()</code>, and serializes cleanly to JSON without conversion functions.</li>
    </ul>
  </div>
</details>
`;export{e as default};
