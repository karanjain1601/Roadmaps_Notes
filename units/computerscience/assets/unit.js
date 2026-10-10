/* ============================================================
   Roadmap Notes — Computer Science unit
   Shared chrome: chapter manifest, sidebar, progress, pager.
   No dependencies. No parent-directory references.
   ============================================================ */

/* ---- 1. The manifest -------------------------------------- */
/* Add a filename to LIVE the moment its page exists on disk.   */

const CHAPTERS = [
  {n:1,  f:"ch01-how-a-computer-runs-a-program.html", t:"How a computer runs a program",
   p:"The machine", d:"Stored programs, the fetch–decode–execute cycle, registers and the pipeline that hides the cost."},
  {n:2,  f:"ch02-binary-and-bitwise-operators.html", t:"Binary, bits and bitwise operators",
   p:"The machine", d:"Positional bases, two's complement, overflow, masks and shifts, and the endianness question."},
  {n:3,  f:"ch03-floating-point-arithmetic.html", t:"Floating point arithmetic",
   p:"The machine", d:"IEEE 754 layout, rounding, ULPs, cancellation, NaN, and how to compare two floats safely."},
  {n:4,  f:"ch04-character-encodings.html", t:"Character encodings",
   p:"The machine", d:"ASCII, code points, UTF-8 and UTF-16, grapheme clusters, normalisation and mojibake."},
  {n:5,  f:"ch05-memory-hierarchy-and-caches.html", t:"The memory hierarchy",
   p:"The machine", d:"Registers, L1–L3, DRAM and disk; cache lines, locality, and why layout beats cleverness."},

  {n:6,  f:"ch06-processes-threads-and-forking.html", t:"Processes, threads and forking",
   p:"The operating system", d:"Address spaces, fork and exec, thread models, and what is shared versus copied."},
  {n:7,  f:"ch07-scheduling-and-interrupts.html", t:"Scheduling, interrupts and context switches",
   p:"The operating system", d:"Round robin, priorities, CFS, preemption, system calls and the cost of a switch."},
  {n:8,  f:"ch08-locks-mutexes-and-semaphores.html", t:"Locks, mutexes and semaphores",
   p:"The operating system", d:"Race conditions, atomicity, deadlock's four conditions, and lock-free alternatives."},
  {n:9,  f:"ch09-memory-management.html", t:"Memory management",
   p:"The operating system", d:"Stack versus heap, virtual memory and page tables, allocators, leaks and garbage collection."},

  {n:10, f:"ch10-asymptotic-notation.html", t:"Asymptotic notation and runtimes",
   p:"Measuring computation", d:"Big-O, Big-Theta, Big-Omega, amortised cost, and the runtimes you meet in practice."},
  {n:11, f:"ch11-recursion-and-the-call-stack.html", t:"Recursion and the call stack",
   p:"Measuring computation", d:"Stack frames, base cases, tail calls, memoisation and turning recursion into iteration."},

  {n:12, f:"ch12-arrays-lists-stacks-queues.html", t:"Arrays, lists, stacks and queues",
   p:"Data structures", d:"Contiguous versus linked storage, dynamic arrays, ring buffers, deques and their trade-offs."},
  {n:13, f:"ch13-hash-tables.html", t:"Hash tables",
   p:"Data structures", d:"Hash functions, chaining, open addressing, load factor, resizing and adversarial collisions."},
  {n:14, f:"ch14-trees-and-binary-search-trees.html", t:"Trees and binary search trees",
   p:"Data structures", d:"Terminology, traversals, BST operations, degeneration, and the shapes trees can take."},
  {n:15, f:"ch15-balanced-trees.html", t:"Balanced trees",
   p:"Data structures", d:"AVL rotations, red-black invariants, 2-3 and B-trees, skip lists and their probabilistic balance."},
  {n:16, f:"ch16-heaps-and-priority-queues.html", t:"Heaps and priority queues",
   p:"Data structures", d:"The heap property, sift up and down, array embedding, heapify and heapsort."},
  {n:17, f:"ch17-tries-and-spatial-structures.html", t:"Tries and spatial structures",
   p:"Data structures", d:"Prefix trees, radix compaction, suffix arrays, and k-d trees for nearest-neighbour queries."},
  {n:18, f:"ch18-graphs.html", t:"Graphs: representation and traversal",
   p:"Data structures", d:"Adjacency lists and matrices, BFS and DFS, topological order, components and cycles."},

  {n:19, f:"ch19-sorting.html", t:"Sorting",
   p:"Algorithms", d:"Bubble to quicksort, stability, the comparison lower bound, and the sorts libraries actually ship."},
  {n:20, f:"ch20-searching-and-string-matching.html", t:"Searching and string matching",
   p:"Algorithms", d:"Binary search and its off-by-ones, KMP, Boyer–Moore, Rabin–Karp and suffix-array search."},
  {n:21, f:"ch21-shortest-paths-and-spanning-trees.html", t:"Shortest paths and spanning trees",
   p:"Algorithms", d:"Dijkstra, Bellman–Ford, A*, Prim and Kruskal, and when each one is the wrong choice."},
  {n:22, f:"ch22-greedy-backtracking-dp.html", t:"Greedy, backtracking and dynamic programming",
   p:"Algorithms", d:"Exchange arguments, pruning search trees, overlapping subproblems and building the table."},
  {n:23, f:"ch23-cache-replacement-policies.html", t:"Cache replacement policies",
   p:"Algorithms", d:"LRU, LFU, MFU, ARC and clock; hit-rate maths, and what Belady's optimum tells you."},

  {n:24, f:"ch24-complexity-classes.html", t:"Complexity classes",
   p:"Theory and mathematics", d:"P, NP, co-NP, NP-hard and NP-complete; reductions, TSP, knapsack and living with hardness."},
  {n:25, f:"ch25-probability-and-combinatorics.html", t:"Probability and combinatorics",
   p:"Theory and mathematics", d:"Counting, permutations, expectation, the birthday problem and randomised algorithms."},

  {n:26, f:"ch26-design-patterns-and-uml.html", t:"Design patterns and UML",
   p:"Systems in the large", d:"The GoF catalogue, dependency injection, null and type objects, and the five diagrams worth drawing."},
  {n:27, f:"ch27-databases-from-first-principles.html", t:"Databases from first principles",
   p:"Systems in the large", d:"The relational model, normalisation, ACID and BASE, indexes, locking and transactions."},
  {n:28, f:"ch28-networking.html", t:"Networking",
   p:"Systems in the large", d:"OSI and TCP/IP, sockets, DNS resolution, HTTP versions and the TLS handshake."},
  {n:29, f:"ch29-security-foundations.html", t:"Security foundations",
   p:"Systems in the large", d:"Encoding versus hashing versus encryption, password storage, public keys and the OWASP Top 10."},
  {n:30, f:"ch30-distributed-systems-and-scaling.html", t:"Distributed systems and scaling",
   p:"Systems in the large", d:"Vertical and horizontal scaling, load balancing, CDNs, CAP, queues and delivery guarantees."}
];

