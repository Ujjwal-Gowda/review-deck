// [term, meaning, old chapter key → resolved to the new chapter at runtime]
export const GLOSSARY: [string, string, string][] = [
[
"ABI",
"Binary-level calling convention letting compiled code from different compilers or languages interoperate.",
"c22"
],
[
"ACID",
"Atomic, Consistent, Isolated, Durable: the guarantees of database transactions.",
"c25"
],
[
"Actor model",
"Concurrency where isolated actors own state and communicate only by messages.",
"c20"
],
[
"Adapter pattern",
"Wraps an incompatible interface to fit the one your code expects.",
"c21"
],
[
"Agent",
"An LLM in a loop that chooses tool calls, observes results, and repeats until a goal is met.",
"c32"
],
[
"Algebraic data type",
"Types built from products (structs: A and B) and sums (enums: A or B).",
"c18"
],
[
"Algorithm",
"A finite, precise sequence of steps solving a problem for every valid input.",
"c11"
],
[
"Aliasing",
"Two names referring to the same mutable object; changes through one are visible through the other.",
"c10"
],
[
"Amortised cost",
"Average cost per operation over a sequence (e.g. list append is O(1) amortised).",
"c11"
],
[
"API",
"Application Programming Interface: the contract by which code or services talk to each other.",
"c24"
],
[
"Assertion",
"A runtime check of something that must be true if the code is correct.",
"c09"
],
[
"AST",
"Abstract Syntax Tree: the tree form of source code built by a parser.",
"c22"
],
[
"Async / await",
"Syntax for cooperative concurrency: a task yields at await while waiting on I/O.",
"c20"
],
[
"Attention",
"Transformer mechanism letting each token weigh information from other tokens.",
"c29"
],
[
"Authentication / authorisation",
"Who you are / what you're allowed to do.",
"c26"
],
[
"Backpropagation",
"Chain-rule algorithm computing gradients for all parameters of a network.",
"c27"
],
[
"Batching (inference)",
"Serving many sequences at once so each weight read is reused; raises throughput.",
"c28"
],
[
"BF16 / FP16",
"16-bit floating-point formats (2 bytes per parameter) standard for model training and inference.",
"c28"
],
[
"BFS / DFS",
"Breadth-first (level by level) / depth-first (go deep, backtrack) graph traversal.",
"c12"
],
[
"Big-O",
"How cost grows with input size, ignoring constants and lower-order terms.",
"c11"
],
[
"Binary search",
"O(log n) search in sorted data by halving the range each step.",
"c11"
],
[
"Borrowing",
"Rust: temporary access to a value via & (shared) or &mut (exclusive) without taking ownership.",
"c10"
],
[
"BPE",
"Byte-pair encoding: the algorithm that builds LLM token vocabularies.",
"c29"
],
[
"Branch prediction",
"The CPU guessing which way an if will go; wrong guesses are costly.",
"c22"
],
[
"Buffer overflow",
"Writing past the end of a buffer; a classic C memory-safety vulnerability.",
"c10"
],
[
"Buffering",
"Collecting output in memory and writing it in chunks for speed.",
"c08"
],
[
"Bytecode",
"Intermediate instructions run by a virtual machine (CPython, JVM).",
"c01"
],
[
"Cache line",
"64-byte unit in which memory moves between RAM and CPU caches.",
"c22"
],
[
"Call stack",
"Stack of frames (locals, return address) for active function calls.",
"c05"
],
[
"CAP theorem",
"In a network partition a distributed store must choose consistency or availability.",
"c25"
],
[
"Channel",
"A typed pipe for passing values between goroutines or threads.",
"c20"
],
[
"CI",
"Continuous integration: automatically building and testing every change.",
"c16"
],
[
"Closure",
"A function that captures variables from the scope where it was created.",
"c14"
],
[
"Code point",
"The number Unicode assigns to a character (U+20B9 = ₹).",
"c07"
],
[
"Cohesion / coupling",
"How related a module's contents are / how dependent modules are on each other.",
"c21"
],
[
"Collision (hash)",
"Two keys mapping to the same bucket.",
"c12"
],
[
"Compiler",
"Translates source code to machine code (or another language) ahead of running.",
"c01"
],
[
"Composition",
"Building objects from other objects (has-a) rather than inheriting (is-a).",
"c13"
],
[
"Concurrency / parallelism",
"Dealing with many tasks at once / executing many at the same instant on multiple cores.",
"c20"
],
[
"Context window",
"Maximum tokens an LLM can consider at once (input + output).",
"c29"
],
[
"Cosine similarity",
"Similarity of two vectors by the angle between them; used for embeddings.",
"c31"
],
[
"CUDA",
"NVIDIA's GPU computing platform, the default target of AI software.",
"c28"
],
[
"Data race",
"Unsynchronised concurrent access to memory where at least one access writes.",
"c20"
],
[
"Deadlock",
"Threads each waiting on a lock the other holds; none can proceed.",
"c20"
],
[
"Decorator",
"A higher-order function (or pattern) that wraps another to add behaviour.",
"c14"
],
[
"Deep / shallow copy",
"Copy everything recursively / copy only the outer container, sharing the insides.",
"c10"
],
[
"Dependency injection",
"Passing dependencies in rather than constructing them inside; enables testing.",
"c21"
],
[
"Diffusion model",
"Generative model that creates images or video by iteratively denoising noise.",
"c27"
],
[
"DNS",
"Translates domain names to IP addresses.",
"c24"
],
[
"DRY",
"Don't Repeat Yourself: one source of truth for each piece of knowledge.",
"c21"
],
[
"Duck typing",
"If an object has the needed methods it can be used, regardless of its declared type.",
"c13"
],
[
"Dynamic programming",
"Solve overlapping subproblems once, store and reuse the results.",
"c11"
],
[
"Embedding",
"A vector representation of text or images where similar meanings are close together.",
"c31"
],
[
"Encapsulation",
"Hiding internal state behind methods that protect invariants.",
"c13"
],
[
"Encoding (text)",
"How code points become bytes (UTF-8, UTF-16).",
"c07"
],
[
"Event loop",
"Single-threaded scheduler running async tasks when they're ready.",
"c20"
],
[
"Exception",
"Error object that unwinds the call stack until caught.",
"c09"
],
[
"Exit code",
"Integer a process returns to its parent; 0 = success.",
"c01"
],
[
"Fine-tuning",
"Further training a pretrained model on your own examples.",
"c31"
],
[
"Floating point",
"IEEE 754 binary representation of real numbers; most decimals are inexact.",
"c02"
],
[
"Function colouring",
"Async functions can only be awaited from async functions, splitting code into two kinds.",
"c20"
],
[
"Garbage collection",
"Runtime automatically freeing memory that's no longer reachable.",
"c10"
],
[
"Generator / iterator",
"Produces items lazily one at a time.",
"c14"
],
[
"Generics",
"Code parameterised over types while keeping type safety.",
"c18"
],
[
"GGUF",
"Model file format used by llama.cpp/Ollama, supporting many quantisation levels.",
"c28"
],
[
"GIL",
"CPython's Global Interpreter Lock: one thread runs Python bytecode at a time.",
"c20"
],
[
"Goroutine",
"Go's lightweight runtime-scheduled thread.",
"c36"
],
[
"GPU",
"Processor with thousands of simple cores; ideal for matrix maths.",
"c28"
],
[
"GQA",
"Grouped-query attention: fewer KV heads to shrink the KV cache.",
"c28"
],
[
"Gradient descent",
"Iteratively adjusting parameters in the direction that reduces loss.",
"c27"
],
[
"Hallucination",
"Fluent but false model output.",
"c29"
],
[
"Hash function / table",
"Maps keys to integers / structure using hashes for O(1) average lookup.",
"c12"
],
[
"Heap (data structure)",
"Tree in an array giving O(1) min/max and O(log n) push/pop; a priority queue.",
"c12"
],
[
"Heap (memory)",
"Region for dynamically allocated data with flexible lifetime.",
"c10"
],
[
"Higher-order function",
"Takes or returns functions.",
"c14"
],
[
"HTTP",
"Stateless request/response protocol of the web (methods, status codes, headers).",
"c24"
],
[
"Idempotent",
"Repeating an operation has the same effect as doing it once.",
"c19"
],
[
"Immutable",
"Cannot be changed after creation.",
"c02"
],
[
"Index (database)",
"B-tree on columns making lookups O(log n) at the cost of writes.",
"c25"
],
[
"Inference",
"Running a trained model to produce outputs.",
"c27"
],
[
"Inheritance",
"A class reusing and extending another (is-a).",
"c13"
],
[
"Interface / trait / protocol",
"A contract of methods a type provides.",
"c13"
],
[
"Interpreter",
"Executes a program step by step without producing machine code first.",
"c01"
],
[
"Invariant",
"Condition that always holds at a given point (loop invariant, class invariant).",
"c04"
],
[
"JIT",
"Just-in-time compilation of hot code while the program runs.",
"c22"
],
[
"JSON",
"Text format for nested data: objects, arrays, strings, numbers, booleans, null.",
"c08"
],
[
"KV cache",
"Stored attention keys and values for past tokens; grows with context length.",
"c28"
],
[
"Latency / throughput",
"Time for one operation / operations per unit time.",
"c22"
],
[
"Lifetime (Rust)",
"How long a borrow is valid; checked by the compiler.",
"c37"
],
[
"Linked list",
"Nodes connected by pointers; O(1) insert, O(n) index.",
"c12"
],
[
"Linker",
"Joins compiled object files and libraries into an executable.",
"c22"
],
[
"Liskov substitution",
"Subtypes must be usable anywhere their parent type is.",
"c13"
],
[
"LLM",
"Large language model: a transformer trained to predict the next token.",
"c29"
],
[
"Load factor",
"Items ÷ buckets in a hash table; triggers resizing.",
"c12"
],
[
"Lockfile",
"Pins exact versions of all transitive dependencies.",
"c15"
],
[
"LoRA / QLoRA",
"Fine-tuning small adapter matrices on a frozen model / on a 4-bit frozen model.",
"c31"
],
[
"Loss function",
"Number measuring how wrong a model's predictions are.",
"c27"
],
[
"MCP",
"Model Context Protocol: open standard connecting AI apps to tools and data.",
"c32"
],
[
"Memoisation",
"Caching function results by their arguments.",
"c11"
],
[
"Memory bandwidth",
"Bytes per second a processor can read from memory; limits LLM decode speed.",
"c28"
],
[
"Memory leak",
"Memory that's never freed although no longer needed.",
"c10"
],
[
"Mixture of Experts (MoE)",
"Model where only some expert sub-networks run per token.",
"c28"
],
[
"Monomorphisation",
"Generating a specialised copy of generic code per concrete type.",
"c18"
],
[
"Mutex",
"Lock allowing one thread at a time into a critical section.",
"c20"
],
[
"N+1 queries",
"One query for a list plus one per item; fix with a join or batch.",
"c25"
],
[
"Normalisation",
"Storing each fact once in a relational schema.",
"c25"
],
[
"Null safety",
"Type system forcing you to handle absent values (Option, T?).",
"c18"
],
[
"OOM killer",
"Linux mechanism that kills processes when memory is exhausted.",
"c23"
],
[
"Open weights",
"Models whose parameters are downloadable to run yourself.",
"c29"
],
[
"ORM",
"Maps database tables to objects in code.",
"c25"
],
[
"Overfitting",
"Model memorises training data and fails on new data.",
"c27"
],
[
"Ownership",
"Rust rule: each value has one owner and is dropped when it goes out of scope.",
"c10"
],
[
"Parameters (model)",
"The learned weights of a neural network.",
"c29"
],
[
"Pass by object reference",
"Function receives a reference to the same object (Python, JS).",
"c10"
],
[
"Pointer",
"Variable holding a memory address.",
"c10"
],
[
"Polymorphism",
"Different types responding to the same call in their own way.",
"c13"
],
[
"Prefill / decode",
"Processing the prompt in parallel (compute-bound) / generating tokens one by one (bandwidth-bound).",
"c28"
],
[
"Process / thread",
"Running program with its own memory / execution path sharing a process's memory.",
"c20"
],
[
"Prompt caching",
"Provider discount for reusing an identical prompt prefix.",
"c30"
],
[
"Prompt injection",
"Malicious instructions inside content an AI reads.",
"c32"
],
[
"Pure function",
"Output depends only on inputs; no side effects.",
"c05"
],
[
"Quantisation",
"Storing weights at lower precision (8/4-bit) to save memory and speed up inference.",
"c28"
],
[
"Race condition",
"Result depends on unpredictable timing of concurrent operations.",
"c20"
],
[
"RAG",
"Retrieval-augmented generation: fetch relevant documents and put them in the prompt.",
"c31"
],
[
"Recursion",
"A function calling itself on a smaller problem, with a base case.",
"c05"
],
[
"Refactoring",
"Changing code structure without changing behaviour.",
"c21"
],
[
"Reference counting",
"Freeing an object when the number of references to it reaches zero.",
"c10"
],
[
"Regex",
"Pattern language for matching text.",
"c07"
],
[
"REST",
"API style using resources, HTTP verbs, and usually JSON.",
"c24"
],
[
"Result / Option",
"Rust types for success-or-error / value-or-nothing.",
"c19"
],
[
"RLHF",
"Reinforcement learning from human feedback: tuning models toward preferred answers.",
"c29"
],
[
"Scope",
"Region of code where a name is visible.",
"c05"
],
[
"SemVer",
"MAJOR.MINOR.PATCH versioning; major = breaking changes.",
"c15"
],
[
"Serialisation",
"Converting in-memory data to bytes or text (and back: parsing).",
"c08"
],
[
"Side effect",
"Any observable effect beyond returning a value (I/O, mutation).",
"c05"
],
[
"SIMD",
"One instruction processing multiple data values at once.",
"c22"
],
[
"Slice (Go)",
"A view (pointer, length, capacity) onto a backing array.",
"c36"
],
[
"SOLID",
"Five OO design principles: SRP, open/closed, Liskov, interface segregation, dependency inversion.",
"c21"
],
[
"SQL injection",
"Attacker-controlled input changing a query; prevented by parameterised queries.",
"c26"
],
[
"Stack (data structure)",
"LIFO collection: push/pop at the top.",
"c12"
],
[
"Stack (memory)",
"Region holding function frames; automatic, fast, small.",
"c10"
],
[
"Static / dynamic typing",
"Types checked before running / while running.",
"c02"
],
[
"stdin / stdout / stderr",
"A process's standard input, output and error streams.",
"c01"
],
[
"Strong / weak typing",
"Refuses / allows silent conversion between incompatible types.",
"c02"
],
[
"Structural / nominal typing",
"Compatibility by shape / by declared name.",
"c18"
],
[
"Sum type / tagged union",
"A value that is exactly one of several variants.",
"c18"
],
[
"System call",
"A program's request to the OS kernel (open, read, fork).",
"c23"
],
[
"Temperature",
"Sampling setting controlling randomness of model output.",
"c29"
],
[
"Tensor",
"N-dimensional array of numbers.",
"c27"
],
[
"Test double (mock/stub/fake)",
"Stand-in for a real dependency in tests.",
"c16"
],
[
"Token",
"Chunk of text (~4 characters) that models read, write and bill by.",
"c29"
],
[
"Tool use / function calling",
"Model requests your code to run a named function with arguments.",
"c30"
],
[
"Topological sort",
"Ordering tasks so each comes after its dependencies.",
"c12"
],
[
"Traceback",
"Printout of the call stack at an error.",
"c09"
],
[
"Transformer",
"Neural architecture built on attention; basis of modern LLMs.",
"c29"
],
[
"Transpiler",
"Source-to-source compiler (TypeScript → JavaScript).",
"c22"
],
[
"Truthiness",
"Non-boolean values treated as true/false in conditions.",
"c03"
],
[
"Two's complement",
"Standard binary representation of signed integers.",
"c02"
],
[
"Type erasure",
"Types checked at compile time and removed at runtime (TS, Java generics).",
"c18"
],
[
"Type inference",
"Compiler deduces types without annotations.",
"c02"
],
[
"Undefined behaviour",
"C/C++ operations with no defined meaning; the compiler may do anything.",
"c38"
],
[
"Unicode / UTF-8",
"Universal character set / its dominant variable-length byte encoding.",
"c07"
],
[
"Unit / integration / E2E test",
"Tests of one unit / several parts together / the whole system.",
"c16"
],
[
"Vector database",
"Store for embeddings with fast similarity search.",
"c31"
],
[
"Virtual environment",
"Isolated per-project set of Python packages.",
"c15"
],
[
"Virtual memory",
"Per-process private address space mapped to physical RAM in pages.",
"c23"
],
[
"VRAM",
"GPU memory; must hold model weights + KV cache + overhead.",
"c28"
],
[
"WebAssembly",
"Portable bytecode running at near-native speed in browsers and beyond.",
"c22"
],
[
"YAGNI",
"You Aren't Gonna Need It: don't build for imagined future needs.",
"c21"
],
[
"Zero value (Go)",
"The default value every Go type has when not initialised.",
"c36"
],
[
"ACME",
"Protocol for automatically obtaining and renewing TLS certificates (Let's Encrypt).",
"n151"
],
[
"ADR",
"Architecture Decision Record: a short, dated note of a decision, its alternatives and consequences.",
"n42"
],
[
"Alertmanager",
"Prometheus component that routes, groups and silences alerts.",
"n158"
],
[
"Amdahl's law",
"Speedup from parallelism is capped by the serial fraction of the work.",
"n27"
],
[
"ANN (approximate nearest neighbour)",
"Fast vector search that trades a little recall for big speed (HNSW, IVF).",
"n104"
],
[
"Argo CD",
"GitOps controller that keeps a cluster in sync with manifests in git.",
"n124"
],
[
"AWQ / GPTQ",
"Calibrated 4-bit weight quantisation formats for GPU inference.",
"n205"
],
[
"Backpressure",
"Slowing producers when consumers can't keep up, instead of growing queues without bound.",
"n177"
],
[
"Blue-green deployment",
"Run old and new environments side by side; switch traffic at once; instant rollback.",
"n125"
],
[
"BM25",
"Classic keyword relevance ranking used by search engines.",
"n103"
],
[
"Bulkhead",
"Isolating resources per dependency so one failure can't consume everything.",
"n177"
],
[
"Burn rate",
"How fast the error budget is being consumed relative to the SLO window.",
"n161"
],
[
"Canary release",
"Sending a small share of traffic to a new version first, watching metrics, then widening.",
"n125"
],
[
"cgroups",
"Linux feature limiting a process group's CPU, memory and I/O; used by containers.",
"n112"
],
[
"Chunking",
"Splitting documents into retrievable pieces for RAG.",
"n210"
],
[
"Circuit breaker",
"Stop calling a failing dependency for a cooldown and fail fast instead.",
"n177"
],
[
"ClusterIP / NodePort / LoadBalancer",
"Kubernetes Service types: internal only, on every node's port, or via a cloud load balancer.",
"n138"
],
[
"Consensus (Raft)",
"Algorithm letting a cluster agree on an ordered log while a majority is alive.",
"n175"
],
[
"Consistent hashing",
"Placing keys and nodes on a ring so adding a node moves only ~1/N of the keys.",
"n172"
],
[
"Container image",
"Immutable, layered filesystem template a container starts from.",
"n113"
],
[
"Contract test",
"Checks that a client and a service agree on request and response shapes.",
"n106"
],
[
"Core Web Vitals",
"LCP, INP and CLS: Google's user-centred page performance metrics.",
"n76"
],
[
"CORS",
"Server opt-in that lets browsers make cross-origin requests.",
"n70"
],
[
"Cross-encoder / reranker",
"Model scoring query and document together; more accurate second-pass ranking.",
"n213"
],
[
"CSP",
"Content Security Policy: browser allow-list for scripts and other resources; limits XSS.",
"n70"
],
[
"Dead-letter queue",
"Where messages go after repeated processing failures.",
"n90"
],
[
"Distroless image",
"Minimal container base with no shell or package manager.",
"n113"
],
[
"Docker Compose",
"Tool to define and run multi-container stacks from one YAML file.",
"n118"
],
[
"DPO",
"Direct Preference Optimisation: fine-tuning from chosen vs rejected answer pairs.",
"n204"
],
[
"Drift",
"Divergence between declared infrastructure and reality, or between training and live data.",
"n147"
],
[
"Error budget",
"1 − SLO: the amount of failure you may spend on shipping changes.",
"n161"
],
[
"Evals",
"Automated tests of AI system behaviour, graded by code, LLM judges or humans.",
"n227"
],
[
"Event loop (browser)",
"Runs a task, drains all microtasks, then may render; long tasks freeze the page.",
"n65"
],
[
"Event sourcing",
"Storing state as a sequence of events and deriving current state from them.",
"n174"
],
[
"Exactly-once (myth)",
"End to end you get at-least-once delivery plus idempotent processing.",
"n173"
],
[
"Faithfulness",
"Whether every claim in a RAG answer is supported by the retrieved context.",
"n214"
],
[
"Feature flag",
"Runtime switch that separates deploying code from releasing it.",
"n40"
],
[
"Fencing token",
"Increasing number issued with a lock so stale holders' writes are rejected.",
"n176"
],
[
"Flame graph",
"Profile visualisation: width is the share of samples, height is stack depth.",
"n186"
],
[
"Fuzzing",
"Feeding mutated random inputs to find crashes and security bugs.",
"n111"
],
[
"GitOps",
"Desired state lives in git; a controller reconciles the system to match it.",
"n124"
],
[
"Golden signals",
"Latency, traffic, errors and saturation.",
"n155"
],
[
"Graceful degradation",
"Switching off non-essential features to keep the core working under failure.",
"n184"
],
[
"HATEOAS",
"REST idea of including links to next actions in responses.",
"n82"
],
[
"Helm",
"Kubernetes package manager: templated charts plus release history.",
"n144"
],
[
"HNSW",
"Graph-based ANN index used by most vector databases.",
"n104"
],
[
"HPA",
"Horizontal Pod Autoscaler: scales replica count on CPU or custom metrics.",
"n143"
],
[
"HSTS",
"Header telling browsers to always use HTTPS for a site.",
"n64"
],
[
"Hybrid search",
"Combining keyword (BM25) and vector search, usually fused with RRF.",
"n212"
],
[
"Hydration",
"Attaching React event handlers to server-rendered HTML in the browser.",
"n78"
],
[
"IDOR",
"Insecure direct object reference: accessing another user's record by changing an ID.",
"n85"
],
[
"Idempotency key",
"Client-supplied key that lets a server safely deduplicate retried requests.",
"n83"
],
[
"Infrastructure as Code",
"Declaring infrastructure in versioned files and applying it with tools.",
"n148"
],
[
"Ingress",
"Kubernetes HTTP routing rules implemented by an ingress controller.",
"n139"
],
[
"Inverted index",
"Map from each term to the documents containing it; the core of full-text search.",
"n103"
],
[
"JWT",
"Signed, self-contained token; readable by anyone, hard to revoke.",
"n86"
],
[
"Kafka",
"High-throughput distributed log with partitions and consumer groups.",
"n174"
],
[
"Kubernetes",
"Container orchestrator that reconciles declared state across a cluster.",
"n135"
],
[
"Least privilege",
"Grant only the permissions a person or workload strictly needs.",
"n132"
],
[
"Little's law",
"Items in flight = arrival rate × time in system.",
"n191"
],
[
"LLM-as-judge",
"Using a model with a rubric to grade another model's outputs.",
"n227"
],
[
"Load shedding",
"Rejecting excess work early to protect the system under overload.",
"n177"
],
[
"MCP host / client / server",
"The AI app, its per-server connection, and the integration exposing tools/resources/prompts.",
"n223"
],
[
"Microtask / macrotask",
"Promise callbacks run before the next timer/event task in the JS event loop.",
"n68"
],
[
"Migration (schema)",
"Versioned, scripted database schema change.",
"n99"
],
[
"Multi-stage build",
"Dockerfile with build stages whose outputs are copied into a small final image.",
"n114"
],
[
"MVCC",
"Multi-version concurrency control: writers create new row versions so readers don't block.",
"n98"
],
[
"Namespaces (Linux)",
"Kernel isolation of what a process can see: PIDs, network, mounts, users.",
"n112"
],
[
"NATS / JetStream",
"Lightweight messaging system; JetStream adds persistence and streams.",
"n174"
],
[
"OAuth 2.0 / OIDC",
"Delegated authorisation / authentication layer used for \"Log in with Google\".",
"n86"
],
[
"Observability",
"Understanding a system's internal state from logs, metrics and traces.",
"n154"
],
[
"OpenAPI",
"Machine-readable HTTP API specification used for docs, clients and validation.",
"n83"
],
[
"OpenTelemetry",
"Vendor-neutral standard and SDKs for traces, metrics and logs.",
"n157"
],
[
"Outbox pattern",
"Write the event in the same DB transaction as the change; a relay publishes it.",
"n91"
],
[
"PACELC",
"If Partitioned choose A or C; Else choose Latency or Consistency.",
"n169"
],
[
"Passkeys / WebAuthn",
"Phishing-resistant public-key login bound to the site's domain.",
"n163"
],
[
"Percentile (p95/p99)",
"Value below which 95%/99% of observations fall; use for latency, not averages.",
"n155"
],
[
"PKCE",
"OAuth extension protecting the authorisation-code exchange for public clients.",
"n86"
],
[
"Pod",
"Smallest Kubernetes unit: one or more containers sharing network and storage.",
"n136"
],
[
"Postmortem",
"Blameless written review of an incident with timeline and action items.",
"n251"
],
[
"Prefix caching",
"Reusing the computed KV cache for a shared prompt prefix.",
"n206"
],
[
"Prometheus / PromQL",
"Pull-based metrics system and its query language.",
"n158"
],
[
"Property-based testing",
"Stating invariants and letting a tool generate inputs to break them.",
"n109"
],
[
"Quorum",
"Majority (or W+R>N) overlap that guarantees reads see the latest write.",
"n170"
],
[
"RBAC / ABAC",
"Role-based / attribute-based access control.",
"n85"
],
[
"Read replica",
"Asynchronous copy of a database used to scale reads; may lag.",
"n171"
],
[
"Recall@k",
"Share of queries whose relevant item appears in the top k results.",
"n214"
],
[
"Reconciliation (React)",
"Diffing the new render against the previous one to update the DOM minimally.",
"n71"
],
[
"Replication lag",
"Delay before a write on the leader appears on replicas.",
"n171"
],
[
"Reverse proxy",
"Server in front of apps handling TLS, routing, load balancing and limits.",
"n149"
],
[
"Rolling update",
"Replacing instances a few at a time with no downtime.",
"n125"
],
[
"RPO / RTO",
"How much data you can lose / how long you can be down after a disaster.",
"n153"
],
[
"RRF",
"Reciprocal Rank Fusion: merges ranked lists without score calibration.",
"n212"
],
[
"SBOM",
"Software bill of materials: list of everything inside an artifact.",
"n168"
],
[
"Server Components",
"React components rendered only on the server; ship no JS to the browser.",
"n77"
],
[
"Service (Kubernetes)",
"Stable virtual IP and DNS name load-balancing across matching ready pods.",
"n138"
],
[
"Sharding",
"Partitioning data across machines by a shard key.",
"n172"
],
[
"Sidecar",
"Helper container running alongside the app container in the same pod.",
"n136"
],
[
"SLI / SLO / SLA",
"Indicator measured / internal objective / contractual agreement.",
"n161"
],
[
"Speculative decoding",
"A draft model proposes tokens that the large model verifies in one pass.",
"n206"
],
[
"Split brain",
"Two nodes both acting as leader after a partition.",
"n171"
],
[
"SSE",
"Server-Sent Events: one-way server push over plain HTTP with auto-reconnect.",
"n88"
],
[
"SSR / SSG / ISR",
"Render per request / at build time / statically with background regeneration.",
"n78"
],
[
"Stale-while-revalidate",
"Serve cached content immediately while refreshing it in the background.",
"n133"
],
[
"Structured logging",
"Logs as key-value records (JSON) that can be queried by field.",
"n154"
],
[
"Structured outputs",
"Schema-constrained model output that code can parse reliably.",
"n218"
],
[
"Terraform state",
"Record mapping configuration to real resource IDs; keep remote and locked.",
"n147"
],
[
"Testcontainers",
"Library that starts real dependencies in containers for integration tests.",
"n106"
],
[
"Time to first token",
"Latency until a model's first output token; dominated by prefill.",
"n206"
],
[
"Tokenizer (BPE)",
"Splits text into sub-word tokens by learned merges of frequent pairs.",
"n201"
],
[
"Trace / span",
"A request's tree of timed operations across services.",
"n156"
],
[
"Transactional isolation levels",
"Read committed, repeatable read, serializable: which anomalies each prevents.",
"n97"
],
[
"Transfer learning",
"Fine-tuning a pretrained model's last layers on your own data.",
"n199"
],
[
"VPC / subnet / security group",
"Private cloud network, its address ranges, and per-resource stateful firewalls.",
"n131"
],
[
"WebSocket",
"Full-duplex message channel upgraded from an HTTP connection.",
"n87"
],
[
"Webhook",
"HTTP callback a provider sends to you when an event happens.",
"n89"
],
[
"Zero-downtime migration",
"Expand → migrate → contract schema changes compatible with old and new code.",
"n99"
]
];
