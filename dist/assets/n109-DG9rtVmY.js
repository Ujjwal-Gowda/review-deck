const e=`<p class="goal">Letting the computer invent test cases: you state the rules, and it hunts for counterexamples.</p>
<pre data-lang="python"><code class="language-python">from hypothesis import given, strategies as st
@given(st.lists(st.integers()))
def test_sort_properties(xs):
    out = my_sort(xs)
    assert len(out) == len(xs)                          # same size
    assert all(a &lt;= b for a, b in zip(out, out[1:]))    # ordered
    assert sorted(out) == sorted(xs)                    # same elements (a permutation)

@given(st.text())
def test_rle_roundtrip(s):
    assert rle_decode(rle_encode(s)) == s               # round-trip property</code></pre>
<pre data-lang="typescript"><code class="language-typescript">import fc from "fast-check";
fc.assert(fc.property(fc.integer({ min: 0 }), fc.integer({ min: 0, max: 100 }), (price, pct) =&gt;
  applyDiscount(price, pct) &lt;= price));                   // discount never increases the price</code></pre>
<p>When a property fails, the tool <b>shrinks</b> the input to a minimal counterexample, e.g. <code>s = "1"</code> breaks your RLE because digits in the input collide with the counts. That's a bug you'd never have written an example test for.</p>
<h3>Properties that come up again and again</h3>
<ul>
<li><b>Round-trip:</b> decode(encode(x)) == x (serialisers, parsers, encryption).</li>
<li><b>Invariants:</b> the output is sorted; stock is never negative; money is conserved across a transfer.</li>
<li><b>Oracle:</b> the fast implementation equals the slow, obviously correct one.</li>
<li><b>Idempotence:</b> f(f(x)) == f(x) (normalise, dedupe, format).</li>
<li><b>Commutativity:</b> applying events in either order gives the same state.</li>
</ul>
<div class="exercises"><h3>Practice</h3>
<details class="ex"><summary>109.1 <span class="levels">basic</span> Write a property test that <code>json.loads(json.dumps(x)) == x</code> for nested dicts of strings, ints and lists. Does it hold for floats?</summary><div><p>For floats it fails on NaN (NaN ≠ NaN) and infinity (not valid JSON), and hypothesis will find these. Exclude them or handle them explicitly.</p></div></details>
</div>
`;export{e as default};
