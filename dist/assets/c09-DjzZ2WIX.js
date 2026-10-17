const e=`<p class="goal">The skill that separates people who can program from people who can't. This is the one AI erodes fastest.</p>

<h3>The three kinds of errors</h3>
<table>
<tr><th>Kind</th><th>When</th><th>Example</th><th>How you find it</th></tr>
<tr><td><b>Syntax / compile error</b></td><td>before running</td><td>missing bracket, type mismatch in Go/Rust</td><td>the compiler tells you the line</td></tr>
<tr><td><b>Runtime error</b></td><td>while running</td><td><code>KeyError</code>, divide by zero, null dereference</td><td>crash with a traceback</td></tr>
<tr><td><b>Logic error</b></td><td>runs "fine", wrong result</td><td>off-by-one, wrong condition</td><td>tests, and reasoning. The hardest kind.</td></tr>
</table>
<p>A key idea in language design is <b>moving errors earlier</b>: logic errors become runtime errors (assertions), and runtime errors become compile errors (static types, exhaustive <code>match</code>). The earlier an error is caught, the cheaper it is to fix.</p>

<h3>Reading a traceback (really reading it)</h3>
<pre data-lang="text"><code class="language-plaintext">Traceback (most recent call last):
  File "shop.py", line 14, in &lt;module&gt;
    print(checkout(cart))
  File "shop.py", line 9, in checkout
    total += price_of(item)
  File "shop.py", line 4, in price_of
    return PRICES[name]
KeyError: 'paneer'</code></pre>
<ol>
<li><b>Last line first</b>: the exception type and message. <code>KeyError: 'paneer'</code> means a dict lookup for the key 'paneer' failed.</li>
<li><b>The frame just above it</b>: where it happened (line 4, <code>PRICES[name]</code>).</li>
<li><b>Walk up</b>: how you got there. <code>checkout</code> called <code>price_of</code> with an item that has no price.</li>
<li><b>Ask the real question</b>: not "how do I stop the error?" but "<i>why</i> is 'paneer' in the cart without a price, and what <i>should</i> happen?" Silencing an error with a blanket try/except usually just moves the bug somewhere harder to find.</li>
</ol>

<h3>Exceptions</h3>
<p>An exception is a runtime error object that <b>unwinds the call stack</b>, popping frame after frame, until some caller catches it. If nobody catches it, the program crashes with a traceback.</p>
<pre data-lang="python"><code class="language-python">def parse_qty(text: str) -&gt; int:
    try:
        qty = int(text)
    except ValueError:                       # catch SPECIFIC exceptions
        raise ValueError(f"quantity must be a whole number, got {text!r}") from None
    if qty &lt; 0:
        raise ValueError("quantity can't be negative")   # raise your own
    return qty

try:
    f = open("config.json")
except FileNotFoundError:
    config = {}                  # a sensible, deliberate recovery
else:
    config = json.load(f)        # runs only if no exception
finally:
    print("always runs")         # cleanup, success or failure</code></pre>
<div class="callout warn"><b class="t">Anti-patterns</b>
<ul>
<li><code>except:</code> or <code>except Exception: pass</code> swallows <i>every</i> error, including your typos. Catch only what you can actually handle.</li>
<li>Using exceptions for normal control flow in hot loops (they're slow in many languages).</li>
<li>Losing the original cause. Use <code>raise New(...) from err</code> to chain it.</li>
</ul></div>
<p>Not all languages use exceptions. Go returns errors as values (<code>v, err := f(); if err != nil { return err }</code>); Rust uses <code>Result&lt;T, E&gt;</code>; C uses return codes and <code>errno</code>. <a class="xref" data-old="c19">Chapter 19</a> compares them in depth.</p>

<h3>Assertions</h3>
<pre data-lang="python"><code class="language-python">def average(xs):
    assert len(xs) &gt; 0, "average of empty list"   # documents and checks an assumption
    return sum(xs) / len(xs)</code></pre>
<p>Assertions check things that should be <i>impossible</i> if your code is correct (programmer errors). Don't use them to validate user input: Python strips them when run with <code>-O</code>.</p>

<h3>A systematic debugging method</h3>
<p>Debugging is the scientific method applied to code. Don't change things at random.</p>
<ol>
<li><b>Reproduce</b> the bug reliably. Find the smallest input that triggers it.</li>
<li><b>Observe</b>: what exactly happens vs what you expected? Write both down.</li>
<li><b>Hypothesise</b> a specific cause: "I think <code>total</code> is being reset inside the loop."</li>
<li><b>Test the hypothesis</b> with a print, an assert or a breakpoint that could prove it wrong.</li>
<li><b>Narrow down</b> by bisection: check the state halfway through. Correct there? The bug is later. Repeat. (<code>git bisect</code> does this across commits.)</li>
<li><b>Fix the cause</b>, not the symptom. Then add a test so it can never come back.</li>
</ol>

<h3>Tools</h3>
<pre data-lang="python"><code class="language-python">print(f"{i=} {total=} {item=}")    # quick state dumps; remove them afterwards
breakpoint()                         # drops into pdb: the built-in debugger
# pdb commands: n(ext line)  s(tep into)  c(ontinue)  p expr  l(ist)  w(here: the stack)  q(uit)
import logging
logging.basicConfig(level=logging.DEBUG)
logging.debug("cart=%s", cart)       # levels: DEBUG &lt; INFO &lt; WARNING &lt; ERROR &lt; CRITICAL</code></pre>
<p>Learn your editor's graphical debugger (VS Code: F9 sets a breakpoint, F5 runs, then step over/into/out and watch variables). For C, learn <code>gdb</code> and run with <code>-fsanitize=address</code> to catch memory bugs. <b>Rubber-duck debugging</b> means explaining the code line by line, out loud, to an object. It works absurdly often, because explaining forces you to check each assumption you'd otherwise skim over.</p>

<div class="exercises"><h3>Exercises</h3>
<details class="ex"><summary>9.1 <span class="levels">basic</span> This should print the average of positive numbers but prints the wrong value. Find the bug without running it, then verify.
<pre data-lang="python"><code class="language-python">def avg_pos(xs):
    total = count = 0
    for x in xs:
        if x &gt; 0:
            total += x
        count += 1
    return total / count</code></pre></summary><div><p><code>count += 1</code> is outside the <code>if</code>: it counts every number, not only positives. Also: an empty list or all-negative input divides by zero. Decide what should happen (return 0? None? raise?) and handle it deliberately.</p></div></details>
<details class="ex"><summary>9.2 <span class="levels">basic</span> Write <code>safe_int(s, default)</code> that returns the int or the default. Then explain why it's <i>worse</i> than raising in some situations.</summary><div><p><code>try: return int(s)\\nexcept ValueError: return default</code>. It's worse when a bad value really is a bug. Silently substituting 0 for a corrupted price means you sell things for free. Fail loudly on data that must be valid; use defaults only when the default really is correct.</p></div></details>
<details class="ex"><summary>9.3 <span class="levels">think</span> Use <code>breakpoint()</code> to step through <code>hanoi(3)</code> from <a class="xref" data-old="c05">chapter 5</a>. Use <code>w</code> to view the stack at the deepest point.</summary><div><p>You'll see the stack frames pile up exactly like the diagram in <a class="xref" data-old="c05">chapter 5</a>. Doing this a few times makes recursion stop feeling magical.</p></div></details>
</div>
`;export{e as default};
