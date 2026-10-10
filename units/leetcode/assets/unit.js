/* ============================================================
   Roadmap Notes — LeetCode Patterns unit
   Shared chrome: chapter manifest, sidebar, progress, pager.
   No dependencies. No parent-directory references.
   ============================================================ */

/* ---- 1. The manifest -------------------------------------- */
/* Add a filename to LIVE the moment its page exists on disk.   */

const CHAPTERS = [
  {n:1, f:"ch01-what-a-pattern-is.html", t:"What a coding pattern is",
   p:"Recognising the shape", d:"Why patterns exist, how to spot one from the problem statement, and the vocabulary that makes it fast."},
  {n:2, f:"ch02-how-to-practise.html", t:"How to practise",
   p:"Recognising the shape", d:"The struggle window, hints over solutions, debriefing, and revisiting cold — with the retention arithmetic."},

  {n:3, f:"ch03-arrays-and-hashing.html", t:"Arrays and hashing",
   p:"Linear scans", d:"Trading memory for time: seen-sets, frequency maps, the complement trick, and grouping by a canonical key."},
  {n:4, f:"ch04-two-pointers.html", t:"Two pointers",
   p:"Linear scans", d:"Opposite ends and same direction, why sortedness is the precondition, and in-place partitioning."},
  {n:5, f:"ch05-sliding-window.html", t:"Sliding window",
   p:"Linear scans", d:"Fixed and variable windows, the shrink condition, and why the inner loop does not make it quadratic."},
  {n:6, f:"ch06-prefix-sums.html", t:"Prefix sums and difference arrays",
   p:"Linear scans", d:"Range queries in constant time, the subarray-sum trick, and range updates in reverse."},
  {n:7, f:"ch07-intervals.html", t:"Intervals",
   p:"Linear scans", d:"Sort by start or by end, merging, overlap counting, and the sweep line."},

  {n:8, f:"ch08-binary-search.html", t:"Binary search on the answer",
   p:"Ordering and search", d:"Monotonic predicates, the boundary template that always terminates, and searching a rotated array."},
  {n:9, f:"ch09-monotonic-stack.html", t:"Stacks and monotonic stacks",
   p:"Ordering and search", d:"Next-greater-element, the amortised argument, and largest-rectangle in one pass."},
  {n:10, f:"ch10-heaps-and-top-k.html", t:"Heaps and top-k",
   p:"Ordering and search", d:"Which way to point the heap, k-way merge, and the two-heap running median."},

  {n:11, f:"ch11-linked-lists.html", t:"Linked lists and fast-slow pointers",
   p:"Linked structures", d:"Dummy heads, in-place reversal, cycle detection and the meeting-point proof."},
  {n:12, f:"ch12-tree-patterns.html", t:"Tree patterns",
   p:"Linked structures", d:"Top-down versus bottom-up recursion, what to return, level-order, and BST-specific shortcuts."},
  {n:13, f:"ch13-tries.html", t:"Tries",
   p:"Linked structures", d:"Prefix problems, wildcard search, and word-search over a board."},

  {n:14, f:"ch14-graph-traversal.html", t:"Graph traversal patterns",
   p:"Graphs", d:"Grids as graphs, flood fill, multi-source BFS, and building the graph you were not given."},
  {n:15, f:"ch15-topological-and-union-find.html", t:"Topological sort and union-find",
   p:"Graphs", d:"Dependency ordering, cycle detection, and the connectivity questions union-find answers instantly."},
  {n:16, f:"ch16-weighted-graphs.html", t:"Weighted graphs in interviews",
   p:"Graphs", d:"Dijkstra with a heap, Bellman-Ford for bounded hops, and recognising which one the constraints demand."},

  {n:17, f:"ch17-backtracking.html", t:"Backtracking",
   p:"Search and optimise", d:"The choose-explore-unchoose template, deduplicating, and pruning that actually pays."},
  {n:18, f:"ch18-dp-one-dimension.html", t:"One-dimensional DP",
   p:"Search and optimise", d:"From recursion to table, the state question, and the rolling-array space cut."},
  {n:19, f:"ch19-dp-two-dimensions.html", t:"Two-dimensional DP",
   p:"Search and optimise", d:"Grid paths, string pairs, knapsack, and reconstructing the answer rather than the value."},
  {n:20, f:"ch20-greedy.html", t:"Greedy",
   p:"Search and optimise", d:"The exchange argument, the sort that makes it work, and how to find a counterexample fast."},

  {n:21, f:"ch21-bit-manipulation.html", t:"Bit manipulation",
   p:"The rest", d:"XOR's cancellation property, isolating the lowest set bit, and subset enumeration by counting."},
  {n:22, f:"ch22-maths-and-geometry.html", t:"Maths and geometry",
   p:"The rest", d:"Overflow and modular arithmetic, Euclid, the sieve, and why geometry predicates must not divide."},
  {n:23, f:"ch23-design-problems.html", t:"Design problems",
   p:"The rest", d:"LRU, min-stack, randomised set — composing two structures so each does half the job."},
  {n:24, f:"ch24-the-interview.html", t:"The interview itself",
   p:"The rest", d:"Clarifying, narrating, choosing a complexity target, and what to do when you are stuck."}
];

const LIVE = new Set([
  "ch01-what-a-pattern-is.html",
  "ch02-how-to-practise.html",
  "ch03-arrays-and-hashing.html",
  "ch04-two-pointers.html",
  "ch05-sliding-window.html",
  "ch06-prefix-sums.html",
  "ch07-intervals.html",
  "ch08-binary-search.html",
  "ch09-monotonic-stack.html",
  "ch10-heaps-and-top-k.html",
  "ch11-linked-lists.html",
  "ch12-tree-patterns.html",
  "ch13-tries.html",
  "ch14-graph-traversal.html",
  "ch15-topological-and-union-find.html",
  "ch16-weighted-graphs.html",
  "ch17-backtracking.html",
  "ch18-dp-one-dimension.html",
  "ch19-dp-two-dimensions.html",
  "ch20-greedy.html",
  "ch21-bit-manipulation.html",
  "ch22-maths-and-geometry.html",
  "ch23-design-problems.html",
  "ch24-the-interview.html"
]);

const UNIT = {
  title:"LeetCode Patterns",
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
