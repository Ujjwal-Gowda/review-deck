const e=`<p class="goal">Next.js App Router in Depth: React Server Components (RSC), Client Hydration Boundaries, Server Actions, Streaming SSR, and the 4 Caching Tiers.</p>

<h3>The Paradigm Shift of the App Router</h3>
<p>Traditional Single Page Applications (SPAs) ship an empty <code>&lt;div id="root"&gt;&lt;/div&gt;</code> HTML shell to the browser, followed by a massive 2 MB JavaScript bundle. The browser downloads the bundle, parses JavaScript, mounts React, executes <code>useEffect</code> fetches, and only then displays content. This causes slow First Contentful Paint (FCP) and poor SEO.</p>

<p>The <b>Next.js App Router</b> splits React execution across two environments: <b>Node.js/Edge servers</b> and <b>browsers</b>. It introduces <b>React Server Components (RSC)</b>, where components run exclusively on the server, talk directly to databases without creating public REST APIs, and ship <b>zero JavaScript</b> to the user's device.</p>

<div class="diagram">
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                              Next.js App Router Architecture                           │
│                                                                                        │
│   Browser Request ──► Next.js Edge / Node Server                                       │
│                              │                                                         │
│                              ▼                                                         │
│   ┌──────────────────────────────────────────────────────────────────────────────┐     │
│   │                     Server Components (The Default in app/)                  │     │
│   │   • Direct PostgreSQL / Redis queries (Zero public API surface)              │     │
│   │   • Keep secret API keys (Stripe, OpenAI) safe on server                     │     │
│   │   • Render heavy libraries (markdown, date-fns) with 0 kB client bundle size │     │
│   └──────────────────────────┬───────────────────────────────────────────────────┘     │
│                              │                                                         │
│                              ▼ Generates HTTP Stream                                   │
│   ┌──────────────────────────────────────────────────────────────────────────────┐     │
│   │  1. Instant Static HTML Shell (Sent in &lt; 20ms for fast First Paint)          │     │
│   │  2. RSC Wire Protocol (Compact JSON-like stream of UI tree)                  │     │
│   │  3. Only JavaScript bundles for \`"use client"\` interactive islands           │     │
│   └──────────────────────────┬───────────────────────────────────────────────────┘     │
│                              │ Chunked Transfer Encoding Streaming                     │
│                              ▼                                                         │
│   ┌──────────────────────────────────────────────────────────────────────────────┐     │
│   │                      Client Browser Hydration                                │     │
│   │   • Displays instant HTML                                                    │     │
│   │   • Hydrates only \`"use client"\` islands (forms, modals, interactive state)  │     │
│   └──────────────────────────────────────────────────────────────────────────────┘     │
└────────────────────────────────────────────────────────────────────────────────────────┘
</div>

<h3>Part 1: Server Components vs Client Components</h3>

<table>
  <tr><th>Capability</th><th>Server Component (Default)</th><th>Client Component (<code>"use client"</code>)</th></tr>
  <tr><td><b>Execution Environment</b></td><td>Server only (never in browser)</td><td>Pre-rendered on server (SSR) + hydrated in browser</td></tr>
  <tr><td><b>Direct Database / FS Access</b></td><td><b>YES</b> (<code>await db.query(...)</code>)</td><td>No (must use API routes or Server Actions)</td></tr>
  <tr><td><b>Interactive Hooks (<code>useState</code>, <code>useEffect</code>)</b></td><td>No (runs once per request)</td><td><b>YES</b></td></tr>
  <tr><td><b>Browser APIs (<code>window</code>, <code>localStorage</code>)</b></td><td>No</td><td><b>YES</b> (inside <code>useEffect</code> or handlers)</td></tr>
  <tr><td><b>Impact on JS Bundle Size</b></td><td><b>0 kB</b> (Zero bytes shipped)</td><td>Full component code sent to browser</td></tr>
</table>

<div class="callout warn"><b class="t">The Boundary Rule: Passing Server Components into Client Components</b>
<p>A Client Component CANNOT import a Server Component directly (because the client bundle cannot execute server-only code). However, you can pass a Server Component as a <code>children</code> prop slot:</p>
<pre data-lang="tsx"><code class="language-tsx">// [OK] VALID PATTERN: Composing Server Components inside Client Components
// app/ClientModal.tsx ("use client")
"use client";
export function ClientModal({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  return isOpen ? &lt;div className="modal"&gt;{children}&lt;/div&gt; : null;
}

// app/page.tsx (Server Component)
export default async function Page() {
  const secretData = await db.secrets.findMany(); // Runs securely on server
  return (
    &lt;ClientModal&gt;
      &lt;ServerSecretList data={secretData} /&gt; {/* Passed via children! */}
    &lt;/ClientModal&gt;
  );
}</code></pre>
</div>

<h3>Part 2: Server Actions &amp; Progressive Enhancement</h3>
<p>A <b>Server Action</b> is an asynchronous function annotated with <code>"use server"</code>. It acts as an automated RPC endpoint without manually writing Express routes or Fetch boilerplate:</p>

<pre data-lang="tsx"><code class="language-tsx">// app/orders/actions.ts
"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db";

const CreateOrderSchema = z.object({
  productId: z.string().uuid(),
  quantity: z.coerce.number().positive(),
});

export async function createOrderAction(formData: FormData) {
  const parsed = CreateOrderSchema.safeParse({
    productId: formData.get("productId"),
    quantity: formData.get("quantity"),
  });

  if (!parsed.success) {
    return { error: "Validation failed" };
  }

  // Runs directly inside server Node runtime
  await db.query("INSERT INTO orders (product_id, quantity) VALUES ($1, $2)", [
    parsed.data.productId,
    parsed.data.quantity,
  ]);

  // Atomically invalidates the server cache for this route
  revalidatePath("/orders");
  return { success: true };
}</code></pre>

<p>When bound to an HTML <code>&lt;form action={createOrderAction}&gt;</code>, the form works <b>even before client JavaScript has finished downloading</b> (Progressive Enhancement via native HTTP POST)!</p>

<h3>Part 3: Streaming SSR with Suspense &amp; \`loading.tsx\`</h3>
<p>In traditional SSR, if one database query on a page takes 2 seconds, the <i>entire page</i> is blocked for 2 seconds. The App Router solves this with <b>Streaming SSR</b>:</p>

<pre data-lang="plaintext"><code class="language-plaintext">app/dashboard/
  ├── layout.tsx     ← Navigation shell (instant 2ms render)
  ├── loading.tsx    ← Instant skeleton UI shown while page loads
  └── page.tsx       ← Contains slow database queries streamed via Suspense</code></pre>

<pre data-lang="tsx"><code class="language-tsx">import { Suspense } from "react";

async function FastUserInfo() {
  const user = await db.getUser(); // 15ms query
  return &lt;h2&gt;Welcome back, {user.name}&lt;/h2&gt;;
}

async function SlowAnalyticsChart() {
  const stats = await db.computeMonthlyAnalytics(); // 1,800ms heavy query
  return &lt;Chart data={stats} /&gt;;
}

export default function DashboardPage() {
  return (
    &lt;div&gt;
      &lt;FastUserInfo /&gt; {/* Renders immediately! */}
      
      {/* Streams into the page over HTTP chunked transfer once ready */}
      &lt;Suspense fallback={&lt;div className="skeleton"&gt;Loading analytics...&lt;/div&gt;}&gt;
        &lt;SlowAnalyticsChart /&gt;
      &lt;/Suspense&gt;
    &lt;/div&gt;
  );
}</code></pre>

<h3>Part 4: The 4 Caching Tiers of Next.js</h3>

<div class="cheat">
  <div class="card">
    <h4>1. Request Memoization (React)</h4>
    <p><b>Scope:</b> Single render lifecycle.<br>If 3 components in the same tree call <code>fetch("https://api/user")</code>, React only executes 1 physical network request and shares the returned promise.</p>
  </div>
  <div class="card">
    <h4>2. Data Cache (Server)</h4>
    <p><b>Scope:</b> Across user requests and server restarts.<br>Configure persistence via <code>fetch(url, { next: { revalidate: 3600 } })</code> or tag-based invalidation with <code>revalidateTag("products")</code>.</p>
  </div>
  <div class="card">
    <h4>3. Full Route Cache (Server)</h4>
    <p><b>Scope:</b> Build time.<br>Static routes are compiled to pure HTML + RSC payloads once at build time. Serviced with zero Node execution overhead.</p>
  </div>
  <div class="card">
    <h4>4. Router Cache (Client Memory)</h4>
    <p><b>Scope:</b> User browser session.<br>Stores RSC payloads of previously visited routes in client RAM. Clicking "Back" renders instantaneously without hitting the server.</p>
  </div>
</div>

<details class="ex">
  <summary><b>Drill: Why can a Server Component never be converted into a Client Component once serialized?</b> (Click to expand)</summary>
  <p><b>Question:</b> When Next.js sends a Server Component's output to the browser, what format does it take? Can the browser re-run that component?</p>
  <div class="callout key">
    <p><b>Answer: The RSC Wire Format is pure data, not code!</b></p>
    <p>Server Components are compiled and executed on the server. Their output is serialized into a JSON-like stream of Virtual DOM element descriptors (tags, props, styles). The component's actual JavaScript code (functions, imports, SQL logic) is <b>never sent to the browser</b>.</p>
    <p>The client receives pure UI descriptions. It cannot "re-run" a Server Component because the component's code physically does not exist on the client machine!</p>
  </div>
</details>
`;export{e as default};
