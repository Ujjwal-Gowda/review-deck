const e=`<p class="goal">Role-Based Access Control (RBAC) in SaaS: Owners, Admins, Members, Viewers, permission middleware, and audit logs.</p>
<pre data-lang="typescript"><code class="language-typescript">export type Role = "owner" | "admin" | "member" | "viewer";

export const PERMISSIONS = {
  "billing:manage": ["owner"],
  "team:invite": ["owner", "admin"],
  "project:write": ["owner", "admin", "member"],
  "project:read": ["owner", "admin", "member", "viewer"],
} as const;

export function canUser(role: Role, action: keyof typeof PERMISSIONS): boolean {
  return (PERMISSIONS[action] as readonly string[]).includes(role);
}</code></pre>
<div class="exercises"><h3>Practice</h3>
<details class="ex"><summary>379.1 <span class="levels">basic</span> Write an Express middleware enforcing permissions on API routes.</summary><div><p>Check user role in team context, respond with 403 Forbidden if not authorized.</p></div></details>
</div>`;export{e as default};
