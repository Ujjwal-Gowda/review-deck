// Ordered reading lists for common goals, written with stable content keys (survive renumbering).
import { idOf, PARTS } from "./curriculum";
const part = (t: string) => PARTS.find(p => p.title === t)!.chapters.map(c => c.id);
const shared = () => part("Languages: Shared Concepts");
const T = (name: string, desc: string, keys: string[]) => ({ name, desc, chapters: keys.map(idOf) });
export const TRACKS: { name: string; desc: string; chapters: number[] }[] = [
  T("Core foundations", "Everyone starts here: how programs run, the building blocks, terminal, git, memory, algorithms, design and testing.",
    ["c00","c01","n02","n03","n04","c02","c03","c04","c05","n11","c06","c07","c08","c09","n16","c17","n43","n44","n45","n20","n21","c10","c12","c11","c21","n34","c13","c14","c16"]),
  T("Backend engineer", "Build and run APIs: HTTP, auth, databases, queues, containers, observability.",
    ["c35","c36","c24","n61","n62","n63","n64","n80","n81","n82","n83","n84","n85","n86","n90","n91","c25","n93","n94","n95","n96","n97","n99","n100","n102","n106","n112","n114","n118","n120","n154","n155","c26","n177","n182"]),
  T("Frontend engineer", "The browser, HTML/CSS/JS/TS in depth, React, Next.js, performance and accessibility.",
    ["c35","n63","n65","n66","n67","n68","n69","n70","n71","n72","n73","n74","n75","n76","n77","n78","n79","n107"]),
  T("DevOps / SRE", "Linux, containers, CI/CD, cloud, Kubernetes, infrastructure as code, observability and reliability.",
    ["c17","n53","n54","n55","n56","n57","n58","n59","n112","n113","n114","n115","n116","n117","n118","n119","n120","n121","n122","n123","n124","n125","n126","n127","n128","n129","n130","n131","n132","n133","n134","n135","n136","n137","n138","n139","n140","n141","n142","n143","n144","n145","n146","n147","n148","n149","n150","n151","n152","n153","n154","n155","n156","n157","n158","n159","n160","n161"]),
  T("AI engineer", "ML to LLMs to RAG, tools, agents and MCP, then evaluation, cost and reliability in production.",
    ["c33","c27","n194","n195","n196","n197","n198","n199","n200","n201","c29","n203","n204","n205","n206","n207","c28","c31","n210","n211","n212","n213","n214","n215","c30","n217","n218","n219","n220","c32","n222","n223","n224","n225","n226","n227","n228","n229","n230","n231","n232","n233","n234"]),
  T("Systems (C · Rust · Go)", "Close to the metal: representation, memory, OS, concurrency and performance.",
    ["n02","n03","n04","c22","x-linking","c23","x-io","c10","c20","n27","c38","c37","c36","n186","n187","n188","n111"]),
  T("System design", "Distributed systems fundamentals, then designing and defending real architectures.",
    ["n35","n169","n170","n171","n172","n173","n174","n175","n176","n177","n178","n179","n180","n181","n182","n183","n184","n185","n252"]),
  T("Project ladder", "Twelve builds, each extending the last, from a CLI to a production AI platform.",
    ["n235","n236","n237","n238","n239","n240","n241","n242","n243","n244","n245","n246"]),
  T("Production engineering", "Everything that turns working code into a service you can trust in production.",
    ["x-path","n40","n165","x-health","n154","n155","n156","n161","n160","n177","x-ratelimit","n182","n90","n91","n99","n152","n153","n125","x-prodtest","n186","n110","x-prodready","x-operate","n251"]),
  T("Security (continuous)", "Security at every layer: OS, code, network, browser, identity, data, pipeline, cloud and AI.",
    ["x-secmap","n55","n57","n64","n70","n84","n85","n86","c26","n163","n164","n165","n123","n168","n166","n132","n167","n226"]),
  { name: "Data structures & algorithms", desc: "Every core structure and algorithm, easy to follow with pictures and step-by-step traces, then the problem-solving patterns.", chapters: [...part("Data Structures & Algorithms")] },
  ...["JavaScript", "TypeScript", "Python", "Go", "Rust", "C"].map(lang => ({
    name: `${lang} in depth`, desc: `The shared language concepts, then every ${lang} fundamental in detail, plus the cheat sheet.`,
    chapters: [...shared(), ...part(lang)],
  })),
  T("AI integration in apps", "How to wire AI into a real product: text generation, streaming, embeddings, chatbots, search, agents and cost control.",
    ["ai-overview","ai-text-gen","ai-embeddings","ai-chatbot","ai-search","ai-ux","ai-agents-product","ai-cost-control","ai-reliability","ai-prompting","ai-testing","ai-image-gen","ai-speech","ai-feature-flags"]),
  T("Payment gateways", "Everything money: fundamentals, Stripe, Razorpay, webhooks, subscriptions, failures, refunds, PCI and security.",
    ["pay-fundamentals","pay-stripe","pay-razorpay","pay-webhooks","pay-subscriptions","pay-failures","pay-refunds","pay-pci","pay-security","pay-invoices","pay-currency","pay-payouts","pay-others"]),
  T("Practical SaaS engineering", "Build a full SaaS product: multi-tenancy, auth, onboarding, billing, metering, email, uploads, admin and growth.",
    ["saas-architecture","saas-auth","saas-onboarding","saas-teams","saas-billing","saas-metering","saas-email","saas-uploads","saas-analytics","saas-admin","saas-api","saas-launch"]),
];
