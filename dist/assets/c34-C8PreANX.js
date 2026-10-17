const e=`<p class="goal">The "everything is an object" model, and the idioms that separate fluent from functional.</p>
<h3>Mental model</h3>
<ul>
<li><b>Everything is an object</b> on the heap (ints, functions, classes, modules). Variables are names bound to objects (<a class="xref" data-old="c02">chapter 2</a>). <code>id(x)</code> is the identity, <code>type(x)</code> the class.</li>
<li><b>Mutable:</b> list, dict, set, most objects. <b>Immutable:</b> int, float, str, tuple, frozenset, bytes.</li>
<li>CPython compiles to bytecode and interprets it; memory is managed by reference counting plus a cycle collector; the GIL applies (<a class="xref" data-old="c20">chapter 20</a>).</li>
<li><b>Data model / dunder methods:</b> <code>len(x)</code> calls <code>x.__len__()</code>, <code>for</code> calls <code>__iter__</code>, <code>a + b</code> calls <code>__add__</code>, <code>with</code> calls <code>__enter__</code>/<code>__exit__</code>. Implement them and your objects feel built-in.</li>
</ul>
<h3>Idioms you must know</h3>
<pre data-lang="python"><code class="language-python">for i, x in enumerate(xs): ...                  # not range(len(xs))
for a, b in zip(xs, ys): ...
squares = {x: x * x for x in range(5)}           # comprehensions
any(x &lt; 0 for x in xs); all(...)
first, *rest = items
d.get(k, default); d.setdefault(k, []).append(v)
from collections import Counter, defaultdict, deque, namedtuple
from itertools import groupby, chain, islice, product, pairwise
from pathlib import Path
with open(p, encoding="utf-8") as f: ...          # context managers for every resource
if (n := len(data)) &gt; 10: ...                    # walrus: assign inside an expression
value = x if cond else y
sorted(people, key=lambda p: (p.age, p.name))
"".join(parts)                                   # not += in a loop
raise ValueError("…") from err                   # chain exceptions</code></pre>
<h3>Typed Python (do this for anything over ~200 lines)</h3>
<pre data-lang="python"><code class="language-python">from dataclasses import dataclass
from typing import Protocol, Literal

Status = Literal["placed", "paid", "shipped"]

@dataclass(frozen=True, slots=True)
class Order:
    id: int
    items: tuple[str, ...]
    status: Status = "placed"

class Notifier(Protocol):                      # structural interface (like Go/TS)
    def send(self, to: str, msg: str) -&gt; None: ...

def notify(n: Notifier, o: Order) -&gt; None:
    n.send("owner", f"order {o.id} is {o.status}")
# check with: uvx pyright   or   uvx mypy --strict .</code></pre>
<h3>Traps</h3>
<ul>
<li>Mutable default arguments (<a class="xref" data-old="c05">chapter 5</a>); late-binding closures (<a class="xref" data-old="c14">chapter 14</a>).</li>
<li><code>is</code> vs <code>==</code>; <code>[[0]*3]*3</code> aliasing; shallow copies (<a class="xref" data-old="c10">chapter 10</a>).</li>
<li>Blocking calls inside <code>async</code> code; the GIL for CPU-bound threads.</li>
<li>Circular imports; running a module as a script (<code>python -m pkg.mod</code> vs <code>python pkg/mod.py</code>).</li>
<li>Installing packages globally. Always use a venv, and prefer <b>uv</b> (<code>uv init</code>, <code>uv add httpx</code>, <code>uv run app.py</code>): it's fast and handles venvs and lockfiles for you.</li>
</ul>
<h3>Clear-up path</h3>
<ol>
<li>Re-do Part I exercises in plain Python without AI.</li>
<li>Read "Fluent Python" (Ramalho), especially the chapters on the data model, functions, and iterators/generators.</li>
<li>Type an existing script fully and make <code>pyright --strict</code> pass.</li>
<li>Build: a CLI with <code>argparse</code> + tests + a <code>pyproject.toml</code>; a FastAPI service with SQLite; an asyncio downloader with a semaphore.</li>
</ol>
<div class="exercises"><h3>Practice</h3>
<details class="ex"><summary>28.1 <span class="levels">basic</span> Rewrite a 20-line script of yours with full type hints and make <code>uvx pyright --strict</code> pass.</summary><div><p>Typical fixes: annotate function signatures, replace <code>dict</code> with a <code>TypedDict</code> or dataclass, handle <code>None</code> from <code>.get()</code>, and add return types. Each error pyright reports is a potential runtime bug.</p></div></details>
</div>
`;export{e as default};
