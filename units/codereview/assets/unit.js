/* ============================================================
   Roadmap Notes — Code Review unit
   Shared chrome: chapter manifest, sidebar, progress, pager.
   No dependencies. No parent-directory references.
   ============================================================ */

/* ---- 1. The manifest -------------------------------------- */
/* Add a filename to LIVE the moment its page exists on disk.   */

const CHAPTERS = [
  {n:1, f:"ch01-what-review-is-for.html", t:"What review is actually for",
   p:"Why review", d:"Defects, knowledge transfer, and the two things review is measurably bad at."},
  {n:2, f:"ch02-the-pyramid.html", t:"The review pyramid",
   p:"Why review", d:"Five layers, cheapest to change at the bottom — and why that inverts where attention should go."},
  {n:3, f:"ch03-what-to-automate.html", t:"What to automate",
   p:"Why review", d:"Formatters, linters, type checkers and CI: what each removes from the reviewer's plate, and what it does not."},

  {n:4, f:"ch04-size.html", t:"Size, and the number that governs everything",
   p:"The mechanics", d:"Detection rate against diff size, why 400 lines is the ceiling, and how to split a change that resists splitting."},
  {n:5, f:"ch05-reading-a-diff.html", t:"Reading a diff",
   p:"The mechanics", d:"An order of passes, what to look at first, and the code that is not in the diff."},
  {n:6, f:"ch06-writing-a-comment.html", t:"Writing a comment",
   p:"The mechanics", d:"Blocking versus advisory, the question form, and the comments that cost more than they save."},
  {n:7, f:"ch07-receiving-a-review.html", t:"Receiving a review",
   p:"The mechanics", d:"Separating the code from yourself, when to push back, and what to do with a comment you disagree with."},
  {n:8, f:"ch08-latency.html", t:"Latency, batching and the queue",
   p:"The mechanics", d:"Review as a queueing problem: why waiting time explodes near capacity and what that does to batch size."},

  {n:9, f:"ch09-correctness.html", t:"Correctness and edge cases",
   p:"What to look for", d:"The inputs nobody tested, boundary conditions, and error paths."},
  {n:10, f:"ch10-api-semantics.html", t:"API semantics",
   p:"What to look for", d:"The layer at the top of the pyramid: names, contracts, and what you cannot change later."},
  {n:11, f:"ch11-implementation.html", t:"Implementation semantics",
   p:"What to look for", d:"Complexity, coupling, hidden state, and the difference between clever and clear."},
  {n:12, f:"ch12-tests.html", t:"Tests",
   p:"What to look for", d:"What the tests assert, what they would catch, and coverage as a floor rather than a target."},
  {n:13, f:"ch13-security-and-data.html", t:"Security and data",
   p:"What to look for", d:"Input handling, secrets, migrations, and the changes that are irreversible."},

  {n:14, f:"ch14-culture.html", t:"Culture and disagreement",
   p:"Making it stick", d:"Tone, authority, deadlock, and the review that has gone on too long."},
  {n:15, f:"ch15-measuring.html", t:"Measuring review",
   p:"Making it stick", d:"Metrics that help, metrics that get gamed, and what a healthy review process looks like in numbers."},
  {n:16, f:"ch16-beyond-the-pr.html", t:"Beyond the pull request",
   p:"Making it stick", d:"Pairing, design review, post-merge review, and choosing the right one for the change."}
];

const LIVE = new Set([
  "ch01-what-review-is-for.html",
  "ch02-the-pyramid.html",
  "ch03-what-to-automate.html",
  "ch04-size.html",
  "ch05-reading-a-diff.html",
  "ch06-writing-a-comment.html",
  "ch07-receiving-a-review.html",
  "ch08-latency.html",
  "ch09-correctness.html",
  "ch10-api-semantics.html",
  "ch11-implementation.html",
  "ch12-tests.html",
  "ch13-security-and-data.html",
  "ch14-culture.html",
  "ch15-measuring.html",
  "ch16-beyond-the-pr.html"
]);

const UNIT = {
  title:"Code Review",
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