const LIVE = new Set([
  "ch01-how-a-computer-runs-a-program.html",
  "ch02-binary-and-bitwise-operators.html",
  "ch03-floating-point-arithmetic.html",
  "ch04-character-encodings.html",
  "ch05-memory-hierarchy-and-caches.html",
  "ch06-processes-threads-and-forking.html",
  "ch07-scheduling-and-interrupts.html",
  "ch08-locks-mutexes-and-semaphores.html",
  "ch09-memory-management.html",
  "ch10-asymptotic-notation.html",
  "ch11-recursion-and-the-call-stack.html",
  "ch12-arrays-lists-stacks-queues.html",
  "ch13-hash-tables.html",
  "ch14-trees-and-binary-search-trees.html",
  "ch15-balanced-trees.html",
  "ch16-heaps-and-priority-queues.html",
  "ch17-tries-and-spatial-structures.html",
  "ch18-graphs.html",
  "ch19-sorting.html",
  "ch20-searching-and-string-matching.html",
  "ch21-shortest-paths-and-spanning-trees.html",
  "ch22-greedy-backtracking-dp.html",
  "ch23-cache-replacement-policies.html",
  "ch24-complexity-classes.html",
  "ch25-probability-and-combinatorics.html",
  "ch26-design-patterns-and-uml.html",
  "ch27-databases-from-first-principles.html",
  "ch28-networking.html",
  "ch29-security-foundations.html",
  "ch30-distributed-systems-and-scaling.html"
]);

const UNIT = {
  title:"Computer Science",
  line:"Foundations",
  home:"index.html"
};

/* ---- 2. Chapter chrome ------------------------------------ */

function initChapter(file){
  const i = CHAPTERS.findIndex(c => c.f === file);
  if (i === -1) console.warn("initChapter: unknown file", file);
  const me = CHAPTERS[i];

  buildSideNav();
  buildJumpList(i);
  buildPager(i);
  wireCopyButtons();
  wireProgressBar();
  wireTopButton();
  wireScrollSpy();

  if (me) document.title = `${me.n}. ${me.t} — ${UNIT.title}`;
}

function buildSideNav(){
  const host = document.querySelector("nav.side [data-sections]");
  if (!host) return;
  const list = document.createElement("ol");
  document.querySelectorAll("main section[id]").forEach(sec => {
    const h = sec.querySelector("h2");
    if (!h) return;
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.href = "#" + sec.id;
    a.textContent = h.textContent.trim();
    a.dataset.for = sec.id;
    li.appendChild(a);
    list.appendChild(li);
  });
  host.appendChild(list);
}

