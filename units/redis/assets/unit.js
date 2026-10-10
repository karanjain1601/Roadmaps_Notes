/* ============================================================
   Roadmap Notes — Redis unit
   One source of truth for the chapter list, plus the small
   behaviours every page shares: rail, progress, copy, keys.
   ============================================================ */

const CHAPTERS = [
  { f:"01-memory-and-the-thread.html", n:"01", t:"Memory and the thread",
    part:"The model",
    d:"Two decisions explain nearly everything Redis does: the data lives in RAM, and one thread executes every command. What that buys, and what it costs.",
    tags:["in-memory","single-threaded","atomicity","licensing"] },
  { f:"02-keys-and-expiry.html", n:"02", t:"Keys and expiry",
    part:"The model",
    d:"There is no schema, so the key namespace is your schema — naming, TTLs, how expiry actually works, and the commands that will take your server down.",
    tags:["keyspace","ttl","scan","keys"] },

  { f:"03-strings.html", n:"03", t:"Strings, counters and bitmaps",
    part:"The structures",
    d:"The simplest type, and far more than a place to put text: atomic counters, compare-and-set, bit operations and the encodings underneath.",
    tags:["set","incr","setnx","bitmaps"] },
  { f:"04-lists-hashes-sets.html", n:"04", t:"Lists, hashes and sets",
    part:"The structures",
    d:"Three structures that cover most of what people actually build — queues, objects and membership — with the operations that make each one worth choosing.",
    tags:["lists","hashes","sets","encodings"] },
  { f:"05-sorted-sets.html", n:"05", t:"Sorted sets",
    part:"The structures",
    d:"The type with no real equivalent in any other database, and the one that quietly solves leaderboards, priority queues, rate limits and time-ordered indexes.",
    tags:["zset","ranges","leaderboards","skip list"] },
  { f:"06-streams.html", n:"06", t:"Streams",
    part:"The structures",
    d:"An append-only log with consumer groups, acknowledgements and replay — the type to reach for when pub/sub is not enough.",
    tags:["xadd","consumer groups","xautoclaim","trimming"] },

  { f:"07-caching.html", n:"07", t:"Caching",
    part:"Patterns",
    d:"The dominant use case, done properly: cache-aside, invalidation, stampedes, negative caching, and what to do when the cache is wrong.",
    tags:["cache-aside","stampede","invalidation","ttl"] },
  { f:"08-atomicity.html", n:"08", t:"Transactions, Lua and functions",
    part:"Patterns",
    d:"Three ways to make several operations indivisible, what MULTI actually guarantees, and why a Lua script is usually the right answer.",
    tags:["multi","watch","lua","functions"] },
  { f:"09-locking.html", n:"09", t:"Locking and coordination",
    part:"Patterns",
    d:"Distributed locks that mostly work, the failure modes nobody mentions, fencing tokens, and the honest limits of Redlock.",
    tags:["locks","fencing","redlock","leases"] },
  { f:"10-rate-limiting.html", n:"10", t:"Rate limiting and counting",
    part:"Patterns",
    d:"Fixed windows, sliding windows, token buckets and probabilistic counting — four algorithms, each with the Redis primitive that fits it.",
    tags:["windows","token bucket","hyperloglog","cardinality"] },
  { f:"11-pubsub.html", n:"11", t:"Pub/Sub and messaging",
    part:"Patterns",
    d:"Fire-and-forget delivery, keyspace notifications, sharded channels, and knowing when you actually wanted a stream.",
    tags:["publish","subscribe","notifications","delivery"] },

  { f:"12-memory.html", n:"12", t:"Memory and eviction",
    part:"Making it work",
    d:"Where the memory actually goes, the eviction policies and what each one means, fragmentation, and how to find the key that is eating your server.",
    tags:["maxmemory","policies","fragmentation","encodings"] },
  { f:"13-persistence.html", n:"13", t:"Persistence",
    part:"Making it work",
    d:"RDB, AOF and what durability means for a system whose whole pitch is speed — plus the fork that doubles your memory when you least expect it.",
    tags:["rdb","aof","fsync","fork"] },
  { f:"14-performance.html", n:"14", t:"Performance",
    part:"Making it work",
    d:"One thread means one slow command blocks everything. Pipelining, latency measurement, the commands to ban, and where the time actually goes.",
    tags:["pipelining","latency","slowlog","big keys"] },

  { f:"15-replication.html", n:"15", t:"Replication and Sentinel",
    part:"Running it",
    d:"Asynchronous replication and what it means for durability, automatic failover with Sentinel, and the writes you will lose.",
    tags:["replicas","sentinel","failover","wait"] },
  { f:"16-cluster.html", n:"16", t:"Cluster",
    part:"Running it",
    d:"Hash slots, resharding, multi-key operations and hash tags, and the constraints cluster mode places on everything in this unit.",
    tags:["slots","hash tags","resharding","constraints"] },
  { f:"17-operations.html", n:"17", t:"Operating it",
    part:"Running it",
    d:"Security defaults that have caused breaches, configuration, upgrades, the metrics worth watching, and a diagnostic playbook.",
    tags:["security","acl","monitoring","playbook"] },

  { f:"18-choosing.html", n:"18", t:"Choosing Redis",
    part:"Running it",
    d:"Where it is the obvious answer, where it is quietly the wrong one, the licence situation and the forks, and what to use instead.",
    tags:["fit","valkey","licensing","alternatives"] }
];

const UNIT = { title:"Redis", sub:"Databases line · 18 chapters", home:"../../index.html" };

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
