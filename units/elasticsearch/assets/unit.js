/* ============================================================
   Roadmap Notes — Elasticsearch unit
   One source of truth for the chapter list, plus the small
   behaviours every page shares: rail, progress, copy, keys.
   ============================================================ */

const CHAPTERS = [
  { f:"01-what-it-is.html", n:"01", t:"What Elasticsearch is",
    part:"The model",
    d:"A search engine that behaves enough like a database to be mistaken for one. The inverted index, the trade it makes, and the questions it answers that SQL cannot.",
    tags:["search engine","inverted index","elk","use cases"] },
  { f:"02-cluster-and-shards.html", n:"02", t:"Cluster, nodes and shards",
    part:"The model",
    d:"Index, shard, segment, node — the four layers, how a document finds its shard, and why the number of shards is a decision you make once.",
    tags:["shards","replicas","node roles","quorum"] },
  { f:"03-analysis.html", n:"03", t:"Analysis and the inverted index",
    part:"The model",
    d:"Text becomes terms before it is ever searched, and every surprising search result traces back to that step. Analyzers, tokenizers, and text against keyword.",
    tags:["analyzers","tokenizers","text vs keyword","_analyze"] },

  { f:"04-mappings.html", n:"04", t:"Mappings and field types",
    part:"Modelling",
    d:"Dynamic mapping will guess, and it guesses badly at scale. Field types, the ones that matter, multi-fields, and how a mapping explosion takes down a cluster.",
    tags:["mappings","dynamic","types","multi-fields"] },
  { f:"05-relationships.html", n:"05", t:"Objects, nested and relationships",
    part:"Modelling",
    d:"There are no joins. Four ways to model related data, the array-flattening trap that silently returns wrong results, and how to choose.",
    tags:["nested","object","join","denormalisation"] },
  { f:"06-indexing.html", n:"06", t:"Indexing documents",
    part:"Modelling",
    d:"CRUD, and what actually happens underneath — the translog, the refresh interval, near-real-time search, and getting bulk indexing right.",
    tags:["bulk","refresh","translog","versioning"] },

  { f:"07-query-dsl.html", n:"07", t:"The Query DSL",
    part:"Searching",
    d:"Query context against filter context, leaf against compound, and the bool query that every non-trivial search is built out of.",
    tags:["bool","filter","must","should"] },
  { f:"08-queries.html", n:"08", t:"The queries you will use",
    part:"Searching",
    d:"Match, term, range, phrase, prefix, wildcard, multi_match — what each one does to your input, and the one mistake everyone makes first.",
    tags:["match","term","range","multi_match"] },
  { f:"09-results.html", n:"09", t:"Controlling the results",
    part:"Searching",
    d:"Pagination that does not fall over at page 1000, sorting, source filtering, highlighting, and why deep paging is a design smell.",
    tags:["search_after","pit","sorting","highlighting"] },
  { f:"10-relevance.html", n:"10", t:"Relevance and BM25",
    part:"Searching",
    d:"Where the score comes from, how to read an explain output, and the levers — boosting, function score, and knowing precision from recall.",
    tags:["bm25","scoring","boosting","explain"] },
  { f:"11-query-languages.html", n:"11", t:"The other query languages",
    part:"Searching",
    d:"ES|QL, KQL, Lucene syntax, SQL and EQL all address the same data. What each is for, and which one belongs in your application.",
    tags:["esql","kql","sql","eql"] },

  { f:"12-aggregations.html", n:"12", t:"Aggregations",
    part:"Analytics",
    d:"The half of Elasticsearch that has nothing to do with search: buckets, metrics, nesting, pipelines — and where the numbers stop being exact.",
    tags:["terms","metrics","nesting","cardinality"] },
  { f:"13-vector-search.html", n:"13", t:"Vector and semantic search",
    part:"Analytics",
    d:"kNN, dense and sparse vectors, hybrid retrieval with RRF, and an honest assessment of when embeddings beat a well-tuned BM25.",
    tags:["knn","hnsw","elser","hybrid"] },

  { f:"14-performance.html", n:"14", t:"Performance and sizing",
    part:"Running it",
    d:"Shard sizing, the refresh interval, segment merging, the caches, and the heap rules that have not changed in a decade.",
    tags:["shard sizing","merging","caches","heap"] },
  { f:"15-lifecycle.html", n:"15", t:"Data lifecycle",
    part:"Running it",
    d:"Time-series data needs a plan: data streams, rollover, ILM, tiers, and snapshots that you have actually restored.",
    tags:["ilm","rollover","data streams","snapshots"] },
  { f:"16-security.html", n:"16", t:"Security",
    part:"Running it",
    d:"Authentication, roles, API keys, and the field- and document-level controls — plus the default that used to leave clusters open to the internet.",
    tags:["rbac","api keys","tls","dls"] },
  { f:"17-operations.html", n:"17", t:"Operating it",
    part:"Running it",
    d:"Cluster health, the CAT API, the metrics that predict incidents, upgrades, and a playbook for the day the cluster goes yellow.",
    tags:["cat api","health","circuit breakers","upgrades"] },
  { f:"18-choosing.html", n:"18", t:"Choosing Elasticsearch",
    part:"Running it",
    d:"Where it is the only sensible answer, where Postgres would have done, the OpenSearch fork and the licence, and what to use instead.",
    tags:["fit","opensearch","licensing","alternatives"] }
];

const UNIT = { title:"Elasticsearch", sub:"Databases line · 18 chapters", home:"../../index.html" };
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
