/* ============================================================
   Roadmap Notes — MLOps unit
   Unit: MLOps · line: Data & AI

   One source of truth for the chapter list. The hub renders its
   rows from CHAPTERS, the counters derive from LIVE, and every
   chapter builds its own sidebar and pager from the same array.
   To mark a chapter ready, add its number to LIVE. Nothing else.
   ============================================================ */

var PARTS = [
  { p:"Foundations",
    d:"What MLOps is for, why a model is a harder artefact to ship than a service, and the reproducibility that everything else rests on." },
  { p:"The pipeline",
    d:"Turning a notebook into something that runs on a schedule: orchestration, data contracts, features, and training as code." },
  { p:"Tracking and provenance",
    d:"Knowing which model is running, what produced it, and being able to answer that six months later." },
  { p:"Serving",
    d:"Batch, online and streaming inference, and the latency, throughput and cost arithmetic that decides between them." },
  { p:"Operating",
    d:"Monitoring at the three levels, retraining triggers, incidents, and the platform the whole thing sits on." }
];

var CHAPTERS = [
  { f:"01-why.html", n:"01", t:"Why models are hard to ship", part:0,
    d:"The failure MLOps exists to prevent, why a model is not a service, and the three things that must be versioned together.",
    tags:["scope","artefacts","failure modes"] },
  { f:"02-reproducibility.html", n:"02", t:"Reproducibility", part:0,
    d:"What it takes to rebuild the same model twice, where nondeterminism enters, and how much of it actually matters.",
    tags:["seeds","determinism","environments"] },
  { f:"03-versioning.html", n:"03", t:"Versioning code, data and models", part:0,
    d:"Three artefacts with different lifecycles, content addressing, and the identifier that ties a prediction to its origin.",
    tags:["git","dvc","hashing","lineage"] },
  { f:"04-pipelines.html", n:"04", t:"From notebook to pipeline", part:1,
    d:"Decomposing a training script into steps, what makes a step cacheable, and the cost of getting the boundaries wrong.",
    tags:["steps","caching","idempotence"] },
  { f:"05-orchestration.html", n:"05", t:"Orchestration", part:1,
    d:"DAGs, scheduling, retries and backfills \u2014 and the critical path arithmetic that says where parallelism pays.",
    tags:["airflow","dags","retries","backfill"] },
  { f:"06-data-contracts.html", n:"06", t:"Data validation and contracts", part:1,
    d:"Schema, distribution and semantic checks, where each one fires, and how to set thresholds that catch faults without crying wolf.",
    tags:["validation","schema","expectations"] },
  { f:"07-features.html", n:"07", t:"Features and the feature store", part:1,
    d:"Training-serving skew measured, point-in-time correctness, and what a feature store actually buys.",
    tags:["skew","point-in-time","reuse"] },
  { f:"08-training.html", n:"08", t:"Training as a pipeline step", part:1,
    d:"Making training a reproducible job: resources, checkpointing, distributed training, and hyperparameter search that finishes.",
    tags:["checkpointing","tuning","resources"] },
  { f:"09-tracking.html", n:"09", t:"Experiment tracking", part:2,
    d:"What to log, what it costs, and comparing runs when the thing that differed was not recorded.",
    tags:["mlflow","metrics","params"] },
  { f:"10-registry.html", n:"10", t:"The model registry", part:2,
    d:"Stages, approval gates, and the question the registry exists to answer: what is running right now, and why.",
    tags:["registry","promotion","approval"] },
  { f:"11-lineage.html", n:"11", t:"Lineage and provenance", part:2,
    d:"Tracing a prediction back to a row of training data, and the audit questions that only lineage can answer.",
    tags:["provenance","audit","debugging"] },
  { f:"12-serving.html", n:"12", t:"Serving architectures", part:3,
    d:"Batch, online and streaming inference compared on freshness, cost and failure surface.",
    tags:["batch","online","streaming"] },
  { f:"13-latency.html", n:"13", t:"Latency, throughput and cost", part:3,
    d:"Queueing arithmetic for inference: utilisation and tail latency, batching trade-offs, and what a replica actually buys.",
    tags:["queueing","tail latency","batching"] },
  { f:"14-deployment.html", n:"14", t:"Deploying a model", part:3,
    d:"Shadow, canary and blue-green for models, and how long a canary must run to detect what you care about.",
    tags:["canary","shadow","rollback"] },
  { f:"15-scaling.html", n:"15", t:"Scaling and infrastructure", part:3,
    d:"Autoscaling against bursty traffic, cold starts, and the arithmetic of provisioning for a tail.",
    tags:["autoscaling","cold start","gpu"] },
  { f:"16-monitoring.html", n:"16", t:"Monitoring at three levels", part:4,
    d:"System, data and model monitoring, what each one can see, and designing alerts that survive contact with a rota.",
    tags:["alerting","slo","observability"] },
  { f:"17-retraining.html", n:"17", t:"Retraining", part:4,
    d:"Triggers against schedules, the cost of retraining too often, and validating a candidate against the incumbent.",
    tags:["triggers","cadence","validation"] },
  { f:"18-incidents.html", n:"18", t:"Incidents and debugging", part:4,
    d:"Rollback for models, narrowing a failure to a layer, and the post-mortem questions specific to ML systems.",
    tags:["rollback","triage","postmortem"] },
  { f:"19-platform.html", n:"19", t:"The platform", part:4,
    d:"Build against buy, cost attribution, governance, and what maturity actually looks like.",
    tags:["build vs buy","cost","governance"] },
  { f:"20-practice.html", n:"20", t:"Practice", part:4,
    d:"Worked problems, a diagnostic index of every failure measured in this unit, and where to go next.",
    tags:["reference","problems"] }
];

var LIVE = { 1:1, 2:1, 3:1, 4:1, 5:1, 6:1, 7:1, 8:1, 9:1, 10:1, 11:1, 12:1, 13:1, 14:1, 15:1, 16:1, 17:1, 18:1, 19:1, 20:1 };

var isLive = function (n) { return !!LIVE[parseInt(n, 10)]; };
var liveCount = function () { return Object.keys(LIVE).length; };

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
