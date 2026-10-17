const e=`<p class="goal">Master the dual-nature of TypeScript: understand how JS values behave at runtime, avoid implicit coercion traps, and layer compile-time safety on top.</p>

<p>To master TypeScript, you must understand both levels of the language: the underlying runtime behavior of <b>JavaScript</b>, and the static type-checking layer of <b>TypeScript</b>. The type checker vanishes at compile time, meaning any runtime bugs (like division by zero, float precision errors, or indexing errors) are governed purely by JavaScript semantics.</p>

<h3>1. Variable Declarations & Mutability</h3>
<p>JavaScript has three declaration keywords: <code>const</code>, <code>let</code>, and <code>var</code>. Modern TypeScript code bases should exclusively use <code>const</code> and <code>let</code>.</p>

<ul>
  <li><b><code>const</code> (Default choice):</b> Creates a block-scoped variable binding that cannot be reassigned. However, <code>const</code> <i>does not</i> make objects immutable! It only freezes the <i>variable binding</i>. You can still mutate the properties of an object or elements of an array.</li>
  <li><b><code>let</code>:</b> Creates a block-scoped variable that can be reassigned freely.</li>
  <li><b><code>var</code> (Do not use):</b> Declares variables that are function-scoped or globally scoped, and they are hoisted to the top of their scope. This can cause severe bugs due to lack of block scope.</li>
</ul>

<pre data-lang="typescript"><code class="language-typescript">const MAX_LIMIT = 100;
// MAX_LIMIT = 200; // Compile Error: Cannot assign to 'MAX_LIMIT' because it is a constant.

const cart = ["milk", "eggs"];
cart.push("bread"); // Fully allowed! The array structure is mutated, but the binding is unchanged.
// cart = ["bread"]; // Compile Error: Reassignment of a const variable.

// If you need actual runtime immutability, use Object.freeze:
const frozenCart = Object.freeze(["milk", "eggs"]);
// frozenCart.push("bread"); // Runtime Error (in strict mode): Cannot add property, object is not extensible
</code></pre>

<h3>2. JavaScript Primitive Types & Runtime Behaviors</h3>
<p>JavaScript has seven primitive types, and TypeScript maps type annotations directly to them. Understanding how these behave at runtime is crucial.</p>

<table>
  <tr>
    <th>Type</th>
    <th>Examples</th>
    <th>Key Behaviors, Quirks & Pitfalls</th>
  </tr>
  <tr>
    <td><code>number</code></td>
    <td><code>42</code>, <code>3.14</code>, <code>NaN</code></td>
    <td><b>Every number is a 64-bit float (IEEE 754).</b> There is no separate <code>int</code> type. Safe integer math is only exact up to <code>2^53 - 1</code> (<code>Number.MAX_SAFE_INTEGER</code>). Beyond this, precision is lost.</td>
  </tr>
  <tr>
    <td><code>bigint</code></td>
    <td><code>9007199254740993n</code></td>
    <td>Used for arbitrarily large integers. To declare a <code>bigint</code>, append an <code>n</code> to the integer. Note: <code>bigint</code> cannot be mixed directly with <code>number</code> variables without explicit conversion.</td>
  </tr>
  <tr>
    <td><code>string</code></td>
    <td><code>"hi"</code>, <code>\`Value: \${x}\`</code></td>
    <td>Immutable UTF-16 character sequences. Note that emojis use surrogate pairs (2 code units), so <code>"😀".length</code> is actually <code>2</code>!</td>
  </tr>
  <tr>
    <td><code>boolean</code></td>
    <td><code>true</code>, <code>false</code></td>
    <td>No surprises here. Standard boolean flags.</td>
  </tr>
  <tr>
    <td><code>null</code> / <code>undefined</code></td>
    <td><code>null</code>, <code>undefined</code></td>
    <td>Two distinct "nothingness" values. <b><code>undefined</code></b> represents the absence of a value (e.g., an uninitialized variable or missing parameter). <b><code>null</code></b> represents the intentional absence of an object value.</td>
  </tr>
  <tr>
    <td><code>symbol</code></td>
    <td><code>Symbol("id")</code></td>
    <td>Represents a unique, immutable identifier. Primarily used for advanced metadata or private object keys.</td>
  </tr>
</table>

<pre data-lang="typescript"><code class="language-typescript">// Floating Point Precision Gaps
console.log(0.1 + 0.2 === 0.3); // false! (0.1 + 0.2 is actually 0.30000000000000004)
console.log(Math.abs((0.1 + 0.2) - 0.3) < Number.EPSILON); // true (The correct way to compare floats)

// BigInt declaration and safety
const safeInt = Number.MAX_SAFE_INTEGER; // 9007199254740991
const dangerousPlusOne = safeInt + 1;    // 9007199254740992
const dangerousPlusTwo = safeInt + 2;    // 9007199254740992 (Precision is now lost!)

const bigIntOne = 9007199254740991n;
console.log(bigIntOne + 2n);             // 9007199254740993n (Exact arithmetic preserved!)
</code></pre>

<h3>3. Implicit Coercion & Surprising Operators</h3>
<p>JavaScript is a <b>weakly typed</b> language, meaning it frequently coerces types behind the scenes. This produces counterintuitive behavior that TypeScript blocks in many cases, but can still manifest at runtime.</p>

<pre data-lang="typescript"><code class="language-typescript">// 1. Loose vs Strict Equality
// Always use === (strict equality), which compares value AND type without coercion.
console.log(5 == "5");  // true (loose equality coerces the string "5" into the number 5)
console.log(5 === "5"); // false (correct! different types)

// 2. Truthiness and False Values
// Falsy values: false, null, undefined, 0, NaN, "" (empty string). Everything else is truthy.
// Beware of empty objects/arrays: {} and [] are truthy!
const list: string[] = [];
if (list) {
  console.log("This prints because empty arrays are truthy!");
}

// 3. Logical OR (||) vs Nullish Coalescing (??)
// Logical OR replaces any falsy value. Nullish coalescing only replaces null or undefined.
const displayCount = 0;
console.log(displayCount || 10); // 10 (0 is falsy, so it's replaced!)
console.log(displayCount ?? 10); // 0 (0 is not null or undefined, so it's preserved! Usually what you want)

// 4. Addition vs Subtraction Coercion
console.log("5" + 3); // "53" (The + operator acts as string concatenation if a string is present)
console.log("5" - 3); // 2 (The - operator forces mathematical subtraction, converting "5" to 5)

// 5. Historical Bug
console.log(typeof null); // "object" (A well-known JS engine bug that can never be fixed for backwards-compatibility)
</code></pre>

<h3>4. Adding Static Types in TypeScript</h3>
<p>TypeScript layers a static type checking system over JavaScript's runtime values. Type annotations can be added explicitly, but TypeScript is excellent at type inference.</p>

<pre data-lang="typescript"><code class="language-typescript">// 1. Explicit annotations
let totalItems: number = 10;
let userEmail: string = "alice@example.com";

// 2. Inference: TypeScript automatically infers the types for us
let age = 30; // inferred as 'number'
const username = "john_doe"; // inferred as the string literal type "john_doe" (cannot change)

// 3. Unions: Allowing a variable to hold more than one type
let userId: string | number;
userId = "usr_90a"; // OK
userId = 1204;       // OK

// 4. 'unknown' vs 'any'
// Avoid 'any'! 'any' disables all type safety.
// Use 'unknown' for values whose type is not yet verified (e.g., from an external API or JSON.parse).
// 'unknown' forces you to check the type before performing operations.

let data: unknown = JSON.parse('{"id": 42, "role": "admin"}');

// We cannot do: data.role (Compile error: Object is of type 'unknown')

// Narrowing data safely via runtime checks:
if (typeof data === "object" && data !== null && "role" in data) {
  // TypeScript has narrowed 'data' and knows it is an object with a 'role' key
  console.log("User role:", (data as { role: string }).role);
}
</code></pre>

<h3>5. Type Erasure</h3>
<p>A vital mental model for TypeScript: <b>types are entirely erased when compiled to JavaScript</b>. The TypeScript compiler (<code>tsc</code>) checks your code for errors, strips all type annotations, interfaces, and type aliases, and outputs plain JavaScript.</p>

<p>This means TypeScript types do not exist at runtime! For example, <code>const x = input as User</code> performs no runtime validation or type casting; it is purely a compile-time assertion to appease the compiler. To validate actual incoming data (such as API payloads), you must use a schema validation library like <code>zod</code> or manually verify object structures.</p>

<h3>6. Practical Advice</h3>
<ul>
  <li>Always write <code>const</code> by default, and only use <code>let</code> when you know you will reassign the variable.</li>
  <li>Always use <code>===</code> and <code>!==</code>. Never use <code>==</code> or <code>!=</code>.</li>
  <li>Use the nullish coalescing operator <code>??</code> instead of the logical OR operator <code>||</code> when defining default values for numbers, booleans, or strings, to avoid overriding valid falsy values like <code>0</code>, <code>false</code>, or <code>""</code>.</li>
  <li>Leverage type inference to keep your code clean. Annotate function parameters, return values, and external inputs, but let TypeScript automatically infer your local variables.</li>
</ul>

<div class="exercises">
  <h3>Practice</h3>
  <details class="ex">
    <summary>0.1 <span class="levels">basic</span> Create a JavaScript/TypeScript script that processes user profile information. The program should accept a payload of type <code>unknown</code> (representing an external API payload), safely verify that it is an object containing a string <code>name</code>, an optional number <code>age</code>, and a boolean <code>active</code>, and then print a formatted profile card. If the data is invalid, it should output a specific validation error.</summary>
    <div>
      <p><b>Solution Strategy:</b> We write a type guard function <code>isUserProfile(data: unknown)</code> that checks the fields of the object. We use <code>typeof</code> to ensure primitive matches, and check for <code>null</code>.</p>
<pre data-lang="typescript"><code class="language-typescript">// TypeScript Type-Safe Verification

interface UserProfile {
  name: string;
  age?: number;
  active: boolean;
}

// Custom type guard
function isUserProfile(data: unknown): data is UserProfile {
  if (typeof data !== "object" || data === null) {
    return false;
  }

  // Asserting we can safely inspect the object
  const candidate = data as Record<string, unknown>;

  // Validate 'name' (must be string)
  if (typeof candidate.name !== "string") {
    return false;
  }

  // Validate optional 'age' (must be undefined or number)
  if (candidate.age !== undefined && typeof candidate.age !== "number") {
    return false;
  }

  // Validate 'active' (must be boolean)
  if (typeof candidate.active !== "boolean") {
    return false;
  }

  return true;
}

// Testing our safe type guard
function processPayload(payload: unknown) {
  if (isUserProfile(payload)) {
    // TypeScript has narrowed 'payload' to UserProfile!
    const ageStr = payload.age !== undefined ? \`\${payload.age} years old\` : "Age not specified";
    const status = payload.active ? "Active Member" : "Inactive Member";
    console.log(\`Profile: \${payload.name} (\${ageStr}) - \${status}\`);
  } else {
    console.error("Validation failed: Payload does not conform to UserProfile schema!");
  }
}

// 1. Valid payload
processPayload({ name: "Alice", age: 28, active: true }); 
// Outputs: Profile: Alice (28 years old) - Active Member

// 2. Missing 'active' field
processPayload({ name: "Bob", age: 40 }); 
// Outputs: Validation failed: Payload does not conform to UserProfile schema!

// 3. Invalid field type
processPayload({ name: "Charlie", age: "not a number", active: false });
// Outputs: Validation failed: Payload does not conform to UserProfile schema!
</code></pre>
    </div>
  </details>
</div>
`;export{e as default};
