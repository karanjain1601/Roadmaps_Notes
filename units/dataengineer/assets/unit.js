/* ============================================================
   Roadmap Notes — Data Engineer unit
   Unit: Data Engineer · line: Data & AI

   One source of truth for the chapter list. The hub renders its
   rows from CHAPTERS, the counters derive from LIVE, and every
   chapter builds its own sidebar and pager from the same array.
   To mark a chapter ready, add its number to LIVE. Nothing else.
   ============================================================ */

var PARTS = [
  { p:"The discipline",
    d:"What the job actually is, the lifecycle every data platform follows, and how to choose between the hundred tools that claim to do it." },
  { p:"Where data comes from",
    d:"Source systems you do not control, how to detect that they changed, and how to agree a contract so the change does not break you." },
  { p:"Storage",
    d:"Object storage, file layout, dimensional modelling and the engine families — the decisions that constrain everything downstream." },
  { p:"Moving data",
    d:"Batch and stream, queues and logs, distributed compute and the orchestrator that keeps the whole thing in order." },
  { p:"Serving",
    d:"The half of the job that gets judged: analytics, dashboards, features for models and data pushed back into applications." },
  { p:"Running it",
    d:"Infrastructure, deployment, tests that catch bad data, observability, cost, and what to do at 3am." },
  { p:"Governance and practice",
    d:"Access, encryption, privacy law, lineage — then a full test of the unit." }
];

