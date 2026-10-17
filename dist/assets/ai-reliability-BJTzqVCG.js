const e=`<p class="goal">Handling HTTP 429 rate limits, provider outages, exponential backoff with full jitter, and circuit-breaker tripping.</p>

<h3>1. Exponential Backoff with Full Jitter</h3>
<pre data-lang="typescript"><code class="language-typescript">export async function withExponentialBackoff<T>(
  fn: () => Promise<T>,
  maxRetries = 4,
  baseDelayMs = 500,
  maxDelayMs = 8000
): Promise<T> {
  let attempt = 0;
  while (true) {
    try {
      return await fn();
    } catch (err: any) {
      attempt++;
      // Only retry transient 429 and 5xx errors
      const isRetryable = err.status === 429 || (err.status >= 500 && err.status < 600);
      if (!isRetryable || attempt > maxRetries) {
        throw err;
      }

      // Full Jitter: Sleep = rand(0, min(maxDelay, baseDelay * 2^attempt))
      const backoff = Math.min(maxDelayMs, baseDelayMs * Math.pow(2, attempt));
      const jitteredSleep = Math.random() * backoff;
      console.warn(\`Attempt \${attempt} failed with \${err.status}. Retrying in \${Math.round(jitteredSleep)}ms...\`);
      await new Promise((res) => setTimeout(res, jitteredSleep));
    }
  }
}</code></pre>

<h3>2. Circuit Breaker for AI Endpoints</h3>
<pre data-lang="typescript"><code class="language-typescript">class CircuitBreaker {
  private failures = 0;
  private lastFailureTime = 0;
  private state: "CLOSED" | "OPEN" | "HALF_OPEN" = "CLOSED";

  async execute<T>(action: () => Promise<T>, fallback: () => Promise<T>): Promise<T> {
    if (this.state === "OPEN") {
      if (Date.now() - this.lastFailureTime > 30000) {
        this.state = "HALF_OPEN";
      } else {
        return await fallback(); // Fail fast without calling overloaded provider
      }
    }

    try {
      const result = await action();
      if (this.state === "HALF_OPEN") this.reset();
      return result;
    } catch (err) {
      this.failures++;
      this.lastFailureTime = Date.now();
      if (this.failures >= 5) this.state = "OPEN";
      return await fallback();
    }
  }

  reset() {
    this.failures = 0;
    this.state = "CLOSED";
  }
}</code></pre>

<div class="exercises"><h3>Practice</h3>
<details class="ex"><summary>359.1 <span class="levels">basic</span> Implement an automatic failover from Anthropic Claude to OpenAI GPT-4o when the breaker opens.</summary><div><p>Execute Claude inside <code>circuitBreaker.execute</code>, falling back to OpenAI in the fallback handler.</p></div></details>
</div>`;export{e as default};
