const e=`<p class="goal">Streaming text completions to your frontends, managing multi-turn context, token budgets, and handling connection drops cleanly.</p>
<h3>Production Streaming Server (Node.js / Express / Next.js)</h3>
<pre data-lang="typescript"><code class="language-typescript">import { OpenAI } from "openai";
import { Request, Response } from "express";

const openai = new OpenAI();

export async function handleStream(req: Request, res: Response) {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache, no-transform");
  res.setHeader("Connection", "keep-alive");

  const { prompt, history } = req.body;

  try {
    const stream = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a concise, structured customer assistant." },
        ...history.slice(-6), // keep sliding context window
        { role: "user", content: prompt }
      ],
      stream: true,
      max_tokens: 600,
      temperature: 0.2, // low temperature for consistent answers
    });

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || "";
      if (content) {
        res.write(\`data: \${JSON.stringify({ text: content })}

\`);
      }
    }
    res.write("data: [DONE]

");
    res.end();
  } catch (err: any) {
    res.write(\`data: \${JSON.stringify({ error: err.message })}

\`);
    res.end();
  }
}</code></pre>

<h3>Consuming Streams in React</h3>
<pre data-lang="typescript"><code class="language-typescript">async function streamCompletion(prompt: string, onChunk: (text: string) => void) {
  const response = await fetch("/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt, history: [] })
  });

  const reader = response.body?.getReader();
  const decoder = new TextDecoder();
  if (!reader) return;

  let buffer = "";
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("

");
    buffer = lines.pop() || "";

    for (const line of lines) {
      if (line.startsWith("data: ")) {
        const payload = line.slice(6);
        if (payload === "[DONE]") return;
        const parsed = JSON.parse(payload);
        if (parsed.text) onChunk(parsed.text);
      }
    }
  }
}</code></pre>

<div class="callout note"><b class="t">Note · Context Truncation</b><p>Never forward unbounded chat history. Implement a token sliding window or summarize older conversation history into a persistent memory slot.</p></div>

<div class="exercises"><h3>Practice</h3>
<details class="ex"><summary>350.1 <span class="levels">basic</span> Implement cancellation using AbortController on both frontend and backend.</summary><div><p>Listen for <code>req.on('close')</code> on Node to terminate the upstream LLM stream immediately so you do not burn tokens when a user clicks Stop.</p></div></details>
<details class="ex"><summary>350.2 <span class="levels">intermediate</span> Add client-side Markdown rendering with smooth incremental updates without flickering.</summary><div><p>Use libraries like <code>marked</code> with DOMPurify, throttling re-renders to animation frames.</p></div></details>
</div>`;export{e as default};
