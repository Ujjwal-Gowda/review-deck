const e=`<p class="goal">Deterministic prompt engineering patterns: structured outputs, Chain of Thought (CoT), few-shot demonstrations, and injection defense.</p>
<h3>Structured JSON Schema Output</h3>
<pre data-lang="typescript"><code class="language-typescript">import { z } from "zod";
import { zodResponseFormat } from "openai/helpers/zod";

const UserExtractionSchema = z.object({
  name: z.string(),
  age: z.number().nullable(),
  email: z.string().email(),
  tags: z.array(z.string())
});

const completion = await openai.beta.chat.completions.parse({
  model: "gpt-4o-mini",
  messages: [
    { role: "system", content: "Extract user contact information strictly adhering to the schema." },
    { role: "user", content: "Contact Sarah Connor at sarah@sky.net, age 29, priority customer" }
  ],
  response_format: zodResponseFormat(UserExtractionSchema, "user_info"),
});

const user = completion.choices[0].message.parsed;
console.log(user?.email);</code></pre>

<div class="exercises"><h3>Practice</h3>
<details class="ex"><summary>360.1 <span class="levels">basic</span> Create a defensive prompt template that safely isolates untrusted user text inside XML delimiters.</summary><div><p>Use <code>&lt;user_content&gt;...&lt;/user_content&gt;</code> and instruct the model that content inside tags is data, never instructions.</p></div></details>
</div>`;export{e as default};
