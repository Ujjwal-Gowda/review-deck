const e=`<p class="goal">Master decisions, advanced loops, and robust function design in Python, including pattern matching, argument bindings, the mutable default gotcha, and closure mechanics.</p>

<p>Control flow and functions are the neural pathways of a Python program. Writing clean Python means moving away from low-level patterns (like manual loop indexing) and adopting expressive features like structural pattern matching, ZIP generators, and precise function argument constraints.</p>

<h3>1. Conditionals & Structural Pattern Matching</h3>
<p>Python's traditional conditionals (<code>if-elif-else</code>) are straightforward. However, Python 3.10 introduced a revolutionary control flow mechanism: <b>Structural Pattern Matching</b> (<code>match-case</code>). Rather than acting as a simple "switch" statement, pattern matching extracts and binds data directly based on the shape of collections and dictionary models.</p>

<pre data-lang="python"><code class="language-python"># 1. Traditional Conditional (Using early returns to reduce nesting)
def calculate_shipping_fee(total_paise: int, zone: str) -> int:
    if total_paise >= 499_00:  # Rs. 499.00
        return 0
    if zone == "central":
        return 20_00           # Rs. 20.00
    return 35_00               # Rs. 35.00 (Default shipping)


# 2. Advanced Structural Pattern Matching (match-case)
def process_webhook_event(event: dict | list) -> None:
    match event:
        # Matches a dict with "type": "order", extracts the "id" value as an integer
        case {"type": "order", "id": int(oid)}:
            print(f"Processing order with ID: {oid}")
            
        # Matches a dict with an inline condition (guard clause)
        case {"type": "refund", "amount": amt} if amt > 1000_00:
            print(f"Refund request of {amt/100:.2f} Rs. sent for manager approval.")
            
        # Matches a list/tuple structure containing a single command string
        case ["ping"] | ["health"]:
            print("System responds: PONG")
            
        # Wildcard match (default fallback): matches anything
        case _:
            print("Unknown, unhandled event shape received.")
</code></pre>

<h3>2. Pythonic Looping Idioms & The "For-Else" Trap</h3>
<p>In Python, we rarely use indices to loop over sequences. Manual indices (like <code>for i in range(len(items)):</code>) are considered unidiomatic because they are verbose and prone to off-by-one errors. Instead, we use generators and zip sequences directly.</p>

<ul>
  <li><b><code>enumerate(iterable, start=0)</code>:</b> Generates a stream of tuples containing the current index and the element itself.</li>
  <li><b><code>zip(*iterables, strict=False)</code>:</b> Loops over multiple sequences in parallel, yielding tuples of their aligned elements. If sequences are of unequal length, it stops at the shortest one. Setting <code>strict=True</code> (introduced in Python 3.10) raises a <code>ValueError</code> if any sequence ends early, preventing silent data truncation.</li>
  <li><b>The Loop <code>else</code> Clause:</b> A common source of confusion. The <code>else</code> block attached to a loop executes **only if the loop finishes normally without hitting a <code>break</code> statement**. A better mental name for this block is "no-break".</li>
</ul>

<pre data-lang="python"><code class="language-python">names = ["Alice", "Bob", "Charlie"]
scores = [85, 92, 78, 100]  # scores list is longer than names

# 1. Enumerate: Index + Value
for rank, name in enumerate(names, start=1):
    print(f"Rank {rank}: {name}")

# 2. Parallel Iteration with Zip
for name, score in zip(names, scores, strict=True):
    print(f"{name} scored {score}")  # strict=True would raise ValueError here since lengths differ.
    # Without strict=True, Charlie is paired with 78, and the score 100 is silently ignored.

# 3. The For-Else Block ("No-break" block)
# Let's check if all items are in stock:
stock_inventory = {"milk": 10, "eggs": 5, "bread": 0}
items_to_buy = ["milk", "eggs"]

for item in items_to_buy:
    if stock_inventory.get(item, 0) <= 0:
        print(f"Item '{item}' is out of stock! Aborting.")
        break
else:
    # This runs ONLY if the loop completed with NO break statements encountered!
    print("Success! All requested items are in stock.")
</code></pre>

<h3>3. Function Parameters & The Mutable Default Argument Gotcha</h3>
<p>Python offers incredibly rich function signatures. You can define positional-only parameters, keyword-only parameters, and variable-length arguments.</p>

<div class="diagram">
  [ Function Signature Constraints ]
  def f(pos_only, /, standard, *, kw_only):
                  │              │
                  ▼              ▼
         Prevents passing    Forces passing as
         via keyword keys    explicit keywords
</div>

<pre data-lang="python"><code class="language-python"># Position-only (before /) and Keyword-only (after *)
def render_box(width: int, height: int, /, *, symbol: str = "#") -> str:
    # width and height must be passed positionally: render_box(10, 5)
    # symbol must be passed by keyword explicitly: render_box(10, 5, symbol="*")
    return ((symbol * width) + "\\n") * height

# render_box(width=10, height=5) # TypeError!

# Variable-length positional (*args) and keyword (**kwargs) parameters
def build_profile(user_id: int, *tags: str, **attributes: str) -> dict:
    # *tags captures extra positionals as a tuple
    # **attributes captures extra keywords as a dictionary
    return {
        "id": user_id,
        "tags": tags,
        "details": attributes
    }

profile = build_profile(42, "premium", "developer", country="India", role="Lead")
# profile is: {'id': 42, 'tags': ('premium', 'developer'), 'details': {'country': 'India', 'role': 'Lead'}}
</code></pre>

<div class="callout warn">
  <b class="t">The Mutable Default Argument Pitfall</b>
  <p>In Python, default arguments are **evaluated only once**, when the function is defined, not on every function call. If you use a mutable object (like a list or a dictionary) as a default parameter, that single object is shared among all subsequent calls!</p>
</div>

<pre data-lang="python"><code class="language-python"># BROKEN: Shared state bug
def add_to_cart(item: str, cart=[]) -> list:
    cart.append(item)
    return cart

print(add_to_cart("apples"))  # Output: ['apples']
print(add_to_cart("bananas")) # Output: ['apples', 'bananas'] -- Wait, bananas shouldn't have apples!

# CORRECT: Use None as default and instantiate inside
def add_to_cart_safe(item: str, cart: list | None = None) -> list:
    if cart is None:
        cart = []  # Fresh list initialized on every call
    cart.append(item)
    return cart
</code></pre>

<h3>4. Scope & Closures: The LEGB Rule</h3>
<p>Python resolves names using the **LEGB rule**:
<ol>
  <li><b>L (Local):</b> Inside the active function.</li>
  <li><b>E (Enclosing):</b> Inside any outer enclosing functions (closures).</li>
  <li><b>G (Global):</b> Declared at the top level of the module/file.</li>
  <li><b>B (Built-in):</b> Pre-loaded Python names (like <code>int</code>, <code>ValueError</code>, <code>print</code>).</li>
</ol>
If you want to reassign a variable belonging to the enclosing scope, you must use the <code>nonlocal</code> keyword. For global variables, use the <code>global</code> keyword (though modifying globals is generally discouraged).</p>

<pre data-lang="python"><code class="language-python"># Closure: Enclosing state retention
def create_multiplier(multiplier: int):
    # This outer scope variable is captured
    def multiply(value: int) -> int:
        return value * multiplier  # 'multiplier' is read from enclosing scope
    return multiply

double = create_multiplier(2)
print(double(15))  # Output: 30

# Using nonlocal to modify enclosing scope state safely
def make_counter():
    count = 0
    def incr() -> int:
        nonlocal count  # Declares that we want to mutate count in enclosing scope
        count += 1
        return count
    return incr

counter = make_counter()
print(counter())  # 1
print(counter())  # 2
</code></pre>

<h3>5. Practical Advice</h3>
<ul>
  <li><b>Keyword-Only Flags:</b> Always use keyword-only parameters (placed after a bare <code>*</code> in signatures) for boolean flags. This forces call sites to write readable calls: <code>export_data(data, compress=True)</code> instead of the unreadable <code>export_data(data, True)</code>.</li>
  <li><b>Prefer Early Returns:</b> Avoid deep nestings of <code>if</code> blocks. Write guard clauses that return early or raise exceptions, keeping the main happy path flat.</li>
</ul>

<div class="exercises">
  <h3>Practice</h3>
  <details class="ex">
    <summary>0.1 <span class="levels">basic</span> Create a decorator-like function <code>retry(fn, attempts=3, delay=0.5)</code> in Python. It should attempt to execute the function <code>fn</code>. If <code>fn</code> raises an exception, it should catch the exception, wait for <code>delay</code> seconds, double the delay (exponential backoff), and attempt it again. If it fails after all attempts, it should raise the last exception encountered. Prove it works using a function that fails twice before succeeding.</summary>
    <div>
      <p><b>Solution Strategy:</b> We use a <code>for</code> loop to manage the number of attempts. We run a <code>try-except</code> block. If an exception is caught, we check if we have run out of attempts. If so, we raise. Otherwise, we sleep for the active delay, then multiply the delay by 2.</p>
<pre data-lang="python"><code class="language-python">import time

def retry(fn, attempts: int = 3, delay: float = 0.5):
    last_error = None
    for attempt in range(1, attempts + 1):
        try:
            return fn()
        except Exception as e:
            last_error = e
            print(f"Attempt {attempt} failed with error: {e}")
            if attempt == attempts:
                break
            print(f"Retrying in {delay} seconds...")
            time.sleep(delay)
            delay *= 2  # Exponential backoff
    
    if last_error:
        print("All retries exhausted.")
        raise last_error

# Testing our implementation with a stateful function
calls = 0

def flakey_function():
    global calls
    calls += 1
    if calls < 3:
        raise ValueError("Database connection timed out!")
    return "Data fetched successfully!"

if __name__ == "__main__":
    result = retry(flakey_function, attempts=4, delay=0.1)
    print("Final Result:", result)
    # Expected output:
    # Attempt 1 failed with error: Database connection timed out!
    # Retrying in 0.1 seconds...
    # Attempt 2 failed with error: Database connection timed out!
    # Retrying in 0.2 seconds...
    # Final Result: Data fetched successfully!
</code></pre>
    </div>
  </details>
</div>
`;export{e as default};