var CHAPTERS = [
  { f:"01-what-it-is.html", n:"01", t:"What data engineering is", part:0,
    d:"The job is owning production dependencies you did not create. Why the role exists, what separates it from analytics and science, and the blast radius that defines the work.",
    tags:["the role","dependencies","blast radius","skills"] },
  { f:"02-lifecycle.html", n:"02", t:"The lifecycle end to end", part:0,
    d:"Generation, ingestion, storage, transformation, serving — and the undercurrents that run beneath all five. Where latency accumulates and why reprocessing cost is decided early.",
    tags:["lifecycle","freshness","undercurrents","backfill"] },
  { f:"03-choosing.html", n:"03", t:"Choosing technologies", part:0,
    d:"Cost, team size, speed of iteration, lock-in and reversibility. A framework for the decision, and the total-cost model that makes the cheap option expensive.",
    tags:["build vs buy","tco","lock-in","modular"] },

  { f:"04-source-systems.html", n:"04", t:"Source systems", part:1,
    d:"Application databases, APIs, logs, mobile and IoT. What each one guarantees, what it does not, and why reading straight from production is the first mistake.",
    tags:["oltp","apis","logs","iot"] },
  { f:"05-change-data-capture.html", n:"05", t:"Change data capture", part:1,
    d:"Full snapshots, incremental queries and log-based CDC. Watermarks, tombstones, ordering guarantees, and how each method loses deletes.",
    tags:["cdc","wal","binlog","debezium"] },
  { f:"06-contracts.html", n:"06", t:"Data contracts and schema evolution", part:1,
    d:"Avro, Protobuf and JSON Schema; backward, forward and full compatibility; the registry that enforces it. Making an upstream change safe by construction.",
    tags:["schema","avro","compatibility","registry"] },

  { f:"07-storage-foundations.html", n:"07", t:"Storage foundations", part:2,
    d:"Block, file and object storage; durability against availability; consistency models. Why cheap object storage restructured the entire field.",
    tags:["object storage","durability","s3","hierarchy"] },
  { f:"08-file-formats.html", n:"08", t:"File formats and columnar layout", part:2,
    d:"CSV and JSON against Parquet, ORC and Avro. Row groups, encodings, compression and predicate pushdown — measured, not asserted.",
    tags:["parquet","columnar","compression","pushdown"] },
  { f:"09-modelling.html", n:"09", t:"Modelling for analytics", part:2,
    d:"Normal forms against dimensional modelling, star against snowflake, grain, and the six ways to handle a dimension that changes.",
    tags:["star schema","grain","scd","normalisation"] },
  { f:"10-engines.html", n:"10", t:"OLTP, OLAP and the engine families", part:2,
    d:"Relational, document, wide-column, key-value and graph. What each data model makes cheap, what it makes impossible, and how to pick without regret.",
    tags:["oltp","olap","nosql","graph"] },
  { f:"11-warehouse-lake.html", n:"11", t:"Warehouses, lakes and lakehouses", part:2,
    d:"Kimball and Inmon, the lake that became a swamp, and the table formats — Iceberg, Delta, Hudi — that put transactions back on object storage. Mesh and fabric, honestly assessed.",
    tags:["warehouse","lakehouse","iceberg","data mesh"] },

  { f:"12-batch-ingestion.html", n:"12", t:"Batch ingestion, ETL and ELT", part:3,
    d:"Extraction patterns, incremental loads, watermark bookkeeping, idempotency and the backfill. Why the T moved after the L, and when it should move back.",
    tags:["etl","elt","idempotency","watermarks"] },
  { f:"13-messaging.html", n:"13", t:"Messaging and streaming logs", part:3,
    d:"Queues against logs. Kafka's partitions, offsets and consumer groups; RabbitMQ's exchanges; SQS and SNS. At-most-once, at-least-once and what exactly-once really means.",
    tags:["kafka","queues","offsets","delivery"] },
  { f:"14-stream-processing.html", n:"14", t:"Stream processing", part:3,
    d:"Event time against processing time, tumbling and session windows, watermarks and late data. The stateful joins that make streaming hard.",
    tags:["windows","event time","watermarks","state"] },
  { f:"15-distributed-processing.html", n:"15", t:"Distributed processing", part:3,
    d:"MapReduce's idea, Spark's execution model, and the shuffle. Partitioning, skew, spill and the small-files problem — the four things that make a job slow.",
    tags:["spark","shuffle","skew","partitioning"] },
  { f:"16-orchestration.html", n:"16", t:"Orchestration", part:3,
    d:"DAGs, schedules and sensors. Airflow, dbt, Dagster and Prefect; retries, idempotent tasks, dependency graphs and data-aware scheduling.",
    tags:["airflow","dbt","dags","retries"] },

  { f:"17-serving-analytics.html", n:"17", t:"Serving analytics and BI", part:4,
    d:"Marts, semantic layers and metric definitions. Query performance for humans clicking dashboards, and Reverse ETL pushing the warehouse back into tools.",
    tags:["bi","semantic layer","marts","reverse etl"] },
  { f:"18-serving-ml.html", n:"18", t:"Serving ML and applications", part:4,
    d:"Feature stores, training and serving skew, point-in-time correctness, and embedding stores. What the model team needs that the dashboard team does not.",
    tags:["feature store","skew","point-in-time","vectors"] },

  { f:"19-infrastructure.html", n:"19", t:"Infrastructure, cloud and IaC", part:5,
    d:"Compute, storage and network primitives across AWS, Azure and GCP; serverless economics; declarative against imperative infrastructure, idempotency and state.",
    tags:["cloud","terraform","serverless","kubernetes"] },
  { f:"20-cicd-testing.html", n:"20", t:"CI/CD and testing data", part:5,
    d:"Testing code is not testing data. Unit, integration and end-to-end for pipelines, plus the assertion layer — freshness, volume, distribution, referential integrity.",
    tags:["ci","data tests","fixtures","contracts"] },
  { f:"21-observability.html", n:"21", t:"Observability, quality and cost", part:5,
    d:"The signals worth alerting on, lineage as a debugging tool, the six dimensions of data quality, and attributing spend to the query that caused it.",
    tags:["freshness","lineage","quality","finops"] },
  { f:"22-reliability.html", n:"22", t:"Reliability, backfills and incidents", part:5,
    d:"SLAs for data, replay and recovery, the backfill that takes down production, and running an incident when the output is wrong rather than absent.",
    tags:["slo","replay","recovery","incidents"] },

  { f:"23-governance.html", n:"23", t:"Security, privacy and governance", part:6,
    d:"Authentication against authorisation, encryption at rest and in transit, tokenisation, masking, catalogues, and what GDPR, CCPA and the EU AI Act actually require of a pipeline.",
    tags:["pii","encryption","masking","gdpr"] },
  { f:"24-practice.html", n:"24", t:"Practice", part:6,
    d:"A design checklist, a debugging routine, a searchable glossary of every term in the unit, and a quiz scored by part.",
    tags:["checklist","glossary","quiz"] }
];

/* Chapters that exist on disk. Add a number here when one lands. */
var LIVE = { 1:1, 2:1, 3:1, 4:1, 5:1, 6:1, 7:1, 8:1, 9:1, 10:1, 11:1, 12:1, 13:1, 14:1, 15:1, 16:1, 17:1, 18:1, 19:1, 20:1, 21:1, 22:1, 23:1, 24:1 };

var isLive = function (n) { return !!LIVE[parseInt(n, 10)]; };
var liveCount = function () { return Object.keys(LIVE).length; };

/* ============================================================
   Syntax painting — tokenise once, so no span ever nests
   ============================================================ */
