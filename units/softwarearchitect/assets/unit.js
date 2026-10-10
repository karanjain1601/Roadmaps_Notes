/* ============================================================
   Roadmap Notes — Software Architect unit
   Shared chrome: chapter manifest, sidebar, progress, pager.
   No dependencies. No parent-directory references.
   ============================================================ */

/* ---- 1. The manifest -------------------------------------- */

const CHAPTERS = [
  {n:1, f:"ch01-what-an-architect-decides.html", t:"What an architect actually decides",
   p:"The role", d:"Decisions rather than code: which ones carry, and how few of them there are."},
  {n:2, f:"ch02-levels.html", t:"Application, solution, enterprise",
   p:"The role", d:"Three levels of architecture, what changes between them, and why the title means different jobs."},
  {n:3, f:"ch03-responsibilities.html", t:"The work that is not deciding",
   p:"The role", d:"Elicitation, documentation, standards and coaching — where the time actually goes."},
  {n:4, f:"ch04-staying-technical.html", t:"Staying technical",
   p:"The role", d:"How fast technical currency decays, how much code to write, and what you lose when you stop."},

  {n:5, f:"ch05-reversibility.html", t:"Reversibility, and the cost of being wrong",
   p:"Deciding", d:"One-way and two-way doors, and how to tell which one you are standing in front of."},
  {n:6, f:"ch06-options.html", t:"Options and deferring",
   p:"Deciding", d:"What a deferred decision is worth, and when waiting stops paying."},
  {n:7, f:"ch07-estimation.html", t:"Estimation and how wrong you are",
   p:"Deciding", d:"Error distributions, the shape of overrun, and what a range is actually claiming."},
  {n:8, f:"ch08-tradeoffs.html", t:"Trade-offs you cannot escape",
   p:"Deciding", d:"CAP, consistency, latency and cost — the constraints that are not engineering problems."},
  {n:9, f:"ch09-writing-it-down.html", t:"Writing a decision down",
   p:"Deciding", d:"Decision records, what they must contain, and the half-life of an undocumented choice."},
  {n:10, f:"ch10-being-overruled.html", t:"Being overruled",
   p:"Deciding", d:"Authority without power, when to escalate, and what to do with a decision you disagree with."},

  {n:11, f:"ch11-coupling.html", t:"Coupling and Conway's law",
   p:"Structure", d:"Why the system takes the shape of the organisation, measured — and what to do about it."},
  {n:12, f:"ch12-services.html", t:"Layers, services and the monolith question",
   p:"Structure", d:"What splitting buys, what it costs, and the size at which it stops paying."},
  {n:13, f:"ch13-data.html", t:"Data: the hardest thing to change",
   p:"Structure", d:"Schema, ownership, consistency boundaries and the migrations you cannot undo."},
  {n:14, f:"ch14-integration.html", t:"Integration and team boundaries",
   p:"Structure", d:"Contracts, versioning, and the interfaces that are really org charts."},
  {n:15, f:"ch15-cross-cutting.html", t:"Cross-cutting concerns",
   p:"Structure", d:"Authentication, observability, configuration — the things that touch everything."},
  {n:16, f:"ch16-evolution.html", t:"Evolution and the strangler",
   p:"Structure", d:"Replacing a system while it runs, and why big-bang rewrites fail predictably."},

  {n:17, f:"ch17-communicating.html", t:"Communicating architecture",
   p:"Influence", d:"Diagrams that survive contact, the audiences you have, and what each needs."},
  {n:18, f:"ch18-standards.html", t:"Standards, and getting them adopted",
   p:"Influence", d:"Why mandates fail, what adoption actually costs, and the paved-road alternative."},
  {n:19, f:"ch19-coaching.html", t:"Coaching and the multiplier",
   p:"Influence", d:"The arithmetic of teaching against doing, and where an architect's leverage really is."},
  {n:20, f:"ch20-measuring.html", t:"Measuring an architecture",
   p:"Influence", d:"Which properties are observable, which are not, and what a healthy system looks like in numbers."}
];

const LIVE = new Set([
  "ch01-what-an-architect-decides.html",
  "ch02-levels.html",
  "ch03-responsibilities.html",
  "ch04-staying-technical.html",
  "ch05-reversibility.html",
  "ch06-options.html",
  "ch07-estimation.html",
  "ch08-tradeoffs.html",
  "ch09-writing-it-down.html",
  "ch10-being-overruled.html",
  "ch11-coupling.html",
  "ch12-services.html",
  "ch13-data.html",
  "ch14-integration.html"
]);

const UNIT = {
  title:"Software Architect",
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
