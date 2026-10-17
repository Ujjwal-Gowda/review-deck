const e=`<p class="goal">Safely releasing AI features: canary rollouts, latency budgets, shadow execution, and emergency circuit breakers.</p>
<h3>Shadow Execution Pattern</h3>
<pre data-lang="typescript"><code class="language-typescript">async function processUserPost(postText: string) {
  const savedPost = await db.posts.create({ text: postText });

  queueMicrotask(async () => {
    try {
      const tags = await generateAiTags(postText);
      await db.aiMetrics.log({ postId: savedPost.id, tags, latencyMs: 140 });
    } catch (err) {
      logger.error("Shadow AI failed silently", err);
    }
  });

  return savedPost;
}</code></pre>

<div class="exercises"><h3>Practice</h3>
<details class="ex"><summary>362.1 <span class="levels">basic</span> Implement a feature flag to roll out AI to 10% of users.</summary><div><p>Hash user ID modulo 100 to deterministically bucket requests.</p></div></details>
</div>`;export{e as default};
