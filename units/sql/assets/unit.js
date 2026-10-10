/* ============================================================
   Roadmap Notes — SQL unit
   One source of truth for the chapter list, plus the small
   behaviours every page shares: rail, progress, copy, keys.
   ============================================================ */

const CHAPTERS = [
  { f:"01-thinking-in-sets.html", n:"01", t:"Thinking in sets",
    part:"Foundations",
    d:"Why SQL is declarative, what the relational model actually promises, and the mental shift from loops to sets that everything else depends on.",
    tags:["declarative","relations","sets"] },
  { f:"02-select.html", n:"02", t:"SELECT and the order things happen",
    part:"Foundations",
    d:"The clauses, and the logical execution order that explains why you cannot use an alias in WHERE and can in ORDER BY.",
    tags:["select","clauses","execution order"] },
  { f:"03-null.html", n:"03", t:"NULL and three-valued logic",
    part:"Foundations",
    d:"The single largest source of quiet wrong answers in SQL: unknown is not false, and it propagates everywhere.",
    tags:["null","unknown","coalesce"] },
  { f:"04-types-and-schema.html", n:"04", t:"Types and schema design",
    part:"Foundations",
    d:"Choosing types that prevent bad data, normalisation to the point it helps, keys, and the decisions that are expensive to reverse.",
    tags:["types","normalisation","keys"] },

  { f:"05-joins.html", n:"05", t:"Joins",
    part:"Combining data",
    d:"Inner, left, full, cross and self joins as set operations, the row-multiplication trap, and why ON and WHERE are not interchangeable.",
    tags:["inner","left","cross","fan-out"] },
  { f:"06-aggregation.html", n:"06", t:"Aggregation and GROUP BY",
    part:"Combining data",
    d:"What grouping does to the shape of a result, HAVING against WHERE, counting correctly, and the join-then-aggregate double-counting bug.",
    tags:["group by","having","count","distinct"] },
  { f:"07-subqueries-ctes.html", n:"07", t:"Subqueries and CTEs",
    part:"Combining data",
    d:"Scalar, IN, EXISTS and correlated subqueries, common table expressions for readability, and recursive CTEs for hierarchies.",
    tags:["exists","correlated","cte","recursive"] },
  { f:"08-window-functions.html", n:"08", t:"Window functions",
    part:"Combining data",
    d:"Aggregate without collapsing rows: ranking, running totals, lag and lead, and frames — the feature that removes most self-joins.",
    tags:["over","partition by","rank","frames"] },

  { f:"09-writing-data.html", n:"09", t:"Writing data",
    part:"Changing data",
    d:"INSERT, UPDATE, DELETE, upserts, RETURNING, and doing bulk changes without locking the table for an hour.",
    tags:["insert","update","upsert","batching"] },
  { f:"10-transactions.html", n:"10", t:"Transactions and isolation",
    part:"Changing data",
    d:"ACID in practice, the anomalies each isolation level permits, locking, deadlocks, and why SERIALIZABLE is not free.",
    tags:["acid","isolation","locks","deadlock"] },
  { f:"11-constraints.html", n:"11", t:"Constraints and integrity",
    part:"Changing data",
    d:"Primary and foreign keys, unique, check and exclusion constraints — pushing invariants into the database where they cannot be bypassed.",
    tags:["foreign key","unique","check","cascade"] },

  { f:"12-indexes.html", n:"12", t:"Indexes",
    part:"Making it fast",
    d:"What a B-tree index is, composite column order, covering and partial indexes, and the cost every index imposes on writes.",
    tags:["b-tree","composite","covering","partial"] },
  { f:"13-query-plans.html", n:"13", t:"Reading a query plan",
    part:"Making it fast",
    d:"EXPLAIN and EXPLAIN ANALYZE, scan and join node types, estimated against actual rows, and finding the line that costs you.",
    tags:["explain","analyze","scan types","estimates"] },
  { f:"14-performance.html", n:"14", t:"Performance patterns",
    part:"Making it fast",
    d:"Sargable predicates, keyset pagination, N+1, denormalisation, materialised views and knowing when the query is not the problem.",
    tags:["sargable","pagination","n+1","caching"] },

  { f:"15-security.html", n:"15", t:"Security",
    part:"In production",
    d:"Injection and why parameterisation is the only real fix, least privilege, row-level security, and handling sensitive columns.",
    tags:["injection","privileges","rls","pii"] },
  { f:"16-operations.html", n:"16", t:"Migrations and operations",
    part:"In production",
    d:"Zero-downtime schema changes, views, triggers and procedures, monitoring the queries that matter, and what to do at 3am.",
    tags:["migrations","views","triggers","monitoring"] }
];

