const e=`<p class="goal">Voice integration in web and mobile applications: real-time Whisper Speech-to-Text and low-latency streaming Text-to-Speech without memory buffering.</p>

<h3>1. Speech-to-Text (Whisper)</h3>
<pre data-lang="typescript"><code class="language-typescript">import fs from "fs";
import { OpenAI } from "openai";

const openai = new OpenAI();

export async function transcribeAudio(audioPath: string): Promise<string> {
  const transcription = await openai.audio.transcriptions.create({
    file: fs.createReadStream(audioPath),
    model: "whisper-1",
    language: "en", // specifying language cuts transcription latency in half
    response_format: "text",
    temperature: 0.0,
  });
  return transcription;
}</code></pre>

<h3>2. Streaming Audio with Node.js & WHATWG Streams</h3>
<p>In modern Node (Node 18+), native <code>fetch</code> returns a WHATWG <code>ReadableStream</code>. Calling <code>.pipe(res)</code> directly throws a <code>TypeError</code>. You must convert it using <code>Readable.fromWeb()</code> or stream chunks manually.</p>

<pre data-lang="typescript"><code class="language-typescript">import { Readable } from "stream";
import { Response } from "express";

export async function streamTextToSpeech(text: string, res: Response) {
  const response = await fetch("https://api.openai.com/v1/audio/speech", {
    method: "POST",
    headers: {
      "Authorization": \`Bearer \${process.env.OPENAI_API_KEY}\`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "tts-1", // tts-1 is optimized for real-time sub-300ms latency
      voice: "alloy",
      input: text,
      response_format: "opus", // lowest latency & smallest payload
    }),
  });

  if (!response.ok || !response.body) {
    return res.status(500).json({ error: "TTS failed" });
  }

  res.setHeader("Content-Type", "audio/opus");
  res.setHeader("Transfer-Encoding", "chunked");

  // Correct Node.js WHATWG to Node stream bridge:
  // @ts-ignore
  const nodeReadable = Readable.fromWeb(response.body);
  nodeReadable.pipe(res);
}</code></pre>

<div class="exercises"><h3>Practice</h3>
<details class="ex"><summary>352.1 <span class="levels">basic</span> Play an incoming Opus chunk stream directly in the browser via Web Audio API.</summary><div><p>Use <code>AudioContext.decodeAudioData</code> or MediaSource Extensions to play audio with zero download delay.</p></div></details>
</div>`;export{e as default};
