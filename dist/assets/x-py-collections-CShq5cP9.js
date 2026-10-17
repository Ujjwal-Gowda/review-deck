const e=`<p class="goal">Master Python's core collections (Lists, Tuples, Dicts, Sets), comprehension expressions, memory layout traps, operational time complexity, and advanced container utilities from the <code>collections</code> module.</p>

<p>Choosing the right data structure and container type is the single most important decision in algorithmic efficiency. Python provides highly optimized built-in collections designed for specific access patterns.</p>

<h3>1. Lists: Mutable, Ordered Sequences</h3>
<p>Lists are dynamically sized arrays of object pointers. They support fast item access by index, but inserting or removing items from the <i>front</i> requires shifting all subsequent elements in memory, which takes $O(n)$ time.</p>

<pre data-lang="python"><code class="language-python">cart = ["milk", "curd"]

# 1. Mutating operations
cart.append("paneer")           # O(1) amortized: adds to the end
cart.extend(["ghee", "atta"])   # Appends multiple items efficiently
cart.insert(0, "bread")         # O(n): inserts at index 0 (shifts all elements right)
cart.remove("curd")             # Removes the FIRST occurrence (raises ValueError if absent)
last_item = cart.pop()          # O(1): removes and returns the last item

# 2. Slice Assignment & Reordering
cart[1:3] = ["butter"]          # Replaces a slice range with a new iterable
cart.sort()                     # In-place sorting (mutates original list)
cart.sort(key=str.lower, reverse=True) # Custom key sort (case-insensitive descending)

top_three = sorted(cart)[:3]    # sorted() creates and returns a NEW list (leaving cart untouched)
</code></pre>

<p><b>Slicing Mechanics:</b> Slices follow the syntax <code>xs[start:stop:step]</code>, where <code>stop</code> is exclusive. Negative indices count backward from the end. A step of <code>-1</code> (<code>xs[::-1]</code>) creates a reversed shallow copy of the list.</p>

<h3>2. Tuples: Immutable Records</h3>
<p>Tuples are fixed-size, immutable sequences. Because they cannot change in size after creation, Python can optimize their memory allocation. Tuples are ideal for heterogeneous records (such as coordinates or database rows).</p>

<pre data-lang="python"><code class="language-python"># Tuple unpacking
point = (12.97, 77.59)
latitude, longitude = point

# Star-unpacking (capturing remaining elements)
first, *rest = [1, 2, 3, 4, 5]
# first = 1, rest = [2, 3, 4, 5]

# NamedTuples: Lightweight, immutable, readable object alternatives
from typing import NamedTuple

class StockItem(NamedTuple):
    sku: str
    quantity: number = 0

item = StockItem("milk_pkt", 12)
print(item.quantity)  # 12 (Access by field name, clean and readable!)
# item.quantity = 15 # Error! Tuples are immutable.
</code></pre>

<h3>3. Dictionaries: Insertion-Ordered Key-Value Mappings</h3>
<p>Python dictionaries (<code>dict</code>) are implemented as highly optimized hash tables. Since Python 3.7, dictionaries preserve **insertion order**. Key lookups, insertions, and deletions run in $O(1)$ average time.</p>

<pre data-lang="python"><code class="language-python">stock = {"milk": 12, "curd": 0}

# 1. Insertion and safe retrieval
stock["paneer"] = 5                     # Insert or update
count = stock.get("ghee", 0)            # Returns default value (0) if key is missing (no KeyError)

# 2. Setting default container values
# If "orders" key doesn't exist, initialize it with a new empty list and append
stock.setdefault("orders", []).append(42)

# 3. Dictionary Comprehension (filtering key-value pairs)
active_stock = {k: v for k, v in stock.items() if v > 0}

# 4. Merging dictionaries (Python 3.9+)
base_prices = {"milk": 50, "curd": 40}
updated_prices = base_prices | {"paneer": 120} # Creates a merged copy
</code></pre>

<h3>4. Sets: Unique Elements & Fast Membership Testing</h3>
<p>A set is an unordered collection of unique hashable objects. Sets support mathematical set operations (union, intersection, difference) and offer $O(1)$ time complexity for membership tests (<code>x in set</code>).</p>

<pre data-lang="python"><code class="language-python">yesterday_sales = {"milk", "curd", "bread"}
today_sales = {"milk", "paneer", "butter"}

# Set Operations
both_days = today_sales & yesterday_sales        # Intersection: {'milk'}
new_items = today_sales - yesterday_sales        # Difference: {'paneer', 'butter'}
all_items = today_sales | yesterday_sales        # Union: all combined unique items

# Lightning-fast membership test
is_sold = "milk" in today_sales                  # O(1) hash lookup
</code></pre>

<h3>5. Comprehensions & The Grid Initialization Trap</h3>
<p>Comprehensions provide a concise, readable way to construct lists, dictionaries, and sets. However, you must be careful with nested container initialization.</p>

<pre data-lang="python"><code class="language-python"># 1. List, Dict, and Set Comprehensions
paid_totals = [order.qty * order.price for order in orders if order.status == "paid"]
user_lookup = {user.id: user for user in users}
unique_stores = {order.store for order in orders}

# 2. Generator Expressions (Lazy evaluation)
# Using parentheses instead of brackets creates a generator: computes values on the fly without building a list in memory.
total_revenue = sum(order.total for order in orders)

# 3. THE GRID INITIALIZATION TRAP (Crucial Interview Gotcha!)
# BROKEN: [[0] * 3] * 3 creates THREE REFERENCES to the EXACT SAME inner list!
# Mutating grid[0][0] = 1 would inadvertently change column 0 in EVERY row!
# bad_grid = [[0] * 3] * 3

# CORRECT: Use a comprehension to instantiate distinct inner lists
correct_grid = [[0 for _ in range(3)] for _ in range(3)]
</code></pre>

<h3>6. The <code>collections</code> Module Utilities</h3>
<p>Python's standard <code>collections</code> module contains powerful specialized data structures:</p>

<ul>
  <li><b><code>Counter</code>:</b> A dictionary subclass designed for counting hashable objects. Includes <code>most_common(n)</code>.</li>
  <li><b><code>defaultdict</code>:</b> Automatically initializes missing keys using a provided factory function (e.g., <code>list</code>, <code>int</code>), eliminating manual <code>if key not in dict:</code> checks.</li>
  <li><b><code>deque</code> (Double-ended queue):</b> Optimized for $O(1)$ appends and pops from <i>both</i> ends (unlike lists, which are slow at the front). Useful for queues, BFS graph traversals, and sliding window buffers with a <code>maxlen</code>.</li>
</ul>

<pre data-lang="python"><code class="language-python">from collections import Counter, defaultdict, deque

# 1. Frequency counting in 1 line
words = ["apple", "banana", "apple", "cherry", "banana", "apple"]
word_counts = Counter(words)
print(word_counts.most_common(2)) # [('apple', 3), ('banana', 2)]

# 2. Grouping items cleanly with defaultdict
orders_by_store = defaultdict(list)
# for order in all_orders:
#     orders_by_store[order.store].append(order) # No KeyError if store is new!

# 3. Bounded Deque (Automatic sliding window queue of max length 50)
recent_logs = deque(maxlen=50)
recent_logs.append("Server started")
</code></pre>

<h3>7. Algorithmic Time Complexity Table</h3>
<table>
  <tr>
    <th>Operation</th>
    <th><code>list</code></th>
    <th><code>dict</code> / <code>set</code></th>
    <th><code>deque</code></th>
  </tr>
  <tr>
    <td>Index lookup / update (<code>xs[i]</code>)</td>
    <td>$O(1)$</td>
    <td>$O(1)$ (Keys only)</td>
    <td>$O(n)$</td>
  </tr>
  <tr>
    <td>Membership test (<code>x in c</code>)</td>
    <td>$O(n)$</td>
    <td>$O(1)$ average</td>
    <td>$O(n)$</td>
  </tr>
  <tr>
    <td>Append / Add to end</td>
    <td>$O(1)$ amortized</td>
    <td>$O(1)$ average</td>
    <td>$O(1)$</td>
  </tr>
  <tr>
    <td>Insert / Pop at <b>front</b></td>
    <td>$O(n)$ (Slow!)</td>
    <td>N/A</td>
    <td>$O(1)$ (Fast!)</td>
  </tr>
</table>

<div class="exercises">
  <h3>Practice</h3>
  <details class="ex">
    <summary>0.1 <span class="levels">basic</span> Given a list of order records (represented as dicts with keys: <code>store</code>, <code>sku</code>, <code>qty</code>), write a Python script using standard collections that computes: (1) total quantity per SKU using a <code>Counter</code>, (2) orders grouped by store using a <code>defaultdict</code>, (3) the set of SKUs sold in <i>every</i> store (set intersection), and (4) the top 3 best-selling SKUs.</summary>
    <div>
      <p><b>Solution Strategy:</b> We iterate through the records once to populate our <code>Counter</code> and <code>defaultdict</code>. We use set operations for intersection across all store SKUs, and call <code>.most_common(3)</code> on the counter.</p>
<pre data-lang="python"><code class="language-python">from collections import Counter, defaultdict

# Sample order dataset
orders = [
    {"store": "North", "sku": "milk", "qty": 10},
    {"store": "North", "sku": "bread", "qty": 5},
    {"store": "South", "sku": "milk", "qty": 8},
    {"store": "South", "sku": "paneer", "qty": 3},
    {"store": "East", "sku": "milk", "qty": 12},
    {"store": "East", "sku": "bread", "qty": 7},
    {"store": "East", "sku": "butter", "qty": 4},
]

# 1. Total quantity per SKU using Counter
sku_counter = Counter()
for order in orders:
    sku_counter[order["sku"]] += order["qty"]

print("Total Quantity per SKU:", sku_counter)

# 2. Orders grouped by store using defaultdict
orders_by_store = defaultdict(list)
for order in orders:
    orders_by_store[order["store"]].append(order)

print("\\nOrders in North Store:", orders_by_store["North"])

# 3. SKUs sold in EVERY store (Set Intersection across all stores)
# Extract set of SKUs per store
store_sku_sets = [{order["sku"] for order in store_orders} for store_orders in orders_by_store.values()]
# Use set unpacking and intersection operator (*)
universal_skus = set.intersection(*store_sku_sets)
print("\\nSKUs sold in every store:", universal_skus)

# 4. Top 3 best-selling SKUs
top_three_skus = sku_counter.most_common(3)
print("\\nTop 3 Best-Selling SKUs:", top_three_skus)
</code></pre>
    </div>
  </details>
</div>
`;export{e as default};
