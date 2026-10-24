// Curriculum source. One line per chapter (numbered in order): title|level|content-keys|topics (;-separated)
// level: C = core (must understand) · P = practical (must build) · R = reference (revisit when needed)
// content-keys: files in src/content (written chapters). Empty = outline only.
const RAW = `
# 0|Learning Methodology
Learning to Program in the AI Era|C|c00,learn-problem-solving,c39|recognition vs recall;predict then run;20-minute rule;spaced repetition;problem decomposition;trace tables;systematic debugging;AI as reviewer not author;learning any new language fast
# I|Computing
What a Computer Actually Is|C|c01|CPU;registers;RAM;fetch-decode-execute;I/O;compiled vs interpreted vs VM;processes;stdin/stdout/stderr;exit codes
Binary, Bytes & Number Representation|C|n02|bits and bytes;binary;hexadecimal;two's complement;integer overflow;IEEE 754 floats;endianness;boolean algebra
Memory & Data Representation|C|n03|addresses;word size;alignment;padding;struct layout;arrays in memory;strings in memory
Processes & Programs|C|n04|process;program counter;threads;environment variables;arguments;signals;exit codes
# II|Programming
Variables & Types|C|c02|values;types;static vs dynamic;strong vs weak;inference;immutability;conversion;binary;floats
Operators & Expressions|C|c03|arithmetic;division traps;comparison;identity vs equality;short-circuit;truthiness;bitwise;precedence
Control Flow|C|c04|if/elif;guard clauses;pattern matching;loops;half-open ranges;off-by-one;loop invariants;termination
Functions|C|c05|parameters vs arguments;defaults;scope;pure functions;side effects;call stack;recursion
Scope & Closures|C|n11|lexical scope;block vs function scope;closures;late binding;nonlocal/global;shadowing
Collections|C|c06|arrays/lists;tuples;maps;sets;comprehensions;iteration;choosing a container
Strings & Encoding|C|c07|immutability;Unicode;code points;UTF-8/UTF-16;graphemes;formatting;regex
Files & Serialization|C|c08|stdin;argv;files;paths;CSV;JSON;YAML/TOML;binary formats;buffering
Errors & Exceptions|C|c09,c19|syntax/runtime/logic errors;tracebacks;exceptions;error values;Result types;fail fast;retries;idempotency
Debugging|C|n16|scientific method;bisection;print debugging;debuggers (pdb/gdb/dlv/VS Code);logging;rubber duck;git bisect
# III|Languages: Shared Concepts
Rosetta Table: Five Languages Side by Side|C|c33|concept-by-concept translation;when to use which
Toolchains & Running Code|C|x-lang-toolchains|interpreters vs compilers;REPLs;project setup;build/run/test commands;formatters & linters
Variables, Types & Mutability Across Languages|C|x-lang-vars|declaration;inference;mutability;constants;primitive types;conversion;null
Control Flow Across Languages|C|x-lang-control|if/else;switch/match;loops;iteration;break/continue;expressions vs statements
Functions & Closures Across Languages|C|x-lang-functions|parameters;defaults;variadics;multiple returns;closures;first-class functions
Collections Across Languages|C|x-lang-collections|arrays/lists/slices/Vec;maps;sets;iteration;map/filter;copying
Strings & Text Across Languages|C|x-lang-strings|encodings;indexing;slicing;formatting;builders;parsing
Data Modelling Across Languages|C|x-lang-types|structs;classes;methods;interfaces/traits;enums;polymorphism
Error Handling Across Languages|C|x-lang-errors|exceptions;error values;Result;panics;cleanup (finally/defer/RAII)
Modules & Project Layout Across Languages|C|x-lang-modules|files/packages/crates;visibility;imports;dependency manifests;layouts
Memory & Value Semantics Across Languages|C|x-lang-memory|copy vs share;references;GC/refcount/ownership/manual;mutation visibility
Concurrency Across Languages|C|x-lang-concurrency|threads;async/await;goroutines/channels;locks;parallelism
Files, I/O & the Standard Library Across Languages|P|x-lang-io|reading/writing files;stdin/stdout;JSON;HTTP clients;time;CLI args
# IV|JavaScript
JavaScript Overview & Runtime Model|C|n68|V8 heap and stack;call stack;event loop;microtasks vs macrotasks;4 rules of this;prototype delegation;async patterns;concurrency limiting
JavaScript Fundamentals: Types, Scope & Hoisting|C|x-js-fundamentals|primitives vs objects;let vs const vs var;coercion rules;truthiness;evaluation order;lexical environments;closures;hoisting;execution context
JavaScript Objects, Prototypes & Modern Classes|C|x-js-objects|object identity;property descriptors;Object.defineProperty;prototypes;prototype chain;new operator mechanics;this binding;classes;private fields;Map;Set;WeakMap
Asynchronous JavaScript: Event Loop, Promises & Timers|C|x-js-async|call stack;macrotask queue;microtask queue;Promise constructor;promise chaining;async await;error propagation;Promise combinators;AbortController;race conditions
Practical JavaScript: Node.js, Modules, Streams & Projects|P|x-js-practical|Node vs browser;CommonJS vs ESM;streams;backpressure;zero-dep HTTP server;Vitest;graceful shutdown;6 mastery projects
# V|TypeScript
TypeScript Overview & Mental Model|C|c35|erased types;compile vs runtime;structural typing;unions;generics;async;traps
TypeScript Cheat Sheet|R|x-ts-cheat|syntax at a glance;types;array/object methods;async;node APIs
TypeScript Foundations: Annotations, Unions & Narrowing|C|x-ts-basics|type annotations;inference;primitives;arrays;tuples;union types;literal types;unknown vs any vs never;type narrowing;control flow analysis
TypeScript Control Flow & Functions|C|x-ts-flow|if/switch;for-of/for-in;arrow functions;defaults;rest/spread;closures;this
Arrays, Objects, Maps & Sets|C|x-ts-collections|array methods;destructuring;objects;Map/Set;immutability;sorting
Interfaces, Classes & Type Modelling|C|x-ts-types|interfaces vs types;unions;classes;access modifiers;narrowing;enums alternatives
Errors, Modules & Node I/O|P|x-ts-errors-io|throw/try/catch;error types;ESM imports;fs/promises;path;process
Promises & Async in Depth|C|x-ts-async|promises;async/await;parallelism;cancellation;streams;event loop
TypeScript Tooling: tsconfig, npm, Build & Test|P|x-ts-tooling|tsconfig;npm/pnpm;scripts;tsx/tsc;vitest;eslint/prettier
Advanced TypeScript: Type Guards & Utility Types|P|n69|narrowing;type guards;type-level programming;keyof;satisfies;runtime validation with zod
# VI|Python
Python Overview & Mental Model|C|c34|Rosetta table;object model;idioms;typed Python;traps;uv
Python Cheat Sheet|R|x-py-cheat|syntax at a glance;common operations;stdlib quick reference;idioms
Python Basics: Syntax, Types & Operators|C|x-py-basics|indentation;names;int/float/str/bool/None;operators;truthiness;input/print
Python Control Flow & Functions|C|x-py-flow|if/match;for/while/else;range/enumerate/zip;def;args/kwargs;lambda;scope
Python Collections & Comprehensions|C|x-py-collections|list;tuple;dict;set;slicing;comprehensions;collections module;sorting
Python Classes & the Data Model|C|x-py-oop|classes;dataclasses;properties;dunder methods;inheritance;protocols
Python Errors, Files & Context Managers|C|x-py-errors-io|try/except/else/finally;custom exceptions;with;pathlib;json/csv
Python Iterators, Generators & Decorators|P|x-py-iter|iteration protocol;generators;itertools;decorators;functools
Python Typing, Modules & Packaging|P|x-py-packaging|type hints;mypy/pyright;modules;packages;uv;pyproject;pytest
Python Concurrency: asyncio, Threads & Processes|P|x-py-concurrency|GIL;threading;multiprocessing;asyncio;concurrent.futures
# VII|Go
Go Overview & Mental Model|C|c36|zero values;slices;interfaces;errors;goroutines;traps
Go Cheat Sheet|R|x-go-cheat|syntax at a glance;slices/maps;errors;goroutines;go commands
Go Basics: Packages, Variables & Types|C|x-go-basics|package main;var/:=;zero values;types;constants/iota;conversions;fmt
Go Control Flow & Functions|C|x-go-flow|if with init;switch;for (the only loop);range;functions;multiple returns;closures;defer
Go Arrays, Slices, Maps & Strings|C|x-go-collections|arrays;slices (len/cap/append);maps;strings & runes;slices/maps packages
Go Structs, Methods & Interfaces|C|x-go-types|structs;methods;pointer vs value receivers;embedding;interfaces;type switches
Go Errors, Defer & Panic|C|x-go-errors|error values;wrapping %w;errors.Is/As;custom errors;defer;panic/recover
Go Goroutines, Channels & Context|C|x-go-concurrency|goroutines;channels;select;WaitGroup;Mutex;context;worker pools
Go Modules, Testing & Tooling|P|x-go-tooling|go mod;project layout;go test;table tests;benchmarks;go vet;gofmt
# VIII|Linux
Shell|C|c17|navigation;files;grep/sed/awk/sort/uniq/cut/xargs/find;pipes;redirection;env;scripting
Processes|C|n53|ps/top/htop;kill/signals;jobs/fg/bg;nohup;nice
Filesystems|C|n54|FHS (/etc /var /proc /sys);inodes;links;mounts;disk usage
Permissions|C|n55|rwx;chmod/chown;groups;sudo;umask
Services|P|n56|systemd;systemctl;journalctl;unit files
SSH|P|n57|keys;ssh-keygen;authorized_keys;known_hosts;scp/rsync;port forwarding
Networking Tools|P|n58|curl;ping;traceroute;dig;ss;tcpdump
Package Management|R|n59|apt/dpkg;repositories;dependencies
# IX|Git & Collaboration
Git Fundamentals|C|n43|working tree;staging;commit;HEAD;status/diff/log;restore/rm/mv
Branching|C|n44|branch;switch;fast-forward;three-way merge;detached HEAD
Merge & Rebase|C|n45|merge conflicts;rebase;interactive rebase;cherry-pick;revert vs reset;reflog;bisect;stash;worktrees
Git Internals|R|n46|blob;tree;commit;tag;SHA;object database;refs
GitHub|P|n47|repos;issues;projects;labels;releases;branch protection;rulesets;Dependabot;security scanning
Pull Requests|P|n48|small PRs;descriptions;draft PRs;CODEOWNERS;CI checks
Code Review|P|n49|what to look for;giving/receiving feedback;review checklists
Open Source|P|n50|fork→branch→PR flow;CONTRIBUTING;LICENSE;maintainer etiquette
GitHub Actions|P|n51|workflows;jobs;steps;runners;matrix;caching;secrets;environments;artifacts
# X|Computer Science
Big-O|C|n20|time vs space;amortised;best/average/worst;lower bounds;time-space trade-offs;measuring
Recursion|C|n21|base case;recursive leap of faith;call stack;memoisation;tail calls;recursion → iteration
Memory & Pointers|C|c10|stack vs heap;pointers;value vs reference semantics;aliasing;shallow vs deep copy;GC;refcounting;ownership/borrowing;leaks
Data Structures|C|c12|arrays vs linked lists;stack;queue;deque;hash tables;BST;heaps;graphs;tries;union-find;B-trees;Bloom filters;LRU cache
Algorithms|C|c11|searching;sorting;divide and conquer;greedy;dynamic programming;two pointers;sliding window;backtracking
# XI|Data Structures & Algorithms
How to Think About Data Structures|C|x-dsa-intro|abstract data types;operations & costs;memory pictures;choosing by operations
Arrays & Dynamic Arrays|C|x-dsa-arrays|contiguous memory;indexing;insert/delete cost;resizing;amortised append
Linked Lists|C|x-dsa-linked|nodes & pointers;singly/doubly/circular;insert/delete;reverse;cycle detection;merge;when to use
Stacks|C|x-dsa-stack|LIFO;push/pop;call stack;undo;bracket matching;expression evaluation
Queues, Deques & Ring Buffers|C|x-dsa-queue|FIFO;deque;circular buffer;BFS;task queues
Hash Tables in Depth|C|x-dsa-hash|hash functions;buckets;collisions;chaining vs open addressing;load factor;resizing
Trees & Traversals|C|x-dsa-trees|terminology;binary trees;pre/in/post-order;level order;height;recursion on trees
Binary Search Trees|C|x-dsa-bst|ordering invariant;search/insert/delete;inorder = sorted;degeneration
Balanced Trees: AVL, Red-Black & B-Trees|R|x-dsa-balanced|rotations;balance invariants;B-trees for disks;where they are used
Heaps & Priority Queues|C|x-dsa-heap|heap property;array layout;sift up/down;heapify;top-k;scheduling
Tries|P|x-dsa-trie|prefix trees;insert/search;autocomplete;memory trade-offs
Graphs: Representation & Traversal|C|x-dsa-graphs|vertices & edges;directed/weighted;adjacency list/matrix;BFS;DFS;cycles
Shortest Paths & Graph Algorithms|C|x-dsa-paths|BFS distances;Dijkstra;topological sort;minimum spanning tree;A*
Union-Find|P|x-dsa-unionfind|disjoint sets;find/union;path compression;union by rank;connectivity
Sorting Algorithms Step by Step|C|x-dsa-sorting|bubble;selection;insertion;merge;quick;heap;counting/radix;stability
Searching & Binary Search Patterns|C|x-dsa-search|linear vs binary;lower/upper bound;search on the answer;invariants
Two Pointers, Sliding Window & Prefix Sums|C|x-dsa-patterns|two pointers;fast/slow;fixed & variable windows;prefix sums;difference arrays
Backtracking|P|x-dsa-backtrack|choose-explore-unchoose;permutations;subsets;N-queens;pruning
Dynamic Programming Step by Step|C|x-dsa-dp|overlapping subproblems;memoisation;tabulation;classic problems;recovering answers
Greedy Algorithms|P|x-dsa-greedy|greedy choice;interval scheduling;coins;Huffman;when greedy fails
Bit Manipulation|R|x-dsa-bits|bitwise ops;masks;flags;tricks;bitsets
Choosing the Right Data Structure|C|x-dsa-choose|operation → structure table;language equivalents;decision guide
# XII|Software Engineering
Clean Code|C|c21|KISS;YAGNI;DRY;naming;cohesion/coupling;SOLID;patterns;smells;refactoring
SOLID|C|n34|SRP;open/closed;Liskov;interface segregation;dependency inversion
Object-Oriented Programming|C|c13|classes;encapsulation;invariants;inheritance;polymorphism;interfaces;composition over inheritance;Liskov
Functional Programming|C|c14|first-class functions;higher-order;closures;map/filter/reduce;immutability;generators;decorators
Type Systems|C|c18|generics;ADTs;sum types;null safety;nominal vs structural;variance;gradual typing;newtypes
Generics|P|n25|type parameters;bounds/constraints;monomorphisation vs erasure;generic data structures
Architecture|C|n35|monolith;modular monolith;layered;MVC;clean/hexagonal;event-driven;microservices;when NOT to use each
Design Patterns|P|n36|strategy;observer;factory;adapter;decorator;facade;builder;command;state;repository
Dependency Injection|P|n37|constructor injection;interfaces;testability;composition root
Modules|C|n38|namespaces;public API vs internals;circular imports;module boundaries
Packages|C|c15|pip/uv;npm/pnpm;go mod;cargo;make/CMake;lockfiles;semver;transitive deps;licences
Configuration|P|n40|env vars;config files;12-factor;secrets;feature flags
Documentation|P|n41|README;API docs;architecture docs;runbooks;changelog;comments that explain why
ADRs|R|n42|context;decision;alternatives;consequences
# XIII|Systems & OS Internals
Source Code → Compiler → Machine|C|c22|lexer;parser;AST;IR;optimiser;linker;JIT;AOT;transpiler;WebAssembly;memory hierarchy;cache locality;profiling
Linking, Loading & Libraries|C|x-linking|object files;symbols;static vs dynamic linking;ELF;ld.so;ldd;ABI;FFI
Operating System Basics|C|c23|kernel vs user space;system calls;virtual memory;swap;scheduler;file descriptors;signals;fork/exec;containers vs VMs
I/O Models|C|x-io|blocking vs non-blocking;select/poll/epoll;io_uring;event loops;async runtimes;thread-per-request
Concurrency|C|c20|processes/threads/goroutines/async;races;locks;deadlock;channels;actors;event loop;GIL
Parallelism|R|n27|multicore;data parallelism;Amdahl's law;SIMD;GPU;work stealing
# XIV|C
C Overview & Mental Model|C|c38|pointers;manual memory;UB;sanitizers;build pipeline
C Cheat Sheet|R|x-c-cheat|syntax at a glance;printf formats;pointers;memory;string.h;gcc flags
C Basics: Types, Operators & Control Flow|C|x-c-basics|int sizes;char;float;operators;if/switch/loops;printf/scanf
C Functions, Headers & the Build|C|x-c-functions|declarations vs definitions;headers;static;compilation units;make
C Pointers & Arrays|C|x-c-pointers|addresses;* and &;pointer arithmetic;arrays decay;const pointers;function pointers
C Dynamic Memory|C|x-c-memory|malloc/calloc/realloc/free;ownership conventions;leaks;valgrind/ASan
C Strings & Text|C|x-c-strings|NUL-terminated;string.h;safe copying;snprintf;parsing;UTF-8 bytes
C Structs, Unions & Enums|C|x-c-structs|struct layout;typedef;opaque types;unions;enums;bit fields
C Files & I/O|P|x-c-io|FILE*;fopen/fread/fwrite;fgets;errno;POSIX open/read/write
C Preprocessor & Undefined Behaviour|C|x-c-preproc|#include/#define/#ifdef;macros pitfalls;UB catalogue;sanitizers;warnings
# XV|Rust
Rust Overview & Mental Model|C|c37|ownership;borrowing;enums;traits;Result;lifetimes;traps
Rust Cheat Sheet|R|x-rs-cheat|syntax at a glance;ownership;Option/Result;iterators;cargo commands
Rust Basics: Variables, Types & Expressions|C|x-rs-basics|let/mut;shadowing;scalar types;tuples/arrays;expressions;functions;control flow
Rust Ownership, Borrowing & Lifetimes|C|x-rs-ownership|move;Copy/Clone;&/&mut;borrow rules;slices;lifetimes
Rust Structs, Enums & Pattern Matching|C|x-rs-types|structs;impl;enums with data;Option;match;if let;let-else
Rust Collections, Strings & Iterators|C|x-rs-collections|Vec;String vs &str;HashMap;iterators;adaptors;collect
Rust Traits & Generics|C|x-rs-traits|traits;default methods;derive;generics & bounds;impl Trait;dyn Trait;common traits
Rust Error Handling|C|x-rs-errors|Result;?;custom errors;From;thiserror/anyhow;panic vs Result
Rust Concurrency & Async|P|x-rs-concurrency|threads;move closures;channels;Arc/Mutex;Send/Sync;rayon;tokio
Rust Cargo, Modules & Testing|P|x-rs-tooling|cargo;crates;modules/visibility;tests;docs;clippy;features
# XVI|Networking & the Web
How the Internet Works|C|c24|layers;IP;TCP/UDP;ports;DNS;TLS;HTTP;REST/GraphQL/gRPC/WebSocket
DNS|C|n61|records (A/AAAA/CNAME/MX/TXT);resolvers;TTL;caching;dig
TCP/IP|C|n62|MAC;IP;subnets;gateway;ARP;DHCP;NAT;routing;sockets;handshake
IP Addressing & Subnetting|C|x-subnet|CIDR;subnet masks;private ranges;IPv6;routing tables;worked subnet maths
HTTP|C|n63|methods;headers;status codes;cookies;caching (ETag, Cache-Control);HTTP/1.1 vs 2 vs 3
HTTPS/TLS|C|n64|certificates;CAs;handshake;key exchange;HSTS
Proxies, Load Balancers & NAT|C|x-lb|forward vs reverse proxy;L4 vs L7;balancing algorithms;health checks;sticky sessions;NAT traversal
Browsers|C|n65|DOM;CSSOM;render tree;layout;paint;compositing;event loop
HTML|P|n66|semantic HTML;forms;accessibility;ARIA;SEO
CSS|P|n67|box model;flexbox;grid;responsive;specificity;stacking contexts;animations
DOM Scripting & Browser APIs|P|dom-apis|DOM manipulation;events;bubbling;custom elements;fetch API;Web Workers;Storage
Web Security|C|n70|same-origin policy;CORS;CSRF;XSS;CSP;cookie flags;storage
# XVII|Frontend
React|P|n71|components;props;state;hooks;effects;refs;context;reconciliation;keys
State|P|n72|local vs global state;lifting state;reducers;server state
Routing|P|n73|client routing;nested routes;URL as state
Forms|P|n74|controlled inputs;validation;accessibility
Data Fetching|P|n75|loading/error states;caching;TanStack Query;suspense
Frontend Performance|P|n76|bundle size;code splitting;lazy loading;memoisation;Core Web Vitals
Next.js|P|n77|App Router;Server vs Client Components;Server Actions;route handlers;middleware
SSR/SSG/ISR|R|n78|rendering strategies;streaming;caching;revalidation
Accessibility|P|n79|semantics;keyboard;screen readers;contrast;WCAG
# XVIII|Backend
Servers|C|n80|HTTP server from scratch;routing;middleware;request/response;graceful shutdown
Node.js|P|n81|event loop;libuv;streams;buffers;worker threads;child processes
REST|C|n82|resources;CRUD;status codes;pagination;filtering;versioning
API Design|P|n83|consistency;errors;idempotency;rate limits;OpenAPI
Authentication|C|n84|sessions;cookies;password hashing;MFA;login flow
Authorization|C|n85|RBAC;ABAC;ownership checks;least privilege
Sessions/JWT/OAuth|C|n86|access/refresh tokens;JWT pitfalls;OAuth 2.0;OIDC;PKCE
WebSockets|P|n87|upgrade;real-time;scaling connections;reconnection
SSE|R|n88|server push;EventSource;vs WebSockets
Webhooks|P|n89|signatures;retries;idempotency;verification
Queues|C|n90|producer/consumer;ack;retry;dead-letter queue;queue vs pub/sub vs stream
Background Jobs|P|n91|workers;scheduling;BullMQ;idempotent jobs
# XIX|Databases
Data Models & Storage Fundamentals|C|x-datamodels|relational/document/key-value/graph/column;storage engines;B-tree vs LSM;durability;choosing a model
Relational Databases|C|c25|tables;keys;constraints;normalisation;indexes;transactions;ACID;SQL vs NoSQL
SQL|C|n93|SELECT/WHERE/JOIN/GROUP BY;subqueries;CTEs;window functions;views
PostgreSQL|P|n94|psql;roles;schemas;extensions;EXPLAIN ANALYZE;VACUUM;backups
Indexes|C|n95|B-tree/B+ tree;composite indexes;covering;when indexes hurt
Query Planning|R|n96|planner;statistics;seq scan vs index scan;join algorithms
Transactions|C|n97|isolation levels;dirty/non-repeatable/phantom reads;lost updates;deadlocks
Concurrency/MVCC|R|n98|MVCC;row locks;optimistic vs pessimistic locking
Migrations|P|n99|versioned schema changes;zero-downtime migrations;rollbacks
ORMs|P|n100|Prisma/Drizzle;N+1;connection pooling;raw SQL escape hatch
MongoDB|R|n101|documents;collections;aggregation;indexes;when to use
Redis|P|n102|data types;TTL;pub/sub;streams;persistence;caching patterns
Search Engines|R|n103|inverted index;BM25;Elasticsearch/OpenSearch
Vector Databases|P|n104|embeddings;HNSW;pgvector;hybrid search
# XX|Testing
Testing Strategy|C|x-teststrategy|the testing ladder;what each level catches;cost vs confidence;choosing tests
Unit Testing|C|c16|test pyramid;AAA;edge cases;test doubles;TDD;coverage;property-based;CI
Integration Testing|P|n106|real DB;testcontainers;fixtures
API Testing|P|x-apitest|HTTP-level tests;schemas;auth cases;error paths;contract checks
Database Testing|P|x-dbtest|migrations in tests;fixtures;transactions;query correctness;data-migration tests
E2E|P|n107|Playwright;flakiness;critical paths
Mocking|P|n108|stubs;mocks;fakes;when not to mock
Property Testing|R|n109|hypothesis;fast-check;invariants
Load Testing|R|n110|k6;latency percentiles;throughput
Fuzzing|R|n111|go fuzz;cargo-fuzz;sanitizers
Testing in Production|P|x-prodtest|smoke tests;synthetic monitoring;canary analysis;feature-flag checks;chaos
# XXI|Docker
Containers|C|n112|why containers;namespaces;cgroups;VM vs container
Images|C|n113|layers;tags;registries;image size
Dockerfiles|P|n114|FROM/RUN/COPY/CMD/ENTRYPOINT;multi-stage;.dockerignore;non-root;layer caching
Volumes|P|n115|named volumes;bind mounts;persistence
Docker Networking|P|n116|bridge;ports;container DNS;service-to-service
Registries|R|n117|Docker Hub;GHCR;ECR;tagging strategy
Docker Compose|P|n118|services;depends_on;healthchecks;env;profiles;dev vs prod
Production Containers|P|n119|security;healthchecks;resource limits;logging
# XXII|CI/CD
The Path to Production|C|x-path|commit → PR → CI → image → registry → deploy → proxy → app → data → monitoring
Continuous Integration|C|n120|lint;typecheck;test;build on every push
GitHub Actions in Depth|P|n121|reusable workflows;caching;matrix;OIDC to cloud
Artifacts|R|n122|build outputs;container images;retention
Secrets|C|n123|secret stores;rotation;never in git
Continuous Delivery|P|n124|registry→deploy→health check;environments;approvals
Deployment Strategies|P|n125|rolling;blue-green;canary;feature flags;rollback
# XXIII|Cloud
Cloud Fundamentals|C|n126|VM;bare metal;serverless;managed services;regions/AZs;shared responsibility
AWS|R|n127|the core service map and GCP/Azure equivalents
Compute|P|n128|EC2;ECS;Lambda;autoscaling
Storage|P|n129|S3/object storage;block vs file vs object
Cloud Databases|R|n130|RDS;managed Postgres;backups;replicas
Cloud Networking|R|n131|VPC;subnets;security groups;load balancers
IAM|C|n132|users/roles/policies;least privilege
CDN|P|n133|edge caching;CloudFront/Cloudflare;cache keys
Serverless|R|n134|functions;cold starts;event triggers;limits
# XXIV|Kubernetes
Kubernetes Architecture|C|n135|why orchestration;control plane;nodes;etcd;scheduler
Pods|C|n136|pod lifecycle;probes;sidecars
Deployments|P|n137|ReplicaSets;rollouts;StatefulSets;DaemonSets;Jobs/CronJobs
Services|P|n138|ClusterIP;NodePort;LoadBalancer;DNS
Ingress|P|n139|ingress controllers;TLS;routing
ConfigMaps|P|n140|configuration;env vs mounted files
Kubernetes Secrets|P|n141|secret types;external secret stores
Kubernetes Volumes|R|n142|PV;PVC;storage classes
Scaling|P|n143|requests/limits;HPA;cluster autoscaling
Helm|R|n144|charts;values;Kustomize alternative
RBAC|R|n145|roles;service accounts;namespaces
Network Policies|R|n146|pod-to-pod rules;CNI
# XXV|Infrastructure
Terraform|P|n147|providers;resources;state;plan/apply;modules;remote state;drift
Infrastructure as Code|C|n148|declarative infra;review via PRs;reproducibility
Reverse Proxies|P|n149|Nginx;Caddy;Traefik;TLS termination;load balancing;WebSocket proxying
Production DNS|R|n150|domains;records for services;DNS-based failover
Production TLS|P|n151|Let's Encrypt;ACME;certificate renewal
Backups|C|n152|backup types;restore drills;3-2-1 rule
Disaster Recovery|R|n153|RPO;RTO;failover
# XXVI|Observability
Logging|C|n154|structured logs;levels;correlation/request IDs
Metrics|C|n155|RED/USE;latency percentiles;error rate;saturation
Tracing|P|n156|spans;context propagation;distributed traces
OpenTelemetry|P|n157|SDKs;collector;exporters
Prometheus|P|n158|scraping;PromQL;exporters
Grafana|P|n159|dashboards;Loki;Tempo/Jaeger
Alerting|P|n160|symptom-based alerts;noise;on-call
SLO/SLI/SLA|C|n161|error budgets;availability maths
# XXVII|Production Engineering
Production Readiness|C|x-prodready|the checklist;configuration;secrets;observability;resilience;data safety;operations
Health Checks & Graceful Shutdown|P|x-health|liveness/readiness;dependency checks;SIGTERM handling;draining;startup
Rate Limiting & Load Protection|P|x-ratelimit|token bucket;sliding window;where to enforce;quotas;load shedding;fairness
Operating a Service|P|x-operate|ownership;on-call;runbooks;deploy hygiene;toil;capacity reviews
# XXVIII|Security
Security Across the Stack|C|x-secmap|where security shows up at every layer;threat modelling;defence in depth
OWASP Top 10|C|c26|injection;XSS;CSRF;SSRF;access control;crypto basics;secrets;supply chain;prompt injection
Authentication Security|C|n163|password storage;MFA;session security;brute force
Cryptography|C|n164|hashing;salt;HMAC;AES;RSA/ECC;signatures;certificates;never roll your own
Secrets Management|P|n165|vaults;env injection;rotation
Container Security|R|n166|minimal images;non-root;image scanning
Cloud Security|R|n167|IAM;network segmentation;audit logs
Supply Chain Security|R|n168|lockfiles;SBOM;signing;dependency audits
# XXIX|Distributed Systems
CAP & PACELC|C|n169|partitions;consistency vs availability;latency trade-offs
Consistency|C|n170|strong;eventual;read-your-writes;quorum
Replication|C|n171|leader/follower;multi-leader;replication lag
Sharding|P|n172|partitioning;consistent hashing;hot keys
Distributed Queues|P|n173|delivery semantics;exactly-once myth;dedup
Event Streaming|R|n174|Kafka;NATS;logs vs queues;consumer groups
Consensus|R|n175|leader election;Raft
Distributed Locks|R|n176|leases;fencing tokens
Resilience|C|n177|timeouts;retries+backoff;circuit breakers;bulkheads;load shedding;backpressure
# XXX|System Design
Requirements|C|n178|functional vs non-functional;constraints
System API Design|P|n179|entities;endpoints;contracts
Capacity Planning|C|n180|QPS;storage;bandwidth estimates;back-of-envelope
System Architecture|P|n181|components;data flow;diagrams
Caching|C|n182|cache-aside;write-through/back;invalidation;stampede;TTL;eviction
Scaling|C|n183|vertical vs horizontal;stateless services;read replicas
Failure Modes|C|n184|single points of failure;graceful degradation
Trade-offs|C|n185|cost;complexity;consistency;latency — practice: URL shortener, chat, feed, rate limiter
# XXXI|Performance
Profiling|C|n186|CPU/memory profilers;flame graphs
CPU Performance|R|n187|caches;branch prediction;SIMD
Memory Performance|R|n188|allocation;GC tuning;locality
Database Performance|P|n189|indexes;query optimisation;pooling
Network Performance|R|n190|latency;compression;HTTP/2;CDN
Load Testing in Practice|P|n191|realistic loads;percentiles;Little's law
Benchmarking|P|n192|micro vs macro benchmarks;statistical noise
# XXXII|Machine Learning
ML Fundamentals|C|c27|supervised/unsupervised/RL;loss;gradient descent;backprop;overfitting;train/val/test
Statistics|R|n194|distributions;mean/variance;sampling;significance
Linear Algebra|R|n195|vectors;matrices;dot product;matrix multiply
Classical ML|P|n196|regression;trees;gradient boosting;k-means;PCA;cross-validation;metrics
Deep Learning|C|n197|neurons;activations;optimisers;batching;regularisation;dropout
Neural Networks|P|n198|build an MLP from scratch;PyTorch basics
CNNs|R|n199|convolution;pooling;vision
Transformers (architecture)|C|n200|attention;multi-head;positional encoding;blocks
# XXXIII|LLMs
Tokenization|C|n201|BPE;vocab;tokens≠words;cost/context implications
How LLMs Work|C|c29|pipeline;attention;sampling;pretraining;SFT;RLHF;reasoning;hallucination;modalities
Training|R|n203|pretraining data;compute (6·N·D);scaling laws
Fine-tuning|P|n204|SFT;LoRA;QLoRA;DPO;datasets
Quantization|C|n205|FP16/BF16/FP8/INT4;GGUF;AWQ;GPTQ;quality trade-off
Inference|C|n206|prefill vs decode;KV cache;batching;speculative decoding
Local Models|P|n207|Ollama;llama.cpp;vLLM;offloading;tokens/sec
GPU/VRAM|C|c28|weights maths;KV cache formula;speed ceiling;training memory;hardware tiers
# XXXIV|RAG
Embeddings|C|c31|vectors;cosine similarity;RAG pipeline;fine-tuning vs RAG vs prompting
Chunking|P|n210|strategies;overlap;structure-aware chunking
Vector Search|P|n211|HNSW;ANN;metadata filters
Hybrid Search|P|n212|BM25 + vectors;fusion
Reranking|P|n213|cross-encoders;top-k tuning
RAG Evaluation|P|n214|retrieval recall;faithfulness;golden sets
Production RAG|P|n215|ingestion pipelines;freshness;access control
# XXXV|AI Engineering
Providers & APIs|C|c30|provider landscape;Anthropic/OpenAI-compatible/Ollama code;streaming;cost control;prompting
APIs in Depth|P|n217|messages;system prompts;stop reasons;rate limits;retries
Structured Outputs|P|n218|JSON schema;validation;repair
Tool Calling|C|n219|tool definitions;execution loop;parallel calls;errors;timeouts
Function Calling Safety|P|n220|permissions;sandboxing;tool injection
Agents|C|c32|agent loop;MCP;workflows vs agents;risks;safeguards
AI Memory|R|n222|working/episodic/semantic memory;vector vs graph memory
MCP|C|n223|hosts/clients/servers;tools/resources/prompts;JSON-RPC;stdio vs HTTP
MCP Servers|P|n224|build one (notes/Postgres/GitHub);local vs remote hosting;auth
MCP Clients|R|n225|connecting servers;capability negotiation
AI Security|C|n226|prompt injection;data exfiltration;least privilege;human approval
AI Evaluation|P|n227|evals;LLM-as-judge;regression suites
# XXXVI|MLOps
Model Versioning|R|n228|registries;pinning model IDs
Dataset Versioning|R|n229|DVC;lineage
Evaluation in Production|P|n230|online vs offline;A/B tests
Model Deployment|R|n231|serving stacks;autoscaling GPUs
AI Monitoring|P|n232|latency;token usage;drift;quality
AI Cost|C|n233|tokens/request;caching;batching;GPU hours
AI Reliability|P|n234|fallbacks;timeouts;budgets;audit logs
# XXXVII|Projects
CLI Project|P|n235|todo CLI: files, JSON, errors, args, git
Backend Project|P|n236|HTTP server from scratch → REST task API (TS + Postgres)
Full Stack Project|P|n237|React + Node + Postgres + Redis
Docker Project|P|n238|containerise the full stack with Compose
CI/CD Project|P|n239|PR → CI → image → registry → deploy
Cloud Project|P|n240|DNS → HTTPS → Nginx → app → Postgres
Kubernetes Project|P|n241|move the stack to k8s
Distributed System Project|P|n242|API → queue → workers → DB
RAG System|P|n243|parse → chunk → embed → pgvector → rerank → LLM
MCP Server Project|P|n244|your own MCP server
AI Agent Project|P|n245|tool-using agent with limits and approvals
Production AI Platform|P|n246|capstone: auth, agents, MCP, RAG, memory, observability, CI/CD
# XXXVIII|Engineering Practice
Debugging in Practice|P|n247|production debugging;reading logs/traces
Code Review Practice|P|n248|reviewing others;self-review
Writing Docs|P|n249|docs as engineering
Architecture Reviews|R|n250|design docs;trade-off discussions
Incident Response|R|n251|on-call;postmortems;blameless culture
System Design Practice|P|n252|timed design exercises
Open Source Practice|P|n253|first contributions;maintainership
Interview Preparation|R|n254|DSA practice;system design;behavioural
Glossary|R|glossary|every term, searchable
# XXXIX|AI Integration in Apps
AI Integration Overview|C|ai-overview|why integrate AI;integration patterns;build vs buy;cost model;latency vs quality trade-offs;when NOT to use AI
Text Generation in Apps|C|ai-text-gen|chat completions;streaming to the UI;system prompts;multi-turn context;temperature and sampling;token budgets;provider SDKs
Image Generation APIs|P|ai-image-gen|DALL·E / Stable Diffusion / Flux APIs;prompt engineering for images;style consistency;content policy;cost per image;using generated images safely
Speech: STT and TTS|P|ai-speech|Whisper speech-to-text;ElevenLabs/OpenAI TTS;real-time transcription;voice assistants;latency tricks;audio streaming
Embeddings in Practice|C|ai-embeddings|choosing an embedding model;semantic search;similarity thresholds;batch embedding;updating embeddings on edit/delete;cost
Building a Chatbot|P|ai-chatbot|conversation state;multi-turn memory;system prompt design;guardrails;fallback handling;typing indicators;SSE streaming to React
Building an AI Search Bar|P|ai-search|embed on type vs on submit;hybrid keyword+vector search;result ranking;highlighting;re-ranking with a cross-encoder;UI patterns
AI in Forms and UX|P|ai-ux|autocomplete;content generation suggestions;classification;sentiment tagging;smart defaults;progressive disclosure
Integrating AI Agents in Products|C|ai-agents-product|agentic features;multi-step workflows;human-in-the-loop gates;progress UX;error recovery;cost caps
AI Cost Control in Production|C|ai-cost-control|prompt caching;batching;smaller cheaper models first;caching deterministic responses;token counting before sending;usage dashboards
AI Rate Limits and Reliability|P|ai-reliability|provider rate limits;exponential backoff;fallback providers;circuit breaker for AI calls;timeouts;degraded mode
Prompt Engineering Patterns|C|ai-prompting|zero/few-shot;chain of thought;step-back prompting;structured outputs;self-consistency;re-asking on failure;injection defence
Testing AI Features|P|ai-testing|determinism challenges;snapshot tests for prompts;LLM-as-judge evals;golden datasets;regression on model upgrades;latency budgets
AI Feature Flags and Rollout|R|ai-feature-flags|A/B testing AI vs rule-based;gradual rollout;kill switch;shadowing;feedback collection
# XL|Payment Gateways
Payments Fundamentals|C|pay-fundamentals|payment flow;settlement;interchange fees;chargebacks;PCI-DSS basics;card-present vs card-not-present
Stripe Integration|C|pay-stripe|Stripe objects;client-side Elements;server-side PaymentIntent flow;3D Secure;idempotency keys;test cards
Razorpay Integration|P|pay-razorpay|Razorpay order flow;checkout.js;server-side order creation;signature verification;UPI/netbanking/wallets;international cards;webhook events
Other Gateways|R|pay-others|PayPal;Square;Braintree;Adyen;regional gateways;aggregator vs payment facilitator
Webhooks for Payments|C|pay-webhooks|signature verification HMAC;idempotency;event ordering;deduplication;retrying failed event handlers;reconciling webhook vs polling
Subscriptions and Recurring Billing|C|pay-subscriptions|Stripe Billing objects;trial periods;upgrade/downgrade proration;pause/resume;failed payment recovery;metered billing
Handling Payment Failures|C|pay-failures|decline codes;retry logic;graceful degradation;card updater;account updater;user communication
Refunds and Disputes|P|pay-refunds|full vs partial refunds;Stripe refund flow;chargeback lifecycle;dispute evidence submission;prevention strategies
Multi-currency and Tax|R|pay-currency|presentment vs settlement currency;FX fees;automatic tax;VAT/GST for digital goods;price localisation
Payouts and Marketplaces|R|pay-payouts|Stripe Connect;platform vs direct accounts;split payments;instant payouts;KYC requirements;escrow patterns
PCI Compliance|C|pay-pci|PCI-DSS levels;scope reduction with hosted fields;SAQ A vs D;tokenization;never log card data;penetration testing requirements
Payment Security|C|pay-security|HTTPS everywhere;CSRF on payment endpoints;velocity checks;fraud signals;Stripe Radar rules;3DS2;IP geolocation checks
Invoice Generation|P|pay-invoices|programmatic PDF invoices;Stripe invoicing;tax breakdown;invoice numbering;send-and-remind flows;B2B net terms
# XLI|Practical SaaS Engineering
SaaS Architecture Patterns|C|saas-architecture|multi-tenant data models;tenant isolation;slug routing;feature flag per tenant
Authentication for SaaS|C|saas-auth|social login OAuth;magic link email;passkeys;organisation SSO SAML/OIDC;invitation flow;seat management
Onboarding Flow Engineering|P|saas-onboarding|signup funnel;email verification;guided setup wizard;empty states;first-run experience;activation metric tracking
User Roles and Teams|P|saas-teams|RBAC for SaaS;invitation with role;audit trail;transfer ownership;remove member;impersonation for support
Billing Integration End-to-End|C|saas-billing|linking Stripe Customer to DB user;plan limits enforcement;upgrade/downgrade UI;billing portal;usage-based billing
Usage Metering and Limits|P|saas-metering|counting API calls/tokens/storage per tenant;soft vs hard limits;limit enforcement middleware;overage notifications;fair-use policies
Email in SaaS|P|saas-email|transactional email;email templates;unsubscribe/suppression;email deliverability SPF/DKIM/DMARC;notification preferences
File Uploads in SaaS|P|saas-uploads|presigned S3 URLs;direct browser-to-S3 upload;virus scanning;size limits per plan;CDN delivery;tenant-scoped storage paths
Dashboards and Analytics|P|saas-analytics|per-tenant usage dashboards;admin overview;retention charts;feature adoption tracking;time-series storage;chart integration
Admin Panel Engineering|P|saas-admin|internal admin UI;impersonation;bulk operations;audit logs;feature flags per tenant;manual billing adjustments
SaaS API Design|C|saas-api|API keys;SDK design;versioning;webhooks for customers;rate limiting per API key;OpenAPI docs
Launch and Growth Engineering|R|saas-launch|landing page A/B tests;waitlist;referral system;product-led growth loops;NPS collection;churn prediction signals

`;