const UNIT = { title:"SQL", sub:"Databases line · 16 chapters", home:"../../index.html" };

/* ---------- build the rail ---------- */
function buildRail(current){
  const rail = document.querySelector(".rail");
  if(!rail) return;
  const idx = CHAPTERS.findIndex(c => c.f === current);

  const items = CHAPTERS.map((c,i) => {
    const cur = c.f === current ? ' aria-current="page"' : "";
    const done = i < idx ? " done" : "";
    return `<li><a class="${done.trim()}"${cur} href="${c.f}"><span class="num">${c.n}</span><span>${c.t}</span></a></li>`;
  }).join("");

  rail.innerHTML =
    `<a class="rail-home" href="${UNIT.home}">` +
      `<svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true">` +
      `<path d="M10 3L5 8l5 5" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/></svg>` +
      `All roadmaps</a>` +
    `<a class="rail-title" href="index.html">${UNIT.title}</a>` +
    `<p class="rail-sub">${UNIT.sub}</p>` +
    `<ul class="routelist"><span class="fill" id="railfill"></span>${items}</ul>` +
    `<p class="rail-foot">Self-contained notes. Every page works on its own — open one, print it, or copy the folder somewhere else.</p>`;

  const fill = document.getElementById("railfill");
  const list = rail.querySelector(".routelist");
  const active = rail.querySelector('[aria-current="page"]');
  if(fill && active && list){
    const h = active.offsetTop - list.offsetTop + 11;
    fill.style.height = Math.max(0,h) + "px";
  }
  if(active) active.scrollIntoView({block:"nearest"});
}

/* ---------- crumb + pager ---------- */
function buildChrome(current){
  const i = CHAPTERS.findIndex(c => c.f === current);
  if(i < 0) return;
  const c = CHAPTERS[i], prev = CHAPTERS[i-1], next = CHAPTERS[i+1];

  const crumb = document.querySelector(".crumb");
  if(crumb){
    crumb.innerHTML =
      `<button class="menu-btn" id="navbtn" aria-label="Open chapter list">` +
      `<svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true"><path d="M2 4h12M2 8h12M2 12h12" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/></svg>Chapters</button>` +
      `<a href="index.html">${UNIT.title}</a><span class="sep">/</span><b>${c.n} · ${c.t}</b>`;
  }

  const pager = document.querySelector(".pager");
  if(pager){
    pager.innerHTML =
      (prev ? `<a href="${prev.f}"><span class="dir">Previous</span><span class="ttl">${prev.t}</span></a>`
            : `<a class="empty" href="index.html">.</a>`) +
      (next ? `<a class="next" href="${next.f}"><span class="dir">Next</span><span class="ttl">${next.t}</span></a>`
            : `<a class="next" href="index.html"><span class="dir">Finished</span><span class="ttl">Back to the chapter list</span></a>`);
  }

  document.addEventListener("keydown", e => {
    if(e.target.matches("input,textarea,select") || e.metaKey || e.ctrlKey || e.altKey) return;
    if(e.key === "ArrowLeft" && prev) location.href = prev.f;
    if(e.key === "ArrowRight" && next) location.href = next.f;
  });
}

/* ---------- reading progress ---------- */
function readingProgress(){
  const bar = document.querySelector(".scrollbar");
  const pct = document.querySelector(".readpct");
  if(!bar) return;
  const tick = () => {
    const h = document.documentElement.scrollHeight - window.innerHeight;
    const p = h > 0 ? Math.min(100, Math.max(0, (window.scrollY / h) * 100)) : 100;
    bar.style.width = p + "%";
    if(pct) pct.textContent = Math.round(p) + "%";
  };
  window.addEventListener("scroll", tick, {passive:true});
  window.addEventListener("resize", tick);
  tick();
}

