const e=`<p class="goal">Learn C to understand what every other language does for you, and what it costs.</p>
<h3>Mental model</h3>
<ul>
<li>"Portable assembly": C maps almost directly to CPU operations and raw memory. What you write is roughly what runs.</li>
<li>No classes, no generics, no strings, no bounds checks, no GC, no exceptions. You get <b>bytes, pointers, structs and functions</b>.</li>
<li>Every language you use either is written in C or C++ (CPython, V8, the Linux kernel) or talks to C libraries through the <b>C ABI</b>. C is the lingua franca of systems.</li>
<li><b>Undefined behaviour (UB):</b> out-of-bounds access, signed overflow, use-after-free, reading uninitialised memory. The compiler may assume these never happen, and "optimise" your program into something unexpected. It's the defining danger of C.</li>
</ul>
<pre data-lang="c"><code class="language-c">#include &lt;stdio.h&gt;
#include &lt;stdlib.h&gt;
#include &lt;string.h&gt;

typedef struct {
    char sku[16];
    int qty;
    long price_paise;
} Item;

/* a growable array: this is what Python lists / Go slices / Rust Vec do for you */
typedef struct {
    Item *data;
    size_t len, cap;
} ItemVec;

int push(ItemVec *v, Item it) {
    if (v-&gt;len == v-&gt;cap) {                                   /* full: grow ×2 */
        size_t ncap = v-&gt;cap ? v-&gt;cap * 2 : 4;
        Item *p = realloc(v-&gt;data, ncap * sizeof *p);
        if (!p) return -1;                                      /* always check allocation */
        v-&gt;data = p; v-&gt;cap = ncap;
    }
    v-&gt;data[v-&gt;len++] = it;                                     /* struct copy (value semantics) */
    return 0;
}

long total(const ItemVec *v) {                                   /* const pointer: read-only borrow */
    long t = 0;
    for (size_t i = 0; i &lt; v-&gt;len; i++) t += v-&gt;data[i].qty * v-&gt;data[i].price_paise;
    return t;
}

int main(void) {
    ItemVec v = {0};
    Item milk = { .qty = 2, .price_paise = 6000 };
    snprintf(milk.sku, sizeof milk.sku, "%s", "milk");          /* bounded copy, never strcpy */
    if (push(&amp;v, milk) != 0) { perror("push"); return 1; }
    printf("total: %ld.%02ld\\n", total(&amp;v) / 100, total(&amp;v) % 100);
    free(v.data);                                               /* you allocated it, you free it */
    return 0;
}
/* build with warnings and sanitizers while learning:
   gcc -std=c17 -Wall -Wextra -g -fsanitize=address,undefined shop.c -o shop */</code></pre>
<h3>What C teaches you</h3>
<ul>
<li>Pointers and pointer arithmetic (<code>p + 1</code> advances by <code>sizeof *p</code>); arrays "decay" into pointers when passed to functions (so the size is lost).</li>
<li>Stack vs heap made explicit (<code>malloc</code>/<code>free</code>); how dynamic arrays, strings (<code>\\0</code>-terminated) and hash tables are really built.</li>
<li>Struct layout, padding and alignment (<code>sizeof</code> surprises); endianness.</li>
<li>The compile → object file → link pipeline; headers vs implementation; <code>make</code>.</li>
<li>System calls directly: <code>open</code>, <code>read</code>, <code>fork</code>, <code>socket</code>.</li>
</ul>
<h3>Tools</h3>
<p>Always compile with <code>-Wall -Wextra</code>. While learning, use <code>-fsanitize=address,undefined</code> (AddressSanitizer and UBSan catch most memory bugs instantly). Debug with <code>gdb</code> (<code>break</code>, <code>run</code>, <code>next</code>, <code>step</code>, <code>print</code>, <code>bt</code>), check for leaks with <code>valgrind</code>, and trace system calls with <code>strace</code>.</p>
<h3>Learning path</h3>
<ol>
<li>"The C Programming Language" (Kernighan &amp; Ritchie). It's short, and still the best. Then "Modern C" (Gustedt, free) for current practice.</li>
<li>Build: your own <code>strlen</code>/<code>strcpy</code>/<code>memcpy</code>; a dynamic array and a hash map (<a class="xref" data-old="c12">chapter 12</a>, in C); a <code>cat</code>/<code>wc</code> clone with syscalls; a tiny shell (fork/exec/wait); a TCP echo server with sockets.</li>
<li>Then compare the same programs in Rust, and see exactly which bugs Rust's compiler would have prevented.</li>
</ol>
<div class="exercises"><h3>Practice</h3>
<details class="ex"><summary>32.1 <span class="levels">basic</span> Write a C function <code>char *join(const char *a, const char *b)</code> that returns a newly allocated "a/b". Check it with <code>-fsanitize=address</code>.</summary><div><p><code>size_t n = strlen(a)+strlen(b)+2; char *s = malloc(n); if(!s) return NULL; snprintf(s, n, "%s/%s", a, b); return s;</code> The caller must <code>free()</code> it: note that ownership in the docs.</p></div></details>
</div>
`;export{e as default};