function buildJumpList(i){
  const host = document.querySelector("nav.side [data-nearby]");
  if (!host) return;
  const near = CHAPTERS.slice(Math.max(0, i - 2), i + 3);
  const wrap = document.createElement("div");
  wrap.className = "side-jump";
  near.forEach(c => {
    const live = LIVE.has(c.f);
    const a = document.createElement(live ? "a" : "span");
    if (live) a.href = c.f;
    a.innerHTML = `<b>${c.n}</b> ${c.t}`;
    if (c.n === CHAPTERS[i]?.n) a.style.fontWeight = "600";
    if (!live) a.style.color = "var(--text-3)";
    wrap.appendChild(a);
  });
  host.appendChild(wrap);
}

function buildPager(i){
  const host = document.querySelector("[data-pager]");
  if (!host) return;
  const prev = CHAPTERS[i - 1], next = CHAPTERS[i + 1];
  if (prev && LIVE.has(prev.f)){
    const a = document.createElement("a");
    a.className = "prev";
    a.href = prev.f;
    a.innerHTML = `<span>Previous — chapter ${prev.n}</span><b>${prev.t}</b>`;
    host.appendChild(a);
  }
  if (next){
    const el = document.createElement(LIVE.has(next.f) ? "a" : "span");
    el.className = "next";
    if (LIVE.has(next.f)){
      el.href = next.f;
      el.innerHTML = `<span>Next — chapter ${next.n}</span><b>${next.t}</b>`;
    } else {
      el.className = "pager-soon";
      el.style.cssText = "display:block;max-width:46%;margin-left:auto;text-align:right;font-size:13px;color:#8FA9BF";
      el.innerHTML = `Next up: chapter ${next.n}, ${next.t} — not written yet.`;
    }
    host.appendChild(el);
  }
}

function wireCopyButtons(){
  document.querySelectorAll(".code").forEach(block => {
    const btn = block.querySelector(".code-copy");
    const pre = block.querySelector("pre");
    if (!btn || !pre) return;
    btn.addEventListener("click", async () => {
      const text = pre.innerText;
      try {
        await navigator.clipboard.writeText(text);
      } catch (e) {
        const ta = document.createElement("textarea");
        ta.value = text;
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select();
        try { document.execCommand("copy"); } catch (_) {}
        document.body.removeChild(ta);
      }
      btn.textContent = "Copied";
      btn.classList.add("done");
      setTimeout(() => { btn.textContent = "Copy"; btn.classList.remove("done"); }, 1600);
    });
  });
}

function wireProgressBar(){
  const bar = document.getElementById("prog");
  if (!bar) return;
  const paint = () => {
    const h = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = (h <= 0 ? 0 : Math.min(100, (window.scrollY / h) * 100)) + "%";
  };
  paint();
  window.addEventListener("scroll", paint, {passive:true});
  window.addEventListener("resize", paint);
}

function wireTopButton(){
  const btn = document.querySelector("button.top");
  if (!btn) return;
  btn.addEventListener("click", () => window.scrollTo({top:0, behavior:"smooth"}));
  const toggle = () => btn.classList.toggle("show", window.scrollY > 700);
  toggle();
  window.addEventListener("scroll", toggle, {passive:true});
}

function wireScrollSpy(){
  const links = [...document.querySelectorAll("nav.side a[data-for]")];
  if (!links.length) return;
  const map = new Map(links.map(a => [a.dataset.for, a]));
  const seen = new Map();
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => seen.set(e.target.id, e.intersectionRatio));
    let best = null, bestR = 0;
    seen.forEach((r, id) => { if (r > bestR){ bestR = r; best = id; } });
    if (!best) return;
    links.forEach(a => a.classList.toggle("on", a.dataset.for === best));
  }, {rootMargin:"-12% 0px -66% 0px", threshold:[0, .25, .5, 1]});
  map.forEach((_, id) => {
    const sec = document.getElementById(id);
    if (sec) io.observe(sec);
  });
}

/* ---- 3. Small helpers demos may use ----------------------- */

function $(sel, root){ return (root || document).querySelector(sel); }
function $$(sel, root){ return [...(root || document).querySelectorAll(sel)]; }

/** Write a value into a readout tile: <span class="v" id="...">. */
function setTile(id, value){
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

/** Fixed-width binary string for a non-negative integer. */
function bin(n, width){
  return (n >>> 0).toString(2).padStart(width, "0").slice(-width);
}

/** Group a string from the right, e.g. groupRight("11110000",4) -> "1111 0000". */
function groupRight(s, size, sep){
  sep = sep === undefined ? " " : sep;
  const out = [];
  for (let i = s.length; i > 0; i -= size) out.unshift(s.slice(Math.max(0, i - size), i));
  return out.join(sep);
}

/** Format a number with thousands separators, keeping full precision. */
function commas(n){
  const s = String(n);
  const m = s.match(/^(-?)(\d+)(\.\d+)?$/);
  if (!m) return s;
  return m[1] + m[2].replace(/\B(?=(\d{3})+(?!\d))/g, ",") + (m[3] || "");
}
