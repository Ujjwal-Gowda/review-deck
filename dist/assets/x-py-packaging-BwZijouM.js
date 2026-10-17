const e=`<p class="goal">Structuring real Python projects: type hints and checkers, modules and packages, dependency management with uv, and testing with pytest.</p>
<h3>Type hints</h3>
<pre data-lang="python"><code class="language-python">from typing import Literal, TypedDict, Callable, Iterable
Status = Literal["placed", "paid", "shipped"]
class OrderIn(TypedDict): sku: str; qty: int

def total(prices: dict[str, int], items: Iterable[tuple[str, int]]) -&gt; int: ...
def find(orders: list[Order], oid: int) -&gt; Order | None: ...
def apply(fn: Callable[[int], int], x: int) -&gt; int: return fn(x)
def first[T](xs: list[T]) -&gt; T | None: return xs[0] if xs else None   # generics (3.12+)</code></pre>
<p>Hints aren't enforced at runtime. A checker (<code>pyright</code> or <code>mypy</code>) enforces them before running, like a compiler. Start with the default mode on a new project, and move to strict mode.</p>
<h3>Modules and packages</h3>
<pre data-lang="plaintext"><code class="language-plaintext">shop/                         pyproject.toml, uv.lock
  src/shop/__init__.py        makes "shop" a package (it can re-export: from .orders import place_order)
  src/shop/orders.py          import with: from shop.orders import place_order
  src/shop/cli.py             entry point
  tests/test_orders.py</code></pre>
<h3>Dependencies with uv</h3>
<pre data-lang="shell"><code class="language-bash">uv init --package shop            # the src/ layout above
uv add httpx pydantic             # runtime deps → pyproject.toml + uv.lock
uv add --dev pytest ruff pyright  # dev-only deps
uv run pytest                     # runs inside the project's .venv (created automatically)
uv sync                           # recreate the exact environment from uv.lock (CI, new machines)
uv tool install ruff              # global CLI tools, isolated from each other</code></pre>
<pre data-lang="toml"><code class="language-ini">[project]
name = "shop"
version = "0.1.0"
requires-python = "&gt;=3.12"
dependencies = ["httpx&gt;=0.27", "pydantic&gt;=2"]
[project.scripts]
shop = "shop.cli:main"            # after install: a \`shop\` command on PATH</code></pre>
<h3>Testing with pytest</h3>
<pre data-lang="python"><code class="language-python">import pytest
from shop.orders import total, OutOfStock

@pytest.fixture
def prices(): return {"milk": 6000, "curd": 4000}

def test_total(prices):
    assert total(prices, [("milk", 2), ("curd", 1)]) == 16000

@pytest.mark.parametrize("qty", [0, -1])
def test_rejects_bad_qty(prices, qty):
    with pytest.raises(ValueError):
        total(prices, [("milk", qty)])

def test_uses_clock(monkeypatch):                 # swap out dependencies in a test
    monkeypatch.setattr("shop.orders.now", lambda: FIXED_TIME)</code></pre>
<h3>In practice</h3>
<p>A new project: <code>uv init --package</code>, add ruff + pyright + pytest, a CI job running all three, and type hints on every public function. That combination catches most bugs before they run.</p>
<div class="exercises"><h3>Practice</h3>
<details class="ex"><summary>0.1 <span class="levels">basic</span> Turn your bill calculator into a uv package with a <code>bill</code> command, type hints passing pyright, and 5 pytest tests. Install it with <code>uv tool install .</code> and run <code>bill</code> from any folder.</summary><div><p>Use <code>uv init --package bill</code>, move the logic into <code>src/bill/core.py</code> (pure functions) with <code>cli.py</code> for input/output, set <code>[project.scripts] bill = "bill.cli:main"</code>, then run <code>uv run pytest</code>, <code>uvx pyright</code> and <code>uv tool install .</code>.</p></div></details>
</div>
`;export{e as default};
