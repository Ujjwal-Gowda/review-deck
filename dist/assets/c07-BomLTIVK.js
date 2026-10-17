const e=`<p class="goal">Text is harder than it looks: characters, bytes, encodings, and formatting.</p>

<h3>Strings are sequences (usually immutable)</h3>
<pre data-lang="python"><code class="language-python">s = "FreshOn"
s[0], s[-1], s[1:5]     # 'F', 'n', 'resh'
len(s)                  # 7
s.lower(), s.upper()
s.replace("On", "Off")  # returns a NEW string; s is unchanged (immutable)
"  hi  ".strip()        # 'hi'
"a,b,,c".split(",")     # ['a', 'b', '', 'c']
"-".join(["a", "b"])    # 'a-b'
s.startswith("Fr"), "sh" in s, s.find("x")   # True, True, -1</code></pre>
<p><b>Why immutable?</b> It makes strings safe to share, safe to use as dictionary keys, and safe across threads. <b>The cost:</b> building a string piece by piece with <code>+=</code> in a loop can copy the whole string each time, which is O(n²). Collect the pieces in a list and <code>"".join(parts)</code> at the end, or use a builder (<code>StringBuilder</code> in Java, <code>strings.Builder</code> in Go, <code>String::push_str</code> in Rust).</p>

<h3>Characters, code points and encodings</h3>
<p>This is the part most people never learn properly:</p>
<ul>
<li><b>Unicode</b> assigns every character a number called a <b>code point</b>: 'A' = U+0041, 'ह' = U+0939, '₹' = U+20B9, '😀' = U+1F600. It covers every script, about 150,000 characters.</li>
<li>An <b>encoding</b> is how code points become bytes. <b>UTF-8</b> (the web's default) uses 1 byte for ASCII and 2–4 bytes for everything else. UTF-16 (used inside Windows, Java and JS strings) uses 2 or 4 bytes.</li>
<li>A user-perceived character (a <b>grapheme</b>) can be <i>several</i> code points: 'é' can be U+00E9, or 'e' + U+0301 (combining accent). Flag and family emoji are several code points joined together.</li>
</ul>
<pre data-lang="python"><code class="language-python">s = "₹50 हिंदी 😀"
len(s)                       # counts CODE POINTS
b = s.encode("utf-8")        # str → bytes
len(b)                       # counts BYTES: larger
b.decode("utf-8")            # bytes → str
"😀".encode("utf-8")         # b'\\xf0\\x9f\\x98\\x80': 4 bytes</code></pre>
<pre data-lang="javascript"><code class="language-javascript">"😀".length          // 2 !  JS counts UTF-16 code units, not characters
[..."😀"].length     // 1    iterating by code point</code></pre>
<pre data-lang="rust"><code class="language-rust">let s = "हिंदी";
s.len();              // bytes (UTF-8)
s.chars().count();    // code points
// &amp;s[0..1]          // PANIC: byte 1 is not on a character boundary</code></pre>
<div class="callout note"><b class="t">The golden rule of text</b><p><b>Decode bytes into text at the input boundary, work with text inside, and encode back to bytes at the output boundary. Always name the encoding (UTF-8).</b> "Mojibake" (garbage like <code>â‚¹</code> where ₹ should be) means something decoded UTF-8 bytes as a different encoding. Your terminal glyphs turning into <code>_</code> because the locale wasn't UTF-8 was exactly this class of problem.</p></div>
<p>In C, a "string" is just an array of bytes ending with a zero byte (<code>'\\0'</code>). <code>strlen</code> walks until it finds the zero. Forget the terminator, or write past the end, and you have a memory-safety bug. Every modern language stores the length alongside the data instead.</p>

<h3>Formatting</h3>
<pre data-lang="python"><code class="language-python">name, amt = "Asha", 1234.5
f"{name} paid ₹{amt:,.2f}"     # 'Asha paid ₹1,234.50'
f"{42:05d}"                    # '00042'
f"{'left':&lt;10}|{'right':&gt;10}|"  # padding/alignment
f"{amt=}"                      # 'amt=1234.5': handy for debugging</code></pre>
<p>Equivalents: JS template literals <code>\`\${name} paid\`</code>, Go <code>fmt.Sprintf("%s paid %.2f", name, amt)</code>, Rust <code>format!("{name} paid {amt:.2}")</code>, C <code>printf("%s paid %.2f\\n", name, amt)</code>.</p>

<h3>Regular expressions (the essentials)</h3>
<p>A small language for patterns in text. Learn these core pieces and you can read most regexes:</p>
<table>
<tr><th>Pattern</th><th>Means</th><th>Pattern</th><th>Means</th></tr>
<tr><td><code>.</code></td><td>any character</td><td><code>\\d \\w \\s</code></td><td>digit, word char, whitespace</td></tr>
<tr><td><code>* + ?</code></td><td>0+, 1+, 0 or 1 of previous</td><td><code>{2,4}</code></td><td>2 to 4 of previous</td></tr>
<tr><td><code>[a-z]</code></td><td>one of a set</td><td><code>[^0-9]</code></td><td>not in set</td></tr>
<tr><td><code>^ $</code></td><td>start / end of string</td><td><code>( )</code></td><td>capture group</td></tr>
<tr><td><code>a|b</code></td><td>a or b</td><td><code>*?</code></td><td>lazy (as few as possible)</td></tr>
</table>
<pre data-lang="python"><code class="language-python">import re
re.findall(r"\\d+", "order 42 has 3 items")        # ['42', '3']
m = re.match(r"(\\w+)@(\\w+)\\.com$", "asha@fresh.com")
m.group(1), m.group(2)                            # 'asha', 'fresh'
re.sub(r"\\s+", " ", "too    many   spaces")       # 'too many spaces'</code></pre>
<p>Use raw strings (<code>r"..."</code>) so backslashes reach the regex engine intact. Don't parse HTML, JSON or email addresses fully with regex: use a real parser.</p>

<div class="exercises"><h3>Exercises</h3>
<details class="ex"><summary>7.1 <span class="levels">basic</span> <code>is_palindrome(s)</code> ignoring case, spaces and punctuation ("A man, a plan, a canal: Panama" → True). Use the two-pointer technique: don't reverse the string.</summary><div>
<pre data-lang="python"><code class="language-python">def is_palindrome(s):
    i, j = 0, len(s) - 1
    while i &lt; j:
        if not s[i].isalnum(): i += 1; continue
        if not s[j].isalnum(): j -= 1; continue
        if s[i].lower() != s[j].lower(): return False
        i += 1; j -= 1
    return True</code></pre></div></details>
<details class="ex"><summary>7.2 <span class="levels">basic</span> Run-length encoding: "aaabccdddd" → "a3b1c2d4", and write the decoder too. Test that <code>decode(encode(s)) == s</code>.</summary><div>
<pre data-lang="python"><code class="language-python">def encode(s):
    out, i = [], 0
    while i &lt; len(s):
        j = i
        while j &lt; len(s) and s[j] == s[i]: j += 1
        out.append(f"{s[i]}{j - i}")
        i = j
    return "".join(out)
def decode(s):
    import re
    return "".join(ch * int(n) for ch, n in re.findall(r"(\\D)(\\d+)", s))</code></pre></div></details>
<details class="ex"><summary>7.3 <span class="levels">think</span> Print the UTF-8 byte count of each character in "a₹ह😀". Explain the pattern (1, 3, 3, 4).</summary><div><p><code>[len(c.encode()) for c in "a₹ह😀"]</code>. ASCII (&lt;128) takes 1 byte; up to U+07FF takes 2; up to U+FFFF takes 3 (₹ and Devanagari are here); beyond that (emoji) takes 4. UTF-8 is self-synchronising: the first byte's high bits say how many bytes follow.</p></div></details>
</div>
`;export{e as default};
