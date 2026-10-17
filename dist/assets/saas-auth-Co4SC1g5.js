const e=`<p class="goal">Multi-tenant auth: social login, magic links, session cookies, SAML SSO for enterprise, and team invitation acceptance flows.</p>
<div class="diagram">
User Click Invite Link ──► Verify JWT Token ──► Check Existing Account
                                                       ├── Yes: Add user_id to team_members
                                                       └── No: Prompt password/OAuth -> Add
</div>
<div class="exercises"><h3>Practice</h3>
<details class="ex"><summary>377.1 <span class="levels">basic</span> Implement a signed invitation token flow with 7-day expiration.</summary><div><p>Sign token containing <code>{ teamId, email, role }</code>, send via email, verify on redemption.</p></div></details>
</div>`;export{e as default};
