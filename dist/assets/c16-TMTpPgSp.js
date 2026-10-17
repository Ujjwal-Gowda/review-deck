const e=`<p class="goal">Proving code works now, and keeps working after changes.</p>
<table>
<tr><th>Level</th><th>Tests</th><th>Speed</th><th>How many</th></tr>
<tr><td><b>Unit</b></td><td>one function or class in isolation</td><td>milliseconds</td><td>many</td></tr>
<tr><td><b>Integration</b></td><td>several parts together (code + real DB)</td><td>seconds</td><td>some</td></tr>
<tr><td><b>End-to-end (E2E)</b></td><td>the whole system as a user would use it (browser automation)</td><td>minutes; flaky</td><td>few</td></tr>
</table>
<p>This is the <b>test pyramid</b>: many fast unit tests at the base, a few slow E2E tests at the top.</p>
<pre data-lang="python"><code class="language-python"># test_pricing.py        run: python3 -m pytest -q
import pytest
from pricing import apply_discount

def test_basic():
    assert apply_discount(1000, 10) == 900

@pytest.mark.parametrize("price,pct,expected", [(0, 50, 0), (999, 0, 999), (100, 100, 0)])
def test_edges(price, pct, expected):
    assert apply_discount(price, pct) == expected

def test_rejects_bad_percent():
    with pytest.raises(ValueError):
        apply_discount(100, 150)</code></pre>
<p>Structure each test as <b>Arrange → Act → Assert</b>. Name tests after the behaviour they check (<code>test_rejects_bad_percent</code>).</p>
<h3>What to test: edge cases</h3>
<p>Empty input; one element; duplicates; negatives and zero; very large values; unicode and whitespace; boundaries (exactly at the limit, one either side); invalid types; the error paths. Most bugs live at boundaries.</p>
<h3>Test doubles</h3>
<p>A <b>stub</b> returns canned data. A <b>mock</b> records how it was called so you can assert on it. A <b>fake</b> is a working lightweight version (an in-memory DB). Use them to isolate code from slow or unpredictable things (network, clock, randomness). But over-mocking tests your mocks, not your code; pure functions need no mocks at all (<a class="xref" data-old="c05">chapter 5</a> pays off here).</p>
<h3>Practices</h3>
<ul>
<li><b>TDD</b> (test-driven development): write a failing test (red), make it pass (green), clean up (refactor). It forces you to design the interface first. It's also the best anti-AI-dependence practice there is: you define "correct" yourself.</li>
<li><b>Regression test:</b> for every bug fixed, add a test that would have caught it.</li>
<li><b>Coverage</b> (<code>pytest --cov</code>) shows which lines never ran. 100% coverage doesn't mean correct, but 40% means big blind spots.</li>
<li><b>Property-based testing</b> (<code>hypothesis</code>): state a property ("sorting twice equals sorting once", "decode(encode(x)) == x") and let the tool generate hundreds of inputs to try to break it.</li>
<li><b>CI</b> (continuous integration): tests run automatically on every push (GitHub Actions).</li>
</ul>
<details class="ex"><summary>16.1 <span class="levels">basic</span> Write <code>apply_discount</code> test-first, from the tests above. Watch each one fail before making it pass.</summary><div><pre data-lang="python"><code class="language-python">def apply_discount(price: int, pct: int) -&gt; int:
    if not 0 &lt;= pct &lt;= 100: raise ValueError("pct must be 0..100")
    return price * (100 - pct) // 100</code></pre></div></details>
`;export{e as default};
