const e=`<p class="goal">Master JavaScript/TypeScript arrays, object records, high-performance Maps and Sets, and immutable state updates required for modern UI frameworks like React.</p>

<p>Choosing the correct collection and managing data immutability are cornerstone skills in frontend and backend TypeScript engineering. This chapter explores array methods, object records, specialized hash collections, and safe state-updating patterns.</p>

<h3>1. Arrays & Functional Methods</h3>
<p>JavaScript arrays are dynamic lists that support a rich suite of functional iteration methods. Note that methods like <code>shift()</code> and <code>unshift()</code> modify the front of the array and run in $O(n)$ time because all subsequent indices must be re-indexed.</p>

<pre data-lang="typescript"><code class="language-typescript">interface Order {
  id: number;
  status: "paid" | "pending";
  total: number;
  items: string[];
}

const orders: Order[] = [
  { id: 1, status: "paid", total: 4500, items: ["milk"] },
  { id: 2, status: "pending", total: 1200, items: ["bread", "butter"] },
];

// 1. Functional Transformations & Filters
const paidOrders = orders.filter(o => o.status === "paid");
const orderIds = orders.map(o => o.id);
const grossRevenue = orders.reduce((sum, o) => sum + o.total, 0);

// 2. Searching & Checking
const firstBigOrder = orders.find(o => o.total > 3000); // Returns first match or undefined
const hasPending = orders.some(o => o.status === "pending"); // True if ANY matches condition
const allValid = orders.every(o => o.total > 0);            // True if ALL match condition

// 3. Modern Array Methods (ES2023+): Non-mutating sorting
// .sort() mutates the original array in place. .toSorted() returns a BRAND NEW sorted copy!
const sortedOrders = orders.toSorted((a, b) => b.total - a.total);

// 4. FlatMap: Map each item into an array and flatten the result by 1 level
const allCartItems = orders.flatMap(o => o.items); // ['milk', 'bread', 'butter']

// 5. Array Destructuring
const [primaryOrder, secondaryOrder, ...remainingOrders] = orders;
</code></pre>

<h3>2. Objects as Records & Property Mutability</h3>
<p>Plain JavaScript objects are used as string-keyed dictionaries (records). However, objects are mutable by default.</p>

<pre data-lang="typescript"><code class="language-typescript">const profile = { username: "alice_dev", role: "admin", active: true };

// 1. Destructuring with renaming
const { username, role: userRole } = profile;

// 2. Shallow immutable update (Spread syntax)
// Creates a new object with overridden properties without mutating the original 'profile'
const updatedProfile = { ...profile, active: false };

// 3. Object entries & mapping
const originalPrices = { milk: 50, curd: 40 };
// Convert object to entries, transform values, and convert back to object
const discountedPrices = Object.fromEntries(
  Object.entries(originalPrices).map(([item, price]) => [item, price * 0.9])
);

// 4. Deep copying nested structures
const nestedConfig = { server: { host: "localhost", port: 8080 } };
const deepClone = structuredClone(nestedConfig); // Safe, native deep copy (ES2022+)
</code></pre>

<h3>3. <code>Map</code> and <code>Set</code>: When Keys Aren't Simple Strings</h3>
<p>While plain objects are great for fixed schemas, <b><code>Map</code></b> and <b><code>Set</code></b> are specialized collections built for dynamic key-value storage and high-performance uniqueness.</p>

<ul>
  <li><b><code>Map<K, V></code>:</b> Allows keys of <i>any</i> type (objects, functions, numbers, strings), preserves strict insertion order, provides an <code>.size</code> property, and has zero prototype pollution risks.</li>
  <li><b><code>Set<T></code>:</b> Stores a collection of unique values with $O(1)$ lookup speed and native mathematical set operations (ES2024).</li>
</ul>

<pre data-lang="typescript"><code class="language-typescript">// 1. Using a Map for dynamic non-string keys or frequent lookups
const userSessions = new Map<string, { token: string; expiresAt: number }>();
userSessions.set("usr_01", { token: "tok_abc", expiresAt: 1700000000 });

// Safe retrieval with nullish coalescing default fallback
const session = userSessions.get("usr_99") ?? { token: "guest", expiresAt: 0 };
userSessions.delete("usr_01");

// 2. Using a Set for deduplication and intersections
const allowedRoles = new Set(["admin", "moderator"]);
const userRoles = ["viewer", "admin"];

const hasPermission = userRoles.some(role => allowedRoles.has(role)); // true

// Deduplicating an array in one line using a Set spread:
const rawSkus = ["milk", "bread", "milk", "eggs", "bread"];
const uniqueSkus = [...new Set(rawSkus)]; // ['milk', 'bread', 'eggs']
</code></pre>

<h3>4. Immutable State Updates (React & UI State Standards)</h3>
<p>In modern frameworks like React, state must <b>never be mutated directly</b>. Mutating state objects directly bypasses change detection, leading to phantom UI bugs. You must always produce a brand new copy of arrays and objects.</p>

<pre data-lang="typescript"><code class="language-typescript">// Imagine managing cart state in a React component:
// const [cart, setCart] = useState<CartItem[]>([]);

// 1. ADD an item immutably
// setCart(currentCart => [...currentCart, newItem]);

// 2. REMOVE an item immutably by SKU
// setCart(currentCart => currentCart.filter(item => item.sku !== targetSku));

// 3. UPDATE an item's quantity immutably
// setCart(currentCart =>
//   currentCart.map(item =>
//     item.sku === targetSku ? { ...item, qty: item.qty + 1 } : item
//   )
// );
</code></pre>

<div class="exercises">
  <h3>Practice</h3>
  <details class="ex">
    <summary>0.1 <span class="levels">basic</span> Given an array of order records <code>{ store: string; sku: string; qty: number }[]</code>, write a TypeScript script that uses modern collection APIs to: (1) group orders by store, (2) compute total quantity per SKU using a <code>Map</code>, (3) determine the top 3 SKUs sorted by highest total quantity, and (4) return a brand-new array where a target order's quantity is updated immutably.</summary>
    <div>
      <p><b>Solution Strategy:</b> We use <code>Object.groupBy</code> (or reduce) for grouping, iterate with a <code>Map</code> to aggregate counts, sort Map entries to find the top 3, and use <code>.map()</code> for immutable updates.</p>
<pre data-lang="typescript"><code class="language-typescript">// TypeScript Collection Operations Solution

interface OrderRecord {
  id: string;
  store: string;
  sku: string;
  qty: number;
}

const orders: OrderRecord[] = [
  { id: "ord_1", store: "North", sku: "milk", qty: 5 },
  { id: "ord_2", store: "North", sku: "bread", qty: 2 },
  { id: "ord_3", store: "South", sku: "milk", qty: 10 },
  { id: "ord_4", store: "South", sku: "paneer", qty: 4 },
  { id: "ord_5", store: "East", sku: "milk", qty: 7 },
  { id: "ord_6", store: "East", sku: "bread", qty: 6 },
];

// 1. Group orders by store
// Using Object.groupBy (ES2024) or standard reduce fallback:
const ordersByStore = Object.groupBy(orders, (order) => order.store);
console.log("Orders Grouped by Store:", ordersByStore);

// 2. Compute total quantity per SKU using a Map
const skuTotals = new Map<string, number>();
for (const order of orders) {
  const currentTotal = skuTotals.get(order.sku) ?? 0;
  skuTotals.set(order.sku, currentTotal + order.qty);
}
console.log("\\nSKU Totals Map:", skuTotals);

// 3. Determine top 3 SKUs sorted by highest quantity
const topSkus = [...skuTotals.entries()]
  .toSorted((a, b) => b[1] - a[1]) // Sort descending by total qty
  .slice(0, 3);                    // Take top 3
console.log("\\nTop 3 SKUs:", topSkus);

// 4. Immutable update: Update order ord_2's quantity to 10 without mutating original array
const targetId = "ord_2";
const updatedOrders = orders.map((order) =>
  order.id === targetId ? { ...order, qty: 10 } : order
);

console.log("\\nOriginal Order #2 Qty:", orders.find(o => o.id === targetId)?.qty);       // 2 (Unchanged!)
console.log("Updated Order #2 Qty:", updatedOrders.find(o => o.id === targetId)?.qty); // 10 (Updated in new copy!)
</code></pre>
    </div>
  </details>
</div>
`;export{e as default};
