// Interactive learning data: Output Predictor challenges and End-of-Chapter Knowledge Checks.
export interface PredictChallenge {
  code: string;
  lang: string;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

export interface KnowledgeQuiz {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

export const PREDICT_CHALLENGES: Record<string | number, PredictChallenge> = {

  // Ch 350: Text Generation in Apps
  350: {
    lang: "typescript",
    code: `const stream = await openai.chat.completions.create({ stream: true, ... });\nfor await (const chunk of stream) {
  if (chunk.choices[0]?.finish_reason === "length") console.log("TRUNCATED");\n}`,
    question: "When does finish_reason evaluate to 'length'?",
    options: ["When the user message exceeds input context", "When the response hits max_tokens before completing", "When network latency exceeds socket timeout", "When temperature is set to 0.0"],
    correct: 1,
    explanation: "finish_reason is set to 'length' by LLM providers specifically when generation is truncated because max_tokens was reached before the model produced its stop token.",
  },
  // Ch 355: Building an AI Search Bar
  355: {
    lang: "sql",
    code: `SELECT 1.0 / (60 + sem_rank) + 1.0 / (60 + kw_rank) AS rrf_score\nFROM ranked_results ORDER BY rrf_score DESC;`,
    question: "Why does Reciprocal Rank Fusion (RRF) use ordinal ranks instead of raw similarity scores?",
    options: ["Ranks reduce CPU arithmetic time", "Cosine similarities and BM25 scores have incompatible scales and distributions", "SQL cannot add floating point numbers directly", "Vector search does not return floating point scores"],
    correct: 1,
    explanation: "Vector cosine similarity ranges between 0.0 and 1.0, while BM25 keyword scores range from 0 to unbounded positive numbers. RRF converts both into ranks (1, 2, 3...) so they can be combined fairly without heuristic weighting.",
  },
  // Ch 364: Stripe Integration
  364: {
    lang: "typescript",
    code: `const key1 = \`order_\${orderId}_\${Date.now()}\`;\nconst key2 = \`order_\${orderId}_payment\`;\n// Which should you use for Stripe payment idempotency?`,
    question: "Why is key1 an anti-pattern for Stripe idempotency?",
    options: ["Stripe does not allow underscores in idempotency keys", "Date.now() changes on network retry, defeating duplicate charge prevention", "Date.now() overflows 32-bit integer limits", "Stripe requires idempotency keys to be valid email addresses"],
    correct: 1,
    explanation: "If a network disconnects and the client retries 2 seconds later, Date.now() produces a new key. Stripe treats it as a brand-new transaction and double-charges the customer. Keys must be deterministic (like key2).",
  },
  // Ch 367: Webhooks for Payments
  367: {
    lang: "typescript",
    code: `app.use(express.json());\napp.post('/webhook', (req, res) => {
  stripe.webhooks.constructEvent(req.body, req.headers['stripe-signature'], secret);\n});`,
    question: "Why will this webhook handler fail signature verification?",
    options: ["express.json() parses body into an object; Stripe requires the unparsed RAW buffer", "Stripe does not support POST requests", "req.headers cannot read stripe-signature", "Secret keys cannot be passed into constructEvent"],
    correct: 0,
    explanation: "Stripe HMAC signature verification calculates the cryptographic hash over the exact raw byte stream received from the wire. express.json() parses and re-serializes JSON, which modifies whitespace and breaks the signature hash.",
  },
  // Ch 371: Multi-currency and Tax
  371: {
    lang: "typescript",
    code: `await stripe.paymentIntents.create({
  amount: 500,\n  currency: 'jpy'\n});`,
    question: "How much Japanese Yen is the customer charged?",
    options: ["¥5.00", "¥500", "¥50,000", "An error is thrown (invalid currency)"],
    correct: 1,
    explanation: "JPY is a zero-decimal currency. In currencies with no cents (like JPY and KRW), the amount passed to Stripe is in integer units. amount: 500 charges exactly ¥500, not ¥5.00.",
  },
  // Ch 376: SaaS Architecture Patterns
  376: {
    lang: "sql",
    code: `CREATE POLICY tenant_isolation ON documents\nFOR ALL USING (tenant_id = current_setting('app.tenant_id')::uuid);`,
    question: "What security guarantee does PostgreSQL Row-Level Security (RLS) provide here?",
    options: ["Encrypts disk storage using AES-256", "Restricts every SQL query to rows matching current tenant, preventing accidental cross-tenant data leaks", "Enforces foreign key referential integrity", "Prevents SQL injection automatically"],
    correct: 1,
    explanation: "Postgres RLS filters rows at the database engine level. Even if an application developer forgets a 'WHERE tenant_id = ...' clause in their ORM/SQL query, the database will never return rows belonging to another tenant.",
  },

  // Ch 1: What a Computer Actually Is
  1: {
    lang: "bash",
    code: `python3 -c "import sys; sys.stdout.write('A'); sys.stderr.write('B')" > out.txt`,
    question: "What is printed to the terminal console when this command executes?",
    options: ["AB", "A", "B", "Nothing (all output is redirected to out.txt)"],
    correct: 2,
    explanation: "stdout is redirected to out.txt via '>', but stderr (file descriptor 2) remains connected to the terminal screen. Therefore, only 'B' appears on your terminal screen while 'A' goes into out.txt.",
  },
  // Ch 2: Binary, Bytes & Number Representation
  2: {
    lang: "python",
    code: `a = 0.1 + 0.2\nprint(a == 0.3)`,
    question: "What does this snippet print in Python (and JavaScript/C)?",
    options: ["True", "False", "TypeError", "0.3"],
    correct: 1,
    explanation: "IEEE-754 binary floating-point numbers cannot represent 0.1 or 0.2 with exact precision (similar to 1/3 in base 10). 0.1 + 0.2 evaluates to 0.30000000000000004, so equality comparison evaluates to False.",
  },
  // Ch 4: Processes & Programs
  4: {
    lang: "bash",
    code: `true && false || echo "Recovered"`,
    question: "What does this shell expression print?",
    options: ["Nothing", "Recovered", "false", "Error: syntax error"],
    correct: 1,
    explanation: "'true && false' executes 'false' (exit code 1). Since the left side of '||' failed (non-zero exit code), the shell executes the right side of '||', printing 'Recovered'.",
  },
  // Ch 6: Operators & Expressions
  6: {
    lang: "python",
    code: `a = [1, 2, 3]\nb = [1, 2, 3]\nprint(a == b, a is b)`,
    question: "What does Python output for equality vs identity?",
    options: ["True True", "True False", "False False", "False True"],
    correct: 1,
    explanation: "'==' checks value equality (both lists contain identical items, so True). 'is' checks memory identity (they are two separate list objects allocated at different heap addresses, so False).",
  },
  // Ch 7: Control Flow
  7: {
    lang: "python",
    code: `count = 0\nfor i in range(3):\n    for j in range(i):\n        count += 1\nprint(count)`,
    question: "What is the final value of count?",
    options: ["3", "4", "6", "9"],
    correct: 0,
    explanation: "When i=0, range(0) runs 0 times. When i=1, range(1) runs 1 time (j=0). When i=2, range(2) runs 2 times (j=0, 1). Total increments: 0 + 1 + 2 = 3.",
  },
  // Ch 8: Functions
  8: {
    lang: "python",
    code: `def append_item(x, lst=[]):\n    lst.append(x)\n    return lst\n\nprint(append_item(1))\nprint(append_item(2))`,
    question: "What will the two function calls print?",
    options: ["[1] then [2]", "[1] then [1, 2]", "[1] then []", "TypeError"],
    correct: 1,
    explanation: "In Python, default arguments are evaluated once when the function is defined, NOT each time it is called. The mutable list 'lst' is shared across all invocations that don't pass an explicit list argument.",
  },
  // Ch 9: Scope & Closures
  9: {
    lang: "javascript",
    code: `const fns = [];\nfor (var i = 0; i < 3; i++) {
  fns.push(() => i);\n}\nconsole.log(fns.map(f => f()));`,
    question: "What does this JavaScript code output?",
    options: ["[0, 1, 2]", "[3, 3, 3]", "[2, 2, 2]", "undefined"],
    correct: 1,
    explanation: "'var' has function scope rather than block scope. All three arrow functions close over the exact same variable 'i'. By the time the functions run, the loop has completed and 'i' equals 3.",
  },
  // Ch 10: Collections
  10: {
    lang: "python",
    code: `a = [[]] * 3\na[0].append(42)\nprint(a)`,
    question: "What does the list 'a' contain after appending 42 to a[0]?",
    options: ["[[42], [], []]", "[[42], [42], [42]]", "[[42]]", "IndexError"],
    correct: 1,
    explanation: "The '*' operator duplicates references, not objects! All 3 elements of 'a' point to the exact same inner list in memory. Mutating a[0] mutates the single shared list.",
  },
  // Ch 19: Big-O
  19: {
    lang: "python",
    code: `def mystery(n):\n    i = 1\n    count = 0\n    while i < n:\n        i *= 2\n        count += 1\n    return count`,
    question: "What is the asymptotic time complexity of mystery(n)?",
    options: ["O(n)", "O(log n)", "O(n log n)", "O(1)"],
    correct: 1,
    explanation: "Because 'i' doubles on every iteration (1, 2, 4, 8, ...), the number of steps required to reach 'n' is log2(n). Therefore, the time complexity is logarithmic O(log n).",
  },
  // Ch 20: Recursion
  20: {
    lang: "python",
    code: `def f(n):\n    if n <= 1: return n\n    return f(n - 1) + f(n - 2)\nprint(f(4))`,
    question: "What is the returned output of f(4)?",
    options: ["2", "3", "4", "5"],
    correct: 1,
    explanation: "This is Fibonacci: f(0)=0, f(1)=1, f(2)=1, f(3)=2, f(4)=3. Tracing the tree: f(4) = f(3) + f(2) = (f(2) + f(1)) + 1 = (1 + 1) + 1 = 3.",
  },
  // Ch 21: Memory & Pointers
  21: {
    lang: "c",
    code: `int x = 10;\nint *p = &x;\n*p = 20;\nprintf("%d", x);`,
    question: "What does this C code print?",
    options: ["10", "20", "Address of x", "Segmentation fault"],
    correct: 1,
    explanation: "'p' holds the memory address of 'x'. Dereferencing '*p = 20' writes the value 20 directly into the memory location of 'x'. Thus 'x' is now 20.",
  },
  // Ch 99: Rosetta Table & Shared Language Semantics
  99: {
    lang: "python",
    code: `a = [1, 2]\nb = a\nb.append(3)\nprint(len(a))`,
    question: "What does this code print?",
    options: ["2", "3", "Error", "None"],
    correct: 1,
    explanation: "In Python and JavaScript, variables holding objects/lists store references. 'b = a' does not copy the list; both 'a' and 'b' point to the exact same list on the heap. Mutating via 'b' affects 'a'.",
  },
  // Ch 100: Toolchains & Application Startup
  100: {
    lang: "bash",
    code: `$ python3 script.py\n# What is the FIRST step performed by the OS before Python code executes?`,
    question: "What happens at the operating system level when starting an application?",
    options: [
      "The OS parses Python syntax and detects IndentationErrors",
      "The OS executes execve, allocates a virtual address space, and maps the interpreter binary into memory",
      "The OS immediately runs the main() function",
      "The OS compiles Python bytecode into machine instructions",
    ],
    correct: 1,
    explanation: "The OS kernel knows nothing about Python syntax; it creates a process via fork/execve, sets up virtual memory segments (text, data, heap, stack), attaches standard file descriptors (stdin/stdout/stderr), and then hands control to the CPython interpreter entrypoint.",
  },
  // Ch 112: TypeScript Mental Model
  112: {
    lang: "typescript",
    code: `interface Point2D { x: number; y: number; }\nconst p3 = { x: 1, y: 2, z: 3 };\nconst p2: Point2D = p3;\nconsole.log(p2.x + p2.y);`,
    question: "Why does TypeScript allow assigning p3 to p2?",
    options: [
      "Structural typing: p3 has all required fields (x and y) of Point2D with matching types",
      "TypeScript implicitly casts p3 by stripping property z at runtime",
      "The code fails to compile because z is not defined in Point2D",
      "p3 inherits from Point2D using a hidden prototype link",
    ],
    correct: 0,
    explanation: "TypeScript uses a structural type system (duck typing checked at compile-time). Because 'p3' satisfies the shape requirements of Point2D (it has 'x: number' and 'y: number'), the assignment is completely valid.",
  },
  // Ch 121: Python Overview & Mental Model
  121: {
    lang: "python",
    code: `funcs = [lambda: i for i in range(3)]\nprint([f() for f in funcs])`,
    question: "What does this Python code output?",
    options: ["[0, 1, 2]", "[2, 2, 2]", "[3, 3, 3]", "TypeError"],
    correct: 1,
    explanation: "Python closures use late binding: closures look up the variable 'i' in the outer scope when called, not when defined. When the loop finishes, 'i' is 2. Thus all three lambdas return 2.",
  },
  // Ch 131: Go Overview & Mental Model
  131: {
    lang: "go",
    code: `func divide(a, b int) (int, error) {\n    if b == 0 {\n        return 0, errors.New("cannot divide by zero")\n    }\n    return a / b, nil\n}`,
    question: "Why does Go favor multiple return values (T, error) over try/catch exceptions?",
    options: [
      "To make error states an explicit part of the type signature and prevent hidden control flow jumps",
      "Because Go's compiler cannot generate stack unwinding tables",
      "Go does not allow returning pointers",
      "Multiple returns execute 10x faster than conditionals",
    ],
    correct: 0,
    explanation: "Go avoids exceptions because hidden non-local jumps make understanding failure paths difficult. Returning (result, error) forces every caller to explicitly inspect and handle or propagate errors.",
  },
  // Ch 150: JavaScript Runtime & Event Loop
  150: {
    lang: "javascript",
    code: `console.log("A");\nsetTimeout(() => console.log("B"), 0);\nPromise.resolve().then(() => console.log("C"));\nconsole.log("D");`,
    question: "What is the exact execution output in the JavaScript console?",
    options: ["A, B, C, D", "A, D, C, B", "A, C, D, B", "A, D, B, C"],
    correct: 1,
    explanation: "Synchronous code runs first ('A', 'D'). Then the engine drains the microtask queue (Promise callback prints 'C'). Finally, the event loop picks the macrotask timer from the task queue (prints 'B'). Result: A, D, C, B.",
  },
  "c33": {
    lang: "python",
    code: `a = [1, 2]\nb = a\nb.append(3)\nprint(len(a))`,
    question: "What does this code print?",
    options: ["2", "3", "Error", "None"],
    correct: 1,
    explanation: "In Python and JavaScript, variables holding objects/lists store references. 'b = a' does not copy the list; both 'a' and 'b' point to the exact same list on the heap. Mutating via 'b' affects 'a'.",
  },
  "x-lang-toolchains": {
    lang: "bash",
    code: `$ python3 script.py\n# What is the FIRST step performed by the OS before Python code executes?`,
    question: "What happens at the operating system level when starting an application?",
    options: [
      "The OS parses Python syntax and detects IndentationErrors",
      "The OS executes execve, allocates a virtual address space, and maps the interpreter binary into memory",
      "The OS immediately runs the main() function",
      "The OS compiles Python bytecode into machine instructions",
    ],
    correct: 1,
    explanation: "The OS kernel knows nothing about Python syntax; it creates a process via fork/execve, sets up virtual memory segments (text, data, heap, stack), attaches standard file descriptors (stdin/stdout/stderr), and then hands control to the CPython interpreter entrypoint.",
  },
  "c35": {
    lang: "typescript",
    code: `interface Point2D { x: number; y: number; }\nconst p3 = { x: 1, y: 2, z: 3 };\nconst p2: Point2D = p3;\nconsole.log(p2.x + p2.y);`,
    question: "Why does TypeScript allow assigning p3 to p2?",
    options: [
      "Structural typing: p3 has all required fields (x and y) of Point2D with matching types",
      "TypeScript implicitly casts p3 by stripping property z at runtime",
      "The code fails to compile because z is not defined in Point2D",
      "p3 inherits from Point2D using a hidden prototype link",
    ],
    correct: 0,
    explanation: "TypeScript uses a structural type system (duck typing checked at compile-time). Because 'p3' satisfies the shape requirements of Point2D (it has 'x: number' and 'y: number'), the assignment is completely valid.",
  },
  "c34": {
    lang: "python",
    code: `funcs = [lambda: i for i in range(3)]\nprint([f() for f in funcs])`,
    question: "What does this Python code output?",
    options: ["[0, 1, 2]", "[2, 2, 2]", "[3, 3, 3]", "TypeError"],
    correct: 1,
    explanation: "Python closures use late binding: closures look up the variable 'i' in the outer scope when called, not when defined. When the loop finishes, 'i' is 2. Thus all three lambdas return 2.",
  },
  "c36": {
    lang: "go",
    code: `func divide(a, b int) (int, error) {\n    if b == 0 {\n        return 0, errors.New("cannot divide by zero")\n    }\n    return a / b, nil\n}`,
    question: "Why does Go favor multiple return values (T, error) over try/catch exceptions?",
    options: [
      "To make error states an explicit part of the type signature and prevent hidden control flow jumps",
      "Because Go's compiler cannot generate stack unwinding tables",
      "Go does not allow returning pointers",
      "Multiple returns execute 10x faster than conditionals",
    ],
    correct: 0,
    explanation: "Go avoids exceptions because hidden non-local jumps make understanding failure paths difficult. Returning (result, error) forces every caller to explicitly inspect and handle or propagate errors.",
  },
  "n68": {
    lang: "javascript",
    code: `console.log("A");\nsetTimeout(() => console.log("B"), 0);\nPromise.resolve().then(() => console.log("C"));\nconsole.log("D");`,
    question: "What is the exact execution output in the JavaScript console?",
    options: ["A, B, C, D", "A, D, C, B", "A, C, D, B", "A, D, B, C"],
    correct: 1,
    explanation: "Synchronous code runs first ('A', 'D'). Then the engine drains the microtask queue (Promise callback prints 'C'). Finally, the event loop picks the macrotask timer from the task queue (prints 'B'). Result: A, D, C, B.",
  },
};

export const KNOWLEDGE_QUIZZES: Record<string | number, KnowledgeQuiz[]> = {

  // Ch 99: Rosetta Table & Shared Language Semantics
  99: [
    {
      question: "Which statement accurately describes how memory and variables are managed across Python, JavaScript, and Go?",
      options: [
        "Go allocates everything on the heap by default; Python allocates everything on the stack",
        "Python and JavaScript store object variables as heap references; Go favors stack-allocated value types and escapes to heap only when pointers outlive stack frames",
        "JavaScript does not have a garbage collector",
        "Python integers can overflow a 64-bit boundary and wrap around to negative numbers",
      ],
      correct: 1,
      explanation: "Python and JS use heap objects and garbage collection. In Go, variables and structs default to stack allocation with value semantics, only moving to the heap if compiler escape analysis detects a reference escaping the function frame.",
    },
    {
      question: "What is the primary difference in error handling philosophy between Go and Python/TypeScript?",
      options: [
        "Go has no way of detecting runtime failures",
        "Python/TypeScript favor try/catch exception unwinding, while Go treats errors as explicit return values that must be inspected by callers",
        "TypeScript exceptions are validated at compile time",
        "Go automatically restarts functions that fail",
      ],
      correct: 1,
      explanation: "Go intentionally omits try/catch/throw in favor of functions returning (T, error). This forces explicit handling at call sites and prevents unexpected non-local control jumps.",
    },
  ],
  "c33": [
    {
      question: "Which statement accurately describes how memory and variables are managed across Python, JavaScript, and Go?",
      options: [
        "Go allocates everything on the heap by default; Python allocates everything on the stack",
        "Python and JavaScript store object variables as heap references; Go favors stack-allocated value types and escapes to heap only when pointers outlive stack frames",
        "JavaScript does not have a garbage collector",
        "Python integers can overflow a 64-bit boundary and wrap around to negative numbers",
      ],
      correct: 1,
      explanation: "Python and JS use heap objects and garbage collection. In Go, variables and structs default to stack allocation with value semantics, only moving to the heap if compiler escape analysis detects a reference escaping the function frame.",
    },
    {
      question: "What is the primary difference in error handling philosophy between Go and Python/TypeScript?",
      options: [
        "Go has no way of detecting runtime failures",
        "Python/TypeScript favor try/catch exception unwinding, while Go treats errors as explicit return values that must be inspected by callers",
        "TypeScript exceptions are validated at compile time",
        "Go automatically restarts functions that fail",
      ],
      correct: 1,
      explanation: "Go intentionally omits try/catch/throw in favor of functions returning (T, error). This forces explicit handling at call sites and prevents unexpected non-local control jumps.",
    },
  ],

  // Ch 100: Toolchains & Application Startup
  100: [
    {
      question: "What does CPython do between reading source text from disk and executing the evaluation loop?",
      options: [
        "It compiles the code to a native Linux ELF binary",
        "It tokenizes the text, constructs an Abstract Syntax Tree (AST), and compiles the AST into bytecode instructions",
        "It sends the script to a remote V8 JIT engine",
        "It executes string substitution on variable names",
      ],
      correct: 1,
      explanation: "CPython is a bytecode interpreter. It parses source text into an AST, compiles that AST into Python bytecode (code objects), and then runs the bytecode sequentially in ceval.c.",
    },
    {
      question: "Why does a Go binary start in ~1 millisecond while a Node.js process takes ~40-60 milliseconds?",
      options: [
        "Node.js runs in an emulated 32-bit sandbox",
        "Go compiles directly to a native machine executable; Node must start the V8 virtual machine, allocate heap heaps, and initialize the libuv event loop",
        "Go scripts do not use CPU caches",
        "Node.js requires an active internet connection to start",
      ],
      correct: 1,
      explanation: "Go compiles ahead-of-time (AOT) to native CPU instructions. Node.js must initialize the entire V8 JavaScript engine, allocate memory pools, and load libuv before executing user code.",
    },
  ],
  "x-lang-toolchains": [
    {
      question: "What does CPython do between reading source text from disk and executing the evaluation loop?",
      options: [
        "It compiles the code to a native Linux ELF binary",
        "It tokenizes the text, constructs an Abstract Syntax Tree (AST), and compiles the AST into bytecode instructions",
        "It sends the script to a remote V8 JIT engine",
        "It executes string substitution on variable names",
      ],
      correct: 1,
      explanation: "CPython is a bytecode interpreter. It parses source text into an AST, compiles that AST into Python bytecode (code objects), and then runs the bytecode sequentially in ceval.c.",
    },
    {
      question: "Why does a Go binary start in ~1 millisecond while a Node.js process takes ~40-60 milliseconds?",
      options: [
        "Node.js runs in an emulated 32-bit sandbox",
        "Go compiles directly to a native machine executable; Node must start the V8 virtual machine, allocate heap heaps, and initialize the libuv event loop",
        "Go scripts do not use CPU caches",
        "Node.js requires an active internet connection to start",
      ],
      correct: 1,
      explanation: "Go compiles ahead-of-time (AOT) to native CPU instructions. Node.js must initialize the entire V8 JavaScript engine, allocate memory pools, and load libuv before executing user code.",
    },
  ],

  // Ch 349: AI Integration Overview
  349: [
    {
      question: "Which of the following tasks is LEAST suitable for an LLM in a production application?",
      options: [
        "Customer support ticket routing based on sentiment",
        "Validating credit card numbers and calculating shopping cart tax",
        "Generating personalized product recommendation summaries",
        "Extracting invoice line items from messy scanned PDFs",
      ],
      correct: 1,
      explanation: "Validating card numbers (Luhn algorithm) and calculating exact tax are deterministic mathematical calculations. Using an LLM introduces hallucination risk, high latency, and high cost for a job standard code does with 100% precision in 0.001ms.",
    },
    {
      question: "What is Time To First Token (TTFT) and why is it critical in AI web applications?",
      options: [
        "The time it takes to train the model on initial weights",
        "The latency from user submission until the first streamed character renders on screen",
        "The time taken to download the model tokenizer",
        "The lifespan of an API access token",
      ],
      correct: 1,
      explanation: "TTFT measures perceived latency. Users find a 4-second total wait with streaming tokens beginning at 300ms significantly faster and more engaging than waiting 3 seconds for a blank spinner before the entire text appears.",
    },
  ],
  // Ch 364: Stripe Integration
  364: [
    {
      question: "Why should order fulfillment (e.g. shipping goods or granting digital access) happen in webhooks rather than frontend callbacks?",
      options: [
        "Webhooks run faster than browser HTTP calls",
        "Browsers can disconnect, close tabs, or have responses forged by malicious users before client redirect finishes",
        "Stripe does not allow frontend payments",
        "Frontend callbacks cost extra gateway fees",
      ],
      correct: 1,
      explanation: "If a user pays and closes their mobile browser immediately, the frontend callback never executes. Furthermore, malicious users can spoof client JavaScript responses. Webhooks sent server-to-server are cryptographically signed and guaranteed.",
    },
  ],
  // Ch 367: Webhooks for Payments
  367: [
    {
      question: "What is a 'replay attack' against a webhook endpoint, and how do payment gateways defend against it?",
      options: [
        "An attacker spamming 1-star reviews",
        "An attacker capturing a valid webhook payload and re-sending it to trigger duplicate fulfillment",
        "A database transaction rolling back",
        "A DNS spoofing attempt",
      ],
      correct: 1,
      explanation: "Stripe and other gateways include a timestamp header in the signature. The server rejects any request with a timestamp older than 300 seconds (tolerance threshold) even if the HMAC signature itself matches.",
    },
  ],
  // Ch 373: PCI Compliance
  373: [
    {
      question: "What is the primary architectural advantage of using Stripe Elements or hosted fields under PCI DSS?",
      options: [
        "It eliminates payment gateway transaction fees",
        "Cardholder data is entered into an iframe served directly from Stripe, qualifying the merchant for SAQ A (lowest compliance burden)",
        "It allows storing plain card numbers in MySQL database",
        "It automatically bypasses 3D Secure verification",
      ],
      correct: 1,
      explanation: "Under SAQ A, the merchant's servers never touch, transmit, or store primary account numbers (PAN). The fields live in isolated iframes hosted by Stripe, eliminating huge compliance and audit costs.",
    },
  ],
  // Ch 381: Usage Metering and Limits
  381: [
    {
      question: "Why is Redis commonly preferred over PostgreSQL for real-time API rate limiting and token consumption counters?",
      options: [
        "PostgreSQL cannot store numbers",
        "Redis atomic INCR operations execute in sub-millisecond in-memory time without locking database rows",
        "Postgres does not support transactions",
        "Redis is free while PostgreSQL requires paid licenses",
      ],
      correct: 1,
      explanation: "Redis executes single-threaded atomic operations (INCR, EXPIRE) entirely in memory in sub-millisecond latency. Running row locks on a relational database for every single incoming API hit creates catastrophic connection pool exhaustion under load.",
    },
  ],

  // Ch 0: Learning Methodology
  0: [
    {
      question: "Why does relying on AI-generated code cause programming skills to quickly atrophy?",
      options: [
        "AI generates syntactically invalid code that breaks compilers",
        "It bypasses 'desirable difficulty': your brain only encodes knowledge into long-term memory through effortful recall, not passive recognition",
        "AI code is always slower than human-written code",
        "Modern languages prohibit automated tools"
      ],
      correct: 1,
      explanation: "Recognition is easy, but production/recall requires neural pathways formed during the struggle of debugging and problem decomposition. Without effortful retrieval, mental models fade.",
    },
    {
      question: "What does Chapter 0's '20-Minute Rule' prescribe when you get stuck on a coding problem?",
      options: [
        "Ask an AI model to write the solution immediately",
        "Struggle for 20 minutes: print values, draw memory boxes on paper, and consult documentation before looking at the solution",
        "Switch to a completely different programming language for 20 minutes",
        "Take a 20-minute break whenever you encounter any error"
      ],
      correct: 1,
      explanation: "Active effort for 20 minutes (reading tracebacks, drawing memory diagrams, checking official docs) builds real debugging acumen. If you need to view the solution afterwards, you rewrite it from scratch the next day.",
    }
  ],
  // Ch 1: What a Computer Actually Is
  1: [
    {
      question: "What is the primary operational loop of a modern CPU?",
      options: [
        "Compile -> Link -> Package",
        "Fetch instruction -> Decode -> Execute -> Advance Program Counter",
        "Read disk -> Write cache -> Flush memory",
        "Interrupt -> Swap page -> Fork process"
      ],
      correct: 1,
      explanation: "At the hardware level, the CPU repeatedly fetches an instruction from memory at the address indicated by the Program Counter (PC), decodes its opcode, executes the ALU/control operation, and advances the PC.",
    },
    {
      question: "Why is RAM volatile while Solid-State Disks (SSD) are non-volatile?",
      options: [
        "RAM uses rotating magnetic platters while SSDs use laser diodes",
        "RAM stores charge in capacitors/transistors requiring continuous electrical power; SSDs use floating-gate or charge-trap flash cells that retain state without power",
        "RAM is slower than SSDs and requires cooling",
        "Operating systems actively wipe RAM every minute"
      ],
      correct: 1,
      explanation: "RAM relies on electric charge that dissipates almost immediately without power refresh cycles, whereas NAND flash in SSDs traps electrons physically in insulating oxide layers.",
    },
    {
      question: "What happens when an application like Python or Node starts up compared to Go?",
      options: [
        "Go scripts run inside an external browser sandbox",
        "Python and Node boot a virtual machine/interpreter (CPython VM / V8 engine) and parse/compile code at runtime, while Go executes directly as precompiled native machine code with an embedded lightweight runtime",
        "Python compiles directly to machine code in 0.1ms",
        "Node.js runs faster than native Go binaries because it has no memory management",
      ],
      correct: 1,
      explanation: "Go compiles ahead-of-time (AOT) to native machine instructions with an embedded runtime (scheduler and GC). Python loads CPython to compile AST into bytecode and run ceval.c. Node loads V8 to JIT-compile JavaScript on the fly.",
    },
    {
      question: "Which of the following describes the variable & typing model across Python, JS, TS, and Go?",
      options: [
        "Python variables are fixed memory addresses; Go variables are dynamic pointers",
        "In Python and JS, types belong to values (objects on the heap); TypeScript adds compile-time types that are erased before runtime; Go has static types checked at compile-time with guaranteed zero values",
        "TypeScript types exist at runtime and validate incoming JSON payloads automatically",
        "Go allows uninitialized variables with undefined garbage values like C",
      ],
      correct: 1,
      explanation: "Python and JS are dynamically typed (values have types; variables are references). TypeScript's type annotations are erased at build time. Go enforces static types at compile time and initializes all variables to safe zero values (0, '', false, nil).",
    },
  ],
  // Ch 2: Binary & Numbers
  2: [
    {
      question: "How does two's complement represent negative integers in binary?",
      options: [
        "By setting the last bit to 0",
        "By inverting all bits (one's complement) and adding 1",
        "By dividing the magnitude by 2",
        "By storing a minus sign character before the number"
      ],
      correct: 1,
      explanation: "Two's complement inverts all bits (NOT) and adds 1. This ingenious representation ensures addition and subtraction hardware are identical, and eliminates the negative-zero anomaly.",
    }
  ],
  // Ch 19: Big-O
  19: [
    {
      question: "What is the difference between Big-O and Big-Theta (Θ) notation?",
      options: [
        "Big-O is for space complexity, Big-Theta is for time complexity",
        "Big-O denotes an asymptotic upper bound (worst-case ceiling), while Big-Theta denotes an asymptotically tight bound (both upper and lower bound)",
        "Big-O only applies to loops with recursion",
        "There is no mathematical difference"
      ],
      correct: 1,
      explanation: "Big-O provides an asymptotic upper bound (f(n) <= c * g(n)). Big-Theta (Θ) means the function is bounded both from above and below within constant factors, describing the exact growth rate.",
    }
  ]
};