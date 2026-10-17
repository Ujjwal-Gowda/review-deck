const n=`<p class="goal">Text in C: arrays of bytes ending in a zero. How to handle them without overflowing buffers.</p>
<h3>What a C string is</h3>
<div class="diagram">char name[8] = "milk";      [ m ][ i ][ l ][ k ][\\0][ ? ][ ? ][ ? ]
strlen(name) == 4            walks bytes until the '\\0' (O(n) every call)
sizeof name  == 8            the buffer size (only known where the array is declared)
char *lit = "milk";          a string LITERAL: read-only; writing to it is undefined behaviour</div>
<h3>Safe building and copying</h3>
<pre data-lang="c"><code class="language-c">char label[32];
int n = snprintf(label, sizeof label, "%s x%d", sku, qty);   /* always NUL-terminates; never overflows */
if (n &lt; 0 || (size_t)n &gt;= sizeof label) { /* truncated: handle it */ }

char dst[16];
snprintf(dst, sizeof dst, "%s", src);        /* a safe copy (strncpy doesn't always add the NUL: avoid it) */
/* strcpy, strcat, sprintf, gets: never with data whose length you don't control */</code></pre>
<h3>Comparing, searching, splitting</h3>
<pre data-lang="c"><code class="language-c">if (strcmp(a, b) == 0) { /* equal (strcmp returns &lt;0, 0 or &gt;0) */ }
if (strncmp(line, "GET ", 4) == 0) {}        /* prefix check */
char *at = strchr(email, '@');                 /* a pointer to the first '@', or NULL */
char *hit = strstr(text, "paneer");

char line[] = "milk,2,6000";                   /* strtok_r modifies the string: work on a copy */
char *save, *tok = strtok_r(line, ",", &amp;save);
while (tok) { puts(tok); tok = strtok_r(NULL, ",", &amp;save); }</code></pre>
<h3>Parsing numbers properly</h3>
<pre data-lang="c"><code class="language-c">#include &lt;errno.h&gt;
int parse_long(const char *s, long *out) {
    char *end; errno = 0;
    long v = strtol(s, &amp;end, 10);
    if (end == s || *end != '\\0' || errno == ERANGE) return -1;   /* no digits, trailing junk, overflow */
    *out = v; return 0;
}   /* atoi("12x") silently returns 12 and can't report errors: don't use it */</code></pre>
<h3>A growable string builder</h3>
<pre data-lang="c"><code class="language-c">typedef struct { char *data; size_t len, cap; } Str;
int str_append(Str *s, const char *t) {
    size_t n = strlen(t);
    if (s-&gt;len + n + 1 &gt; s-&gt;cap) {
        size_t cap = s-&gt;cap ? s-&gt;cap * 2 : 32;
        while (cap &lt; s-&gt;len + n + 1) cap *= 2;
        char *p = realloc(s-&gt;data, cap); if (!p) return -1;
        s-&gt;data = p; s-&gt;cap = cap;
    }
    memcpy(s-&gt;data + s-&gt;len, t, n + 1);      /* copies the NUL too */
    s-&gt;len += n; return 0;
}</code></pre>
<p>Unicode: C strings are just bytes, so UTF-8 passes through unchanged, but <code>strlen</code> counts bytes and indexing can split a character. Use a library (ICU, utf8proc) for real text processing.</p>
<div class="exercises"><h3>Practice</h3>
<details class="ex"><summary>0.1 <span class="levels">basic</span> Write <code>char *join(const char **parts, size_t n, const char *sep)</code> that returns a newly allocated string, by computing the total length first and then using <code>memcpy</code>. Test it under ASan, including n = 0.</summary><div><p>Pass 1: <code>total = sum(strlen(parts[i])) + (n ? (n-1) * strlen(sep) : 0) + 1</code>. malloc it, then copy with memcpy while advancing a write pointer, and NUL-terminate. For n = 0, return an empty allocated string "" (the caller still frees it).</p></div></details>
</div>
`;export{n as default};
