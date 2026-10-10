/* ============================================================
   Roadmap Notes — PostgreSQL unit
   One source of truth for the chapter list, plus the small
   behaviours every page shares: rail, progress, copy, keys.
   ============================================================ */

const CHAPTERS = [
  { f:"01-architecture.html", n:"01", t:"What makes Postgres Postgres",
    part:"The engine",
    d:"The process model, the memory layout, and the handful of design decisions that explain most of the operational behaviour you will meet.",
    tags:["processes","shared buffers","design"] },
  { f:"02-mvcc.html", n:"02", t:"MVCC",
    part:"The engine",
    d:"Tuple versions, transaction ids, snapshots and visibility — why readers never block writers, and what that costs.",
    tags:["snapshots","xid","visibility"] },
  { f:"03-vacuum.html", n:"03", t:"Vacuum, bloat and freezing",
    part:"The engine",
    d:"The bill MVCC leaves behind: dead tuples, autovacuum tuning, the visibility map, and transaction id wraparound.",
    tags:["autovacuum","bloat","wraparound"] },
  { f:"04-wal.html", n:"04", t:"The write path",
    part:"The engine",
    d:"Write-ahead logging, checkpoints, fsync and the durability knobs — what happens between COMMIT and the data reaching disk.",
    tags:["wal","checkpoints","durability"] },

  { f:"05-storage.html", n:"05", t:"Physical storage",
    part:"Storage and access",
    d:"Pages and tuples, TOAST for oversized values, fillfactor, and why HOT updates decide how much work an UPDATE really does.",
    tags:["pages","toast","hot updates"] },
  { f:"06-indexes.html", n:"06", t:"Index types in depth",
    part:"Storage and access",
    d:"B-tree, GIN, GiST, BRIN, SP-GiST and hash — what each is actually for, and the ones people reach for too late.",
    tags:["gin","gist","brin","operator classes"] },
  { f:"07-planner.html", n:"07", t:"The planner and statistics",
    part:"Storage and access",
    d:"How costs are estimated, where statistics come from, extended statistics, and the settings that change the planner's mind.",
    tags:["cost model","statistics","planner settings"] },

  { f:"08-memory.html", n:"08", t:"Memory and resource configuration",
    part:"Configuring",
    d:"shared_buffers, work_mem, maintenance_work_mem and effective_cache_size — what each does and how to size them.",
    tags:["shared_buffers","work_mem","tuning"] },
  { f:"09-connections.html", n:"09", t:"Connections and pooling",
    part:"Configuring",
    d:"Why a process per connection makes pooling mandatory, PgBouncer's three modes, and what each one breaks.",
    tags:["pgbouncer","pool modes","max_connections"] },
  { f:"10-extensions.html", n:"10", t:"Extensions",
    part:"Configuring",
    d:"The ecosystem that makes Postgres what it is: the ones worth installing on day one, and how to evaluate the rest.",
    tags:["pg_stat_statements","postgis","pgvector"] },

  { f:"11-roles-auth.html", n:"11", t:"Roles and authentication",
    part:"Running it",
    d:"Roles, membership, pg_hba.conf, the authentication methods, SSL, and the default privileges that surprise people.",
    tags:["roles","pg_hba","ssl","grants"] },
  { f:"12-backup.html", n:"12", t:"Backup and recovery",
    part:"Running it",
    d:"Logical against physical, base backups and WAL archiving, point-in-time recovery, and testing the restore.",
    tags:["pg_dump","pgbackrest","pitr","rpo"] },
  { f:"13-replication.html", n:"13", t:"Replication",
    part:"Running it",
    d:"Streaming and logical replication, replication slots, synchronous commit, and reading from replicas safely.",
    tags:["streaming","logical","slots","lag"] },
  { f:"14-ha.html", n:"14", t:"High availability and failover",
    part:"Running it",
    d:"What automatic failover requires, Patroni and consensus, split-brain, fencing, and the client's side of the problem.",
    tags:["patroni","failover","split-brain"] },

  { f:"15-partitioning.html", n:"15", t:"Partitioning",
    part:"At scale",
    d:"Declarative partitioning, pruning, choosing a key, the operations it makes cheap, and the ones it makes worse.",
    tags:["range","pruning","retention"] },
  { f:"16-upgrades.html", n:"16", t:"Upgrades",
    part:"At scale",
    d:"Minor releases, major upgrades with pg_upgrade, the logical replication route, and extension compatibility.",
    tags:["pg_upgrade","logical","rollback"] },
  { f:"17-observability.html", n:"17", t:"Observability",
    part:"At scale",
    d:"The statistics views worth knowing, what to log and what not to, pgBadger, and the dashboard that catches problems early.",
    tags:["pg_stat_activity","logging","metrics"] },
  { f:"18-troubleshooting.html", n:"18", t:"Troubleshooting",
    part:"At scale",
    d:"A diagnostic playbook: the symptom, the query that identifies the cause, and the fix — for the failures that actually happen.",
    tags:["locks","playbook","incidents"] }
];

const UNIT = { title:"PostgreSQL", sub:"Databases line · 18 chapters", home:"../../index.html" };

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