export type Level = "C" | "P" | "R";
export interface Chapter { id: number; title: string; level: Level; content: string[]; topics: string[]; part: string }
export interface Part { key: string; title: string; chapters: Chapter[] }

export const PARTS: Part[] = [];
let nextId = 0;
for (const line of RAW.trim().split("\n")) {
  if (line.startsWith("# ")) {
    const [key, title] = line.slice(2).split("|");
    PARTS.push({ key, title, chapters: [] });
    continue;
  }
  const [title, level, content, topics] = line.split("|");
  const part = PARTS[PARTS.length - 1];
  part.chapters.push({
    id: nextId++, title, level: level as Level, part: part.key,
    content: content ? content.split(",") : [], topics: topics.split(";").map(t => t.trim()),
  });
}
export const CHAPTERS = PARTS.flatMap(p => p.chapters);
export const byId = new Map(CHAPTERS.map(c => [c.id, c]));
export const LEVEL_NAME: Record<Level, string> = { C: "Core", P: "Practical", R: "Reference" };

/** All 350 chapters are fully written and built. */
export const BUILT_UPTO = CHAPTERS.length;

/** Chapter id for a content key: lets data files refer to chapters in a way that survives renumbering. */
export const idOf = (key: string): number => {
  const ch = CHAPTERS.find(c => c.content.includes(key));
  if (!ch) throw new Error(`unknown content key ${key}`);
  return ch.id;
};
