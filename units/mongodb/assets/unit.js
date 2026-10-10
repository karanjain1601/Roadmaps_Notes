/* ============================================================
   Roadmap Notes — MongoDB unit
   One source of truth for the chapter list, plus the small
   behaviours every page shares: rail, progress, copy, keys.
   ============================================================ */

const CHAPTERS = [
  { f:"01-document-model.html", n:"01", t:"The document model",
    part:"Documents",
    d:"What actually changes when a row becomes a document — BSON, the schema that still exists but lives in your application, and the trade you are making.",
    tags:["bson","schema","tradeoffs"] },
  { f:"02-embed-or-reference.html", n:"02", t:"Embed or reference",
    part:"Documents",
    d:"The decision you make hundreds of times and cannot easily reverse: when to nest data inside a document and when to point at another one.",
    tags:["embedding","references","cardinality"] },
  { f:"03-modelling.html", n:"03", t:"Modelling for access patterns",
    part:"Documents",
    d:"The inversion from relational design: start from the queries, not the entities — and the patterns that follow from doing so.",
    tags:["access patterns","bucket","outlier","computed"] },

  { f:"04-queries.html", n:"04", t:"Queries and projection",
    part:"Working with data",
    d:"Finding documents, the operator set, matching inside arrays and nested objects, and the projection rules that surprise people.",
    tags:["find","operators","arrays","projection"] },
  { f:"05-aggregation.html", n:"05", t:"The aggregation pipeline",
    part:"Working with data",
    d:"Stages, the order that matters, $lookup and its limits, $group, faceting, and where the pipeline stops being the right tool.",
    tags:["pipeline","group","lookup","unwind"] },
  { f:"06-writing.html", n:"06", t:"Writing data",
    part:"Working with data",
    d:"Update operators, upserts, atomicity at the document level, bulk writes, and findAndModify for read-modify-write.",
    tags:["update","upsert","bulk","atomicity"] },

  { f:"07-indexes.html", n:"07", t:"Indexes",
    part:"Making it fast",
    d:"Single, compound and multikey indexes, the ESR rule for column order, partial and TTL indexes, and what each one costs.",
    tags:["compound","esr","multikey","ttl"] },
  { f:"08-explain.html", n:"08", t:"Reading explain output",
    part:"Making it fast",
    d:"executionStats, the stage tree, keys and docs examined against documents returned, and the ratios that identify the problem.",
    tags:["explain","stages","ratios","covered"] },
  { f:"09-performance.html", n:"09", t:"Performance patterns",
    part:"Making it fast",
    d:"The working set, document growth, pagination without skip, the antipatterns, and knowing when the query is not the problem.",
    tags:["working set","skip","antipatterns","wiredtiger"] },

  { f:"10-replica-sets.html", n:"10", t:"Replica sets",
    part:"Correctness",
    d:"Elections, the oplog, primary and secondary roles, what happens during a failover, and rollback of unreplicated writes.",
    tags:["elections","oplog","failover","rollback"] },
  { f:"11-concerns.html", n:"11", t:"Read and write concerns",
    part:"Correctness",
    d:"The durability and consistency dials most people never touch, what each guarantees, and what the defaults actually give you.",
    tags:["w:majority","readConcern","causal","staleness"] },
  { f:"12-transactions.html", n:"12", t:"Transactions",
    part:"Correctness",
    d:"Single-document atomicity, multi-document transactions and their real costs, and the design that usually avoids needing them.",
    tags:["atomicity","sessions","limits","patterns"] },

  { f:"13-sharding.html", n:"13", t:"Sharding",
    part:"At scale",
    d:"Choosing a shard key, chunks and balancing, targeted against scatter-gather queries, and why the key is nearly irreversible.",
    tags:["shard key","chunks","targeting","hashed"] },
  { f:"14-change-streams.html", n:"14", t:"Change streams and the oplog",
    part:"At scale",
    d:"Reacting to writes as they happen, resume tokens, ordering guarantees, and using MongoDB as an event source.",
    tags:["change streams","resume","cdc","oplog"] },
  { f:"15-security.html", n:"15", t:"Security",
    part:"At scale",
    d:"Authentication, role-based access, injection in a document database, encryption, and the defaults that have caused breaches.",
    tags:["rbac","injection","tls","encryption"] },
  { f:"16-operations.html", n:"16", t:"Operating it",
    part:"At scale",
    d:"Backups and point-in-time restore, upgrades, the metrics worth watching, and a diagnostic playbook.",
    tags:["backup","upgrades","monitoring","playbook"] },
  { f:"17-schema-evolution.html", n:"17", t:"Schema evolution",
    part:"At scale",
    d:"Migrating data with no ALTER TABLE: versioned documents, lazy migration, backfills, and schema validation.",
    tags:["versioning","backfill","validation","migration"] },

  { f:"18-choosing.html", n:"18", t:"Choosing MongoDB",
    part:"At scale",
    d:"An honest account of where the document model wins, where it loses to a relational database, and how to tell before you commit.",
    tags:["fit","comparison","honesty"] }
];

const UNIT = { title:"MongoDB", sub:"Databases line · 18 chapters", home:"../../index.html" };

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
