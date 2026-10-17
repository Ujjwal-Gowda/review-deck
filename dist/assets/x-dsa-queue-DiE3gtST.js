const e=`<p class="goal">First in, first out, like a queue at a billing counter. Plus the deque (both ends) and the ring buffer (a fixed-size, reusable queue).</p>
<div class="diagram">enqueue →  [ C ][ B ][ A ]  → dequeue          A arrived first, so A leaves first
           back          front</div>
<h3>Why not just a Python list?</h3>
<p><code>list.pop(0)</code> shifts every remaining item left: O(n). A proper queue removes from the front in O(1). There are three ways to build one:</p>
<ol>
<li>A <b>linked list</b> with head and tail pointers (<a class="xref" data-old="x-dsa-linked">Linked Lists</a>).</li>
<li><b>Two stacks</b>: push onto an inbox; when the outbox is empty, pour the inbox into it (amortised O(1)).</li>
<li>A <b>ring buffer</b>: an array with a head index that wraps around. The best choice when there's a maximum size.</li>
</ol>
<h3>Ring buffer, drawn</h3>
<div class="diagram">capacity 5, after enqueue a b c d, dequeue a b, enqueue e f:
index:   0    1    2    3    4
       [ f ][   ][ c ][ d ][ e ]
              ▲    ▲
            tail  head          head = where to dequeue, tail = where to enqueue next,
                                both advance with (i + 1) % capacity, wrapping around</div>
<pre data-lang="python"><code class="language-python">class RingBuffer:
    def __init__(self, capacity):
        self.buf = [None] * capacity
        self.head = self.size = 0
    def enqueue(self, x):
        if self.size == len(self.buf): raise OverflowError("full")   # or overwrite the oldest (log buffers do)
        self.buf[(self.head + self.size) % len(self.buf)] = x
        self.size += 1
    def dequeue(self):
        if self.size == 0: raise IndexError("empty")
        x = self.buf[self.head]; self.buf[self.head] = None
        self.head = (self.head + 1) % len(self.buf); self.size -= 1
        return x</code></pre>
<h3>Deque: a double-ended queue</h3>
<p>Push and pop at <b>both</b> ends in O(1). It covers stacks, queues and sliding windows. Use it rather than rolling your own:</p>
<table>
<tr><th>Language</th><th>Queue / deque</th></tr>
<tr><td>Python</td><td><code>collections.deque</code>: <code>append</code>, <code>appendleft</code>, <code>popleft</code>; <code>deque(maxlen=100)</code> is a ring buffer</td></tr>
<tr><td>TS/JS</td><td>no built-in: arrays' <code>shift()</code> is O(n); use an index-based queue or a library</td></tr>
<tr><td>Go</td><td>a slice with a head index, or <code>container/list</code>; a buffered <b>channel</b> is a concurrent queue</td></tr>
<tr><td>Rust</td><td><code>std::collections::VecDeque</code> (a ring buffer inside)</td></tr>
<tr><td>C</td><td>write the ring buffer above</td></tr>
</table>
<h3>Where queues show up</h3>
<p>Breadth-first search (<a class="xref" data-old="x-dsa-graphs">Graphs</a>), print queues, job queues (<a class="xref" data-old="n90">Queues</a>), network packet buffers, keyboard input buffers, the event loop's task queue, and rate limiters (sliding logs).</p>
<div class="exercises"><h3>Practice</h3>
<details class="ex"><summary>0.1 <span class="levels">basic</span> Implement a queue with two stacks and prove it&#39;s amortised O(1): count the total element moves for 1,000 enqueues followed by 1,000 dequeues.</summary><div><p>Each element is moved at most twice (inbox, then outbox), so 2,000 operations cause at most about 2,000 moves in total: constant per operation on average, even though a single dequeue can move 1,000 elements.</p></div></details>
</div>
`;export{e as default};