var LANGS = {
  sql:    { com:"--", kw:"select from where group by order having join left right inner outer full on as with union all distinct insert into values update set delete create table view index primary key foreign references not null default cast case when then else end limit offset partition over row_number rank dense_rank lag lead sum count avg min max coalesce and or in exists between like is asc desc drop alter add column unique check begin commit rollback explain analyze merge using matched" },
  python: { com:"#",  kw:"def return if elif else for while in not and or is None True False import from as class try except finally raise with lambda yield assert pass break continue global await async del print len range enumerate zip map filter sorted sum min max abs int str float list dict set tuple type isinstance" },
  yaml:   { com:"#",  kw:"true false null yes no on off" },
  bash:   { com:"#",  kw:"if then else elif fi for while do done case esac function return local export echo cd mkdir rm cp mv cat grep awk sed sort uniq head tail wc curl set trap exit source" },
  json:   { com:null, kw:"true false null" }
};

function paint(el) {
  var lang = el.getAttribute("data-lang");
  var spec = LANGS[lang];
  var src = el.textContent;
  if (!spec) { el.textContent = src; return; }

  var kw = {};
  spec.kw.split(" ").forEach(function (w) { if (w) kw[w] = 1; });

  var comStart = spec.com ? spec.com.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&") : null;
  var parts = [
    "(\\/\\*[\\s\\S]*?\\*\\/)",
    comStart ? "(" + comStart + "[^\\n]*)" : "(\\u0000)",
    "('(?:[^'\\\\\\n]|\\\\.)*'|\"(?:[^\"\\\\\\n]|\\\\.)*\"|`(?:[^`\\\\]|\\\\.)*`)",
    "(\\b\\d[\\d_]*(?:\\.\\d+)?(?:[eE][-+]?\\d+)?\\b)",
    "([A-Za-z_][A-Za-z0-9_]*)"
  ];
  var re = new RegExp(parts.join("|"), "g");

  var out = "", last = 0, m;
  function esc(s) {
    return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }
  while ((m = re.exec(src)) !== null) {
    out += esc(src.slice(last, m.index));
    var cls = null, txt = m[0];
    if (m[1] || m[2]) cls = "c-com";
    else if (m[3]) cls = "c-str";
    else if (m[4]) cls = "c-num";
    else if (m[5]) {
      var lower = m[5].toLowerCase();
      if (kw[lower]) cls = "c-key";
      else if (src.charAt(re.lastIndex) === "(") cls = "c-fn";
    }
    out += cls ? '<span class="' + cls + '">' + esc(txt) + "</span>" : esc(txt);
    last = m.index + txt.length;
  }
  out += esc(src.slice(last));
  el.innerHTML = out;
}

/* ============================================================
   Shared page behaviours
   ============================================================ */
function wireCopy() {
  Array.prototype.forEach.call(document.querySelectorAll(".code"), function (block) {
    var btn = block.querySelector(".code-copy");
    var code = block.querySelector("code");
    if (!btn || !code) return;
    btn.addEventListener("click", function () {
      var text = code.textContent;
      var done = function () {
        var was = btn.textContent;
        btn.textContent = "Copied";
        setTimeout(function () { btn.textContent = was; }, 1400);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done, done);
      } else {
        var ta = document.createElement("textarea");
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        try { document.execCommand("copy"); } catch (e) {}
        document.body.removeChild(ta);
        done();
      }
    });
  });
}