/* ---------- copy buttons on code blocks ---------- */
function copyButtons(){
  document.querySelectorAll(".code").forEach(block => {
    const btn = block.querySelector(".copy");
    const pre = block.querySelector("pre");
    if(!btn || !pre) return;
    btn.addEventListener("click", async () => {
      const text = pre.innerText;
      try{
        await navigator.clipboard.writeText(text);
      }catch(err){
        const ta = document.createElement("textarea");
        ta.value = text; ta.style.position = "fixed"; ta.style.opacity = "0";
        document.body.appendChild(ta); ta.select();
        try{ document.execCommand("copy"); }catch(e){}
        document.body.removeChild(ta);
      }
      const was = btn.textContent;
      btn.textContent = "Copied";
      btn.classList.add("done");
      setTimeout(() => { btn.textContent = was; btn.classList.remove("done"); }, 1600);
    });
  });
}

/* ---------- lightweight syntax highlighting ---------- */
const KEYWORDS = {
  py:"def class return if elif else for while in not and or is None True False import from as with try except finally raise yield lambda await async pass break continue global assert del",
  js:"const let var function return if else for while of in new class extends import from export default await async try catch finally throw typeof instanceof null undefined true false this switch case break continue interface type enum implements public private readonly",
  sh:"if then fi else elif for do done while case esac export echo cd curl pip npm npx uv python node docker git set source local return function",
  json:"true false null",
  sql:"select from where group by order limit join left right inner outer on as insert into values update set delete create table index with distinct having union all"
};
function escapeHtml(s){
  return s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
}
function highlight(){
  document.querySelectorAll(".code").forEach(block => {
    const pre = block.querySelector("pre");
    if(!pre || pre.dataset.hl === "1") return;
    const lang = (block.dataset.lang || "").toLowerCase();
    const key = lang.startsWith("py") ? "py"
      : (lang.startsWith("js") || lang.startsWith("ts")) ? "js"
      : (lang.startsWith("ba") || lang.startsWith("sh") || lang.startsWith("con")) ? "sh"
      : lang.startsWith("json") ? "json"
      : lang.startsWith("sql") ? "sql" : null;
    if(!key){ pre.dataset.hl = "1"; return; }

    const words = KEYWORDS[key].split(" ").join("|");
    const re = new RegExp(
      "(#[^\\n]*|//[^\\n]*|--[^\\n]*)" +                                   // 1 comment
      "|(\"\"\"[\\s\\S]*?\"\"\"|\"(?:[^\"\\\\\\n]|\\\\.)*\"" +
        "|'(?:[^'\\\\\\n]|\\\\.)*'|`(?:[^`\\\\]|\\\\.)*`)" +               // 2 string
      "|\\b(\\d+(?:\\.\\d+)?)\\b" +                                        // 3 number
      "|\\b(" + words + ")\\b" +                                           // 4 keyword
      "|\\b([A-Za-z_][A-Za-z0-9_]*)(?=\\()",                               // 5 call
      "g");

    const src = escapeHtml(pre.textContent);
    pre.innerHTML = src.replace(re, (m, c, s, n, k, f) => {
      if(c) return '<span class="t-c">' + c + "</span>";
      if(s) return '<span class="t-s">' + s + "</span>";
      if(n) return '<span class="t-n">' + n + "</span>";
      if(k) return '<span class="t-k">' + k + "</span>";
      if(f) return '<span class="t-f">' + f + "</span>";
      return m;
    });
    pre.dataset.hl = "1";
  });
}

/* ---------- mobile nav ---------- */
function mobileNav(){
  const scrim = document.querySelector(".scrim");
  document.addEventListener("click", e => {
    if(e.target.closest("#navbtn")) document.body.classList.toggle("nav-open");
    else if(e.target === scrim) document.body.classList.remove("nav-open");
  });
  document.addEventListener("keydown", e => {
    if(e.key === "Escape") document.body.classList.remove("nav-open");
  });
}

/* ---------- boot ---------- */
function initChapter(file){
  buildRail(file);
  buildChrome(file);
  readingProgress();
  highlight();
  copyButtons();
  mobileNav();
}

if(typeof window !== "undefined"){
  window.CHAPTERS = CHAPTERS;
  window.initChapter = initChapter;
}
