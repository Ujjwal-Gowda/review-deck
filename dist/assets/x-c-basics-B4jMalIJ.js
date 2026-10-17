const e=`<p class="goal">C's types, operators and control flow: small and close to the hardware, with sharp edges you need to know.</p>
<h3>A complete small program</h3>
<pre data-lang="c"><code class="language-c">#include &lt;stdio.h&gt;
#include &lt;stdlib.h&gt;

#define TAX_PERCENT 5

int main(int argc, char *argv[]) {
    if (argc &lt; 2) {
        fprintf(stderr, "usage: %s AMOUNT_PAISE\\n", argv[0]);
        return 2;
    }
    char *end;
    long paise = strtol(argv[1], &amp;end, 10);
    if (*end != '\\0' || paise &lt; 0) {
        fprintf(stderr, "invalid amount: %s\\n", argv[1]);
        return 1;
    }
    long total = paise * (100 + TAX_PERCENT) / 100;
    printf("total: %ld.%02ld\\n", total / 100, total % 100);
    return 0;
}
/* gcc -std=c17 -Wall -Wextra -o bill bill.c &amp;&amp; ./bill 10000 */</code></pre>
<h3>Types and sizes</h3>
<table>
<tr><th>Type</th><th>Typical size (x86-64 Linux)</th><th>Notes</th></tr>
<tr><td><code>char</code></td><td>1 byte</td><td>may be signed or unsigned depending on the platform</td></tr>
<tr><td><code>int</code></td><td>4 bytes</td><td>the standard only guarantees ≥ 16 bits</td></tr>
<tr><td><code>long</code> / <code>long long</code></td><td>8 / 8</td><td><code>long</code> is 4 bytes on Windows</td></tr>
<tr><td><code>float</code> / <code>double</code></td><td>4 / 8</td><td>prefer double</td></tr>
<tr><td><code>size_t</code></td><td>8</td><td>unsigned, for sizes and indexes (<code>%zu</code>)</td></tr>
<tr><td><code>int32_t</code>, <code>uint8_t</code>… (<code>&lt;stdint.h&gt;</code>)</td><td>exact</td><td>use them when the size matters (files, protocols)</td></tr>
</table>
<h3>Operators and conversions: the traps</h3>
<pre data-lang="c"><code class="language-c">7 / 2        // 3: integer division          7 / 2.0 → 3.5
-7 / 2       // -3: truncates toward zero     -7 % 2 → -1
int x = 2147483647; x + 1;           // SIGNED OVERFLOW = undefined behaviour
unsigned u = 0; u - 1;               // wraps to 4294967295 (defined)
if (-1 &lt; 1u) …                       // FALSE: -1 converts to a huge unsigned. Don't mix signed and unsigned
if (x = 5) …                         // assignment, not comparison: -Wall warns
x &amp; 1 == 0                           // == binds tighter than &amp;: use (x &amp; 1) == 0</code></pre>
<h3>Control flow</h3>
<pre data-lang="c"><code class="language-c">switch (status) {
case PLACED:  puts("placed"); break;
case PAID:                           /* deliberate fall-through: comment it */
case SHIPPED: puts("in progress"); break;
default:      puts("unknown");
}
for (size_t i = 0; i &lt; n; i++) { if (a[i] &lt; 0) continue; if (a[i] &gt; limit) break; }</code></pre>
<p>Always initialise variables (locals start as garbage), and compile with <code>-Wall -Wextra</code>: the warnings catch most of the traps above.</p>
<div class="exercises"><h3>Practice</h3>
<details class="ex"><summary>0.1 <span class="levels">basic</span> Write a C program that reads integers (one per line) from stdin with <code>fgets</code> + <code>strtol</code>, rejects bad lines with their line numbers, and prints the count, sum, min, max and average. Compile it with <code>-Wall -Wextra -fsanitize=address,undefined</code>.</summary><div><p>Loop <code>while (fgets(buf, sizeof buf, stdin))</code>. Use <code>errno = 0; long v = strtol(buf, &amp;end, 10);</code> and check <code>end != buf</code>, that only whitespace follows, and that <code>errno != ERANGE</code>. Keep the sum in a <code>long long</code>, and print the average as <code>(double)sum / count</code>.</p></div></details>
</div>
`;export{e as default};
