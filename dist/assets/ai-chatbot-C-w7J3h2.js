const e=`<p class="goal">Engineering production chatbots: state persistence, system guardrails, message deduplication, and streaming conversational UX.</p>
<h3>Database Schema for Conversation State</h3>
<pre data-lang="sql"><code class="language-sql">CREATE TABLE conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    title TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    role VARCHAR(20) NOT NULL CHECK (role IN ('user', 'assistant', 'system', 'tool')),
    content TEXT NOT NULL,
    token_count INT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_messages_conv ON messages(conversation_id, created_at ASC);</code></pre>

<div class="exercises"><h3>Practice</h3>
<details class="ex"><summary>354.1 <span class="levels">basic</span> Implement conversation summarization when message history exceeds 12 turns.</summary><div><p>Trigger a background job that compresses turns 1-8 into a summary prompt injected at turn 9.</p></div></details>
</div>`;export{e as default};
