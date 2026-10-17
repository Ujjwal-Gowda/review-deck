const e=`<p class="goal">Master the fundamental mechanics of Python: code layout, the object reference model, numerical representation traps, truthiness, and robust console I/O.</p>

<p>Python is designed to be highly readable, but beneath its clean syntax lies a powerful dynamic object model. Understanding how Python represents values in memory and evaluates expressions is crucial to writing correct, bug-free code.</p>

<h3>1. Syntax Essentials & The Execution Model</h3>
<p>Unlike most programming languages that use curly braces <code>{}</code> or keywords like <code>end</code> to define blocks of code, Python uses <b>whitespace indentation</b>. This design choice forces developers to format code consistently, making it easier to read.</p>

<ul>
  <li><b>Indentation defines scope:</b> A block starts after a colon <code>:</code> and must be indented exactly 4 spaces. Mixing tabs and spaces is a syntax error in Python 3.</li>
  <li><b>One statement per line:</b> Python does not require semicolons. A single logical line is typically one physical line, though you can wrap long expressions inside parentheses <code>()</code>, brackets <code>[]</code>, or braces <code>{}</code> without using backslashes.</li>
  <li><b>Execution Guard:</b> When a Python file is executed directly, its special name variable <code>__name__</code> is set to <code>"__main__"</code>. If the file is imported by another module, <code>__name__</code> is set to the module's file name. Guarding your execution code allows files to be safely imported as modules without running side effects.</li>
</ul>

<pre data-lang="python"><code class="language-python"># Define a global constant. UPPER_CASE signals to other devs not to change this value.
TAX_RATE = 0.05

def calculate_tax(price_in_paise: int) -> int:
    """Calculate the tax on a price.
    
    Using integers (like paise or cents) avoids precision errors.
    """
    # 4-space indentation defines the function body
    calculated = price_in_paise * TAX_RATE
    return round(calculated)

# This guard checks if the script is run directly (e.g., \`python script.py\`)
# If imported elsewhere, this block is skipped entirely.
if __name__ == "__main__":
    test_price = 10000  # Rs. 100.00 represented as paise
    print("Tax for 10000 paise:", calculate_tax(test_price))  # Output: 500
</code></pre>

<h3>2. Memory Model: Names as Labels, Not Boxes</h3>
<p>In languages like C, a variable is a <b>box in memory</b>. Assigning a value copies that value into the box. In Python, variables are <b>labels or references pointing to objects</b> in memory. This distinction is vital when working with mutable objects.</p>

<div class="diagram">
  [ C Model (Value Copy in Memory Box) ]
  int x = 5;  =>  [x: 5]
  int y = x;  =>  [x: 5], [y: 5]  (Copying duplicates the value)

  [ Python Model (Variables as Labels/Pointers) ]
  a = [1, 2]  =>  a ───┐
                       ├───► [ Object: List [1, 2] ]
  b = a       =>  b ───┘
  (Both 'a' and 'b' reference the exact same object in memory!)
</div>

<pre data-lang="python"><code class="language-python"># Case A: Mutable objects (Lists, Dicts, Sets)
a = [1, 2]
b = a          # b points to the SAME list object in memory
b.append(3)    # Mutating b also affects a!
print(a)       # Output: [1, 2, 3]

# To create an independent copy, perform a shallow copy:
c = a[:]       # Or use a.copy()
c.append(4)
print(a)       # Output: [1, 2, 3] (unaffected)
print(c)       # Output: [1, 2, 3, 4]

# Case B: Immutable objects (Integers, Floats, Strings, Tuples)
x = 5
y = x          # y points to the integer object 5
y += 1         # Integers cannot be mutated! This rebinds y to a NEW integer object 6
print(x)       # Output: 5 (x still points to the original object 5)
print(y)       # Output: 6
</code></pre>

<h3>3. Core Data Types</h3>
<p>Every value in Python is an object, and every object has a type. The table below lists the fundamental types:</p>

<table>
  <tr>
    <th>Type</th>
    <th>Examples</th>
    <th>Key Behaviors & Pitfalls</th>
  </tr>
  <tr>
    <td><code>int</code></td>
    <td><code>42</code>, <code>-7</code>, <code>1_000_000</code></td>
    <td><b>Arbitrary precision:</b> Integers can grow as large as system memory allows. They never overflow or wrap around.</td>
  </tr>
  <tr>
    <td><code>float</code></td>
    <td><code>3.14</code>, <code>1e-9</code>, <code>float("inf")</code></td>
    <td>Represented as IEEE 754 double-precision floats. They cannot represent certain decimal values exactly (e.g., <code>0.1 + 0.2 != 0.3</code>).</td>
  </tr>
  <tr>
    <td><code>bool</code></td>
    <td><code>True</code>, <code>False</code></td>
    <td>Booleans are technically subclasses of integers in Python (<code>True == 1</code>, <code>False == 0</code>). This means <code>True + True</code> equals <code>2</code>.</td>
  </tr>
  <tr>
    <td><code>str</code></td>
    <td><code>"hello"</code>, <code>'world'</code></td>
    <td><b>Immutable sequences</b> of Unicode characters. Modifying a string creates a brand-new string.</td>
  </tr>
  <tr>
    <td><code>NoneType</code></td>
    <td><code>None</code></td>
    <td>Represents the absence of a value (similar to <code>null</code> or <code>nil</code>). There is only one <code>None</code> instance, compared using the <code>is</code> operator.</td>
  </tr>
  <tr>
    <td><code>Decimal</code></td>
    <td><code>Decimal("19.99")</code></td>
    <td>Available in the standard <code>decimal</code> module. Used for exact fractional calculations (e.g., handling financial transactions).</td>
  </tr>
</table>

<h3>4. Division Traps & Expression Evaluation</h3>
<p>Python has two division operators with distinct rounding rules:</p>
<ul>
  <li><b>True Division (<code>/</code>):</b> Always returns a float, even if the division is clean (e.g., <code>4 / 2</code> is <code>2.0</code>).</li>
  <li><b>Floor Division (<code>//</code>):</b> Rounds the result <i>down</i> to the nearest integer towards negative infinity (the mathematical floor).</li>
</ul>

<pre data-lang="python"><code class="language-python"># Regular Division vs Floor Division
print(7 / 2)       # 3.5 (float result)
print(7 // 2)      # 3 (integer division, truncated down)

# Negative Division Trap: Rounds towards negative infinity!
print(-7 // 2)     # -4 (Not -3! -3.5 is rounded down to -4)

# Remainder / Modulo (%)
# Sign of result always follows the sign of the divisor:
print(7 % 3)       # 1
print(-7 % 3)      # 2 (since -7 // 3 is -3, -3 * 3 = -9. -7 - (-9) = 2)

# Exponentiation (**)
print(2 ** 10)     # 1024

# Chained Comparisons: Extremely clean and intuitive
age = 25
print(18 <= age < 65)  # True (equivalent to \`18 <= age and age < 65\`)
</code></pre>

<h3>5. Short-Circuit Evaluation & Truthiness</h3>
<p>In Python, the boolean operators <code>and</code> and <code>or</code> do not simply return <code>True</code> or <code>False</code>; they return **one of the evaluated operands**. They evaluate expressions from left to right and stop as soon as the outcome is determined (<b>short-circuiting</b>).</p>

<ul>
  <li><code>x and y</code>: Evaluates <code>x</code>. If <code>x</code> is falsy, returns <code>x</code>. Otherwise, evaluates and returns <code>y</code>.</li>
  <li><code>x or y</code>: Evaluates <code>x</code>. If <code>x</code> is truthy, returns <code>x</code>. Otherwise, evaluates and returns <code>y</code>.</li>
</ul>

<p>Every object in Python has an implicit boolean value (truthiness):</p>
<table>
  <tr>
    <th>Falsy Values (Evaluate to False)</th>
    <th>Truthy Values (Evaluate to True)</th>
  </tr>
  <tr>
    <td><code>False</code>, <code>None</code>, <code>0</code>, <code>0.0</code></td>
    <td>Any non-zero number (e.g., <code>42</code>, <code>-1</code>)</td>
  </tr>
  <tr>
    <td>Empty sequences: <code>""</code>, <code>[]</code>, <code>()</code></td>
    <td>Non-empty strings, lists, tuples (e.g., <code>"False"</code>, <code>[0]</code>)</td>
  </tr>
  <tr>
    <td>Empty mappings: <code>{}</code>, <code>set()</code></td>
    <td>Non-empty dictionaries, sets</td>
  </tr>
</table>

<pre data-lang="python"><code class="language-python"># Idiomatic truthiness checks: Do not check length!
items = []
if not items:
    print("List is empty!")  # This is much cleaner than: \`if len(items) == 0:\`

# Short-circuiting examples
username = ""
display_name = username or "Anonymous User"  # Evaluates to "Anonymous User" since empty string is falsy

def some_risky_operation():
    print("Operation executed!")
    return True

# Since the left operand is False, the right is never executed:
result = False and some_risky_operation()  # Returns False immediately; nothing is printed
</code></pre>

<h3>6. Text and Number Formatting (f-strings)</h3>
<p>Python's formatted string literals (f-strings) are evaluated at runtime and offer an elegant way to format strings with variables, numbers, alignment, and formatting codes.</p>

<pre data-lang="python"><code class="language-python">item = "Laptop"
qty = 3
price = 84999.95

# 1. Aligned columns: width and alignment direction (<, >, ^)
# 'Item' left-aligned 15 spaces, 'Qty' right-aligned 5 spaces, 'Price' right-aligned 12 spaces
print(f"{'Item':<15}{'Qty':>5}{'Price':>12}")
print(f"{item:<15}{qty:>5}{price:>12.2f}")

# 2. Number formatting styles
pi = 3.14159265
ratio = 0.7856
large_num = 1234567890

print(f"Pi with 3 decimal places: {pi:.3f}")           # 3.142
print(f"Percentage with 1 decimal: {ratio:.1%}")        # 78.6%
print(f"Zero-padded integer (8 wide): {42:08d}")        # 00000042
print(f"Comma-separated formatting: {large_num:,}")      # 1,234,567,890
</code></pre>

<h3>7. Practical Advice</h3>
<ul>
  <li>Always use integers (representing the smallest denomination, e.g., paise) or the <code>decimal.Decimal</code> class for monetary math. Never use <code>float</code> for financial calculations.</li>
  <li>When checking if a variable is <code>None</code>, use the identity operator <code>is None</code> or <code>is not None</code>. Do not use <code>== None</code>, because classes can override the equality operator and produce false results.</li>
  <li>Utilize the <code>__main__</code> execution guard in scripts to ensure your code can be imported and tested cleanly without executing script logic on import.</li>
</ul>

<div class="exercises">
  <h3>Practice</h3>
  <details class="ex">
    <summary>0.1 <span class="levels">basic</span> Write a bill calculator: repeatedly read item names, quantities, and prices (in paise) from the console until the user enters an empty item name. Then, print an aligned receipt containing each item's total, a subtotal, a 5% tax line, and the final grand total in rupees.</summary>
    <div>
      <p><b>Solution Strategy:</b> We use a <code>while True:</code> loop to collect inputs. We convert quantities to <code>int</code> and prices to <code>int</code>. To print, we format output using f-strings for columns and subtotal calculation.</p>
<pre data-lang="python"><code class="language-python"># Bill calculator
items = []

while True:
    name = input("Enter item name (or press Enter to finish): ").strip()
    if not name:
        break
    try:
        qty = int(input(f"Enter quantity for {name}: "))
        price_paise = int(input(f"Enter price in paise (e.g. 100 for Re 1.00): "))
        items.append((name, qty, price_paise))
    except ValueError:
        print("Invalid number. Please re-enter the item.")
        continue

print("\\n" + "=" * 32)
print(f"{'Item':<12}{'Qty':>4}{'Price':>6}{'Total':>10}")
print("-" * 32)

subtotal = 0
for name, qty, price in items:
    total = qty * price
    subtotal += total
    print(f"{name:<12}{qty:>4}{price/100:>6.2f}{total/100:>10.2f}")

tax = round(subtotal * 0.05)
grand_total = subtotal + tax

print("-" * 32)
print(f"{'Subtotal:':<22}{subtotal/100:>10.2f}")
print(f"{'Tax (5%):':<22}{tax/100:>10.2f}")
print(f"{'Grand Total (Rs.):':<22}{grand_total/100:>10.2f}")
print("=" * 32)
</code></pre>
    </div>
  </details>
</div>
`;export{e as default};