function wireProgress() {
  var bar = document.getElementById("prog");
  var top = document.querySelector("button.top");
  function onScroll() {
    var h = document.documentElement;
    var max = h.scrollHeight - h.clientHeight;
    var y = window.pageYOffset || h.scrollTop;
    if (bar) bar.style.width = (max > 0 ? (y / max) * 100 : 0) + "%";
    if (top) top.classList.toggle("show", y > 700);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  onScroll();
  if (top) {
    top.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
}

/* Links to chapters that are not written yet become inert text
   with a tooltip, and repair themselves once LIVE grows. */
function guardForwardLinks() {
  var byFile = {};
  CHAPTERS.forEach(function (c) { byFile[c.f] = c; });
  Array.prototype.forEach.call(document.querySelectorAll("a[href]"), function (a) {
    var href = a.getAttribute("href").split("#")[0];
    var c = byFile[href];
    if (!c || isLive(c.n)) return;
    var span = document.createElement("span");
    span.className = "soon";
    span.textContent = a.textContent;
    span.title = "Chapter " + c.n + " is not written yet";
    a.parentNode.replaceChild(span, a);
  });
}

function buildSidebar() {
  var side = document.querySelector(".side ol");
  if (!side) return;
  var seen = {};
  Array.prototype.forEach.call(document.querySelectorAll("main section[id]"), function (s) {
    var h = s.querySelector("h2");
    if (!h || seen[s.id]) return;
    seen[s.id] = 1;
    var li = document.createElement("li");
    var a = document.createElement("a");
    a.href = "#" + s.id;
    a.textContent = h.textContent;
    li.appendChild(a);
    side.appendChild(li);
  });

  var links = side.querySelectorAll("a");
  var mark = function () {
    var best = null, bestTop = -1e9;
    Array.prototype.forEach.call(document.querySelectorAll("main section[id]"), function (s) {
      var top = s.getBoundingClientRect().top - 90;
      if (top <= 0 && top > bestTop) { bestTop = top; best = s.id; }
    });
    Array.prototype.forEach.call(links, function (a) {
      a.classList.toggle("on", a.getAttribute("href") === "#" + best);
    });
  };
  window.addEventListener("scroll", mark, { passive: true });
  mark();
}

function buildPager(idx) {
  var pager = document.querySelector(".pager");
  if (!pager) return;
  var prev = CHAPTERS[idx - 1], next = CHAPTERS[idx + 1];
  var side = function (c, label) {
    var wrap = document.createElement("div");
    if (!c) {
      wrap.className = "none";
      wrap.textContent = label === "prev" ? "Start of the unit" : "End of the unit";
      return wrap;
    }
    var lead = document.createElement("span");
    lead.className = "small";
    lead.textContent = (label === "prev" ? "Previous · " : "Next · ") + c.n + "  ";
    wrap.appendChild(lead);
    if (isLive(c.n)) {
      var a = document.createElement("a");
      a.href = c.f;
      a.textContent = c.t;
      wrap.appendChild(a);
    } else {
      var s = document.createElement("span");
      s.className = "soon";
      s.textContent = c.t;
      s.title = "Chapter " + c.n + " is not written yet";
      wrap.appendChild(s);
    }
    return wrap;
  };
  pager.appendChild(side(prev, "prev"));
  pager.appendChild(side(next, "next"));
}

function initChapter(file) {
  var idx = -1;
  CHAPTERS.forEach(function (c, i) { if (c.f === file) idx = i; });
  if (idx < 0) { console.error("initChapter: unknown file " + file); return; }

  Array.prototype.forEach.call(document.querySelectorAll(".code code[data-lang]"), paint);
  buildSidebar();
  buildPager(idx);
  wireCopy();
  wireProgress();
  guardForwardLinks();
}

function initHub() {
  var host = document.getElementById("parts");
  if (!host) return;

  PARTS.forEach(function (part, pi) {
    var chs = CHAPTERS.filter(function (c) { return c.part === pi; });
    var done = chs.filter(function (c) { return isLive(c.n); }).length;

    var sec = document.createElement("section");
    sec.className = "part";

    var head = document.createElement("div");
    head.className = "part-head";
    var h2 = document.createElement("h2");
    h2.textContent = part.p;
    var cnt = document.createElement("span");
    cnt.textContent = done === chs.length
      ? chs.length + " chapters, all written"
      : done + " of " + chs.length + " chapters written";
    head.appendChild(h2);
    head.appendChild(cnt);

    var rule = document.createElement("div");
    rule.className = "part-rule";
    var blurb = document.createElement("p");
    blurb.textContent = part.d;

    var rows = document.createElement("div");
    rows.className = "rows";

    chs.forEach(function (c) {
      var live = isLive(c.n);
      var row = document.createElement(live ? "a" : "div");
      row.className = "row" + (live ? " on-ready" : " off");
      if (live) row.href = c.f;

      var n = document.createElement("div");
      n.className = "n";
      n.textContent = c.n;

      var mid = document.createElement("div");
      var h3 = document.createElement("h3");
      h3.textContent = c.t;
      var p = document.createElement("p");
      p.textContent = c.d;
      var tags = document.createElement("div");
      tags.className = "tags";
      c.tags.forEach(function (t) {
        var s = document.createElement("span");
        s.className = "tag";
        s.textContent = t;
        tags.appendChild(s);
      });
      mid.appendChild(h3);
      mid.appendChild(p);
      mid.appendChild(tags);

      var st = document.createElement("div");
      st.className = "st";
      st.textContent = live ? "READY" : "SOON";

      row.appendChild(n);
      row.appendChild(mid);
      row.appendChild(st);
      rows.appendChild(row);
    });

    sec.appendChild(head);
    sec.appendChild(rule);
    sec.appendChild(blurb);
    sec.appendChild(rows);
    host.appendChild(sec);
  });

  var lc = document.getElementById("livecount");
  if (lc) lc.textContent = liveCount();
  var tc = document.getElementById("totalcount");
  if (tc) tc.textContent = CHAPTERS.length;
  var pc = document.getElementById("partcount");
  if (pc) pc.textContent = PARTS.length;

  wireProgress();
}
