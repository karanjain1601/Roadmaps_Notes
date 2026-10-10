/* ============================================================
   Roadmap Notes — Python for Data Analysis unit
   Unit: Python for Data Analysis · line: Data & AI

   One source of truth for the chapter list. The hub renders its
   rows from CHAPTERS, the counters derive from LIVE, and every
   chapter builds its own sidebar and pager from the same array.
   To mark a chapter ready, add its number to LIVE. Nothing else.
   ============================================================ */

var PARTS = [
  { p:"The language, for analysis",
    d:"An environment that will not fight you, and the parts of Python where analysts actually get caught \u2014 numeric types, collections, and thinking in whole columns rather than loops." },
  { p:"Arrays and frames",
    d:"NumPy's array model and Pandas' index. Views against copies, broadcasting, alignment, and the reshape-group-join vocabulary that most analysis is written in." },
  { p:"Getting data in",
    d:"Files and their type-inference traps, databases queried from Python, and web data with its pagination and rate limits." },
  { p:"Cleaning",
    d:"Missing values, outliers, dates and categories \u2014 four decisions that change your results and are usually made by accident." },
  { p:"Exploring and visualising",
    d:"Summary statistics that lie, distributions that hide structure, relationships that reverse under grouping, and charts that mislead by default." },
  { p:"Beyond one machine, and beyond one notebook",
    d:"What to do when the data stops fitting, how to make an analysis repeatable, then a full test of the unit." }
];

var CHAPTERS = [
  { f:"01-setup.html", n:"01", t:"Setup that will not fight you", part:0,
    d:"Why environment isolation is not optional, what pip, conda, venv and uv each solve, and the notebook execution model that quietly produces irreproducible results.",
    tags:["venv","uv","conda","notebooks"] },
  { f:"02-types.html", n:"02", t:"Types, operators and numeric surprises", part:0,
    d:"Floats that do not add up, integer division, truthiness, and casting. The arithmetic an analyst relies on and the places it is not what it looks like.",
    tags:["floats","casting","truthiness","operators"] },
  { f:"03-collections.html", n:"03", t:"Collections and comprehensions", part:0,
    d:"Lists, tuples, dicts and sets, what each makes cheap, comprehensions against loops, and the mutable-default trap.",
    tags:["dict","set","comprehensions","mutability"] },
  { f:"04-functions.html", n:"04", t:"Functions, and thinking in columns", part:0,
    d:"Defining functions, args and kwargs, lambdas and built-ins \u2014 then the shift from row-at-a-time loops to whole-column operations, measured.",
    tags:["lambda","kwargs","apply","vectorised"] },

  { f:"05-numpy-arrays.html", n:"05", t:"NumPy: the array model", part:1,
    d:"ndarray, dtype, shape and strides. Views against copies and the aliasing bug that follows, plus how broadcasting resolves shapes.",
    tags:["ndarray","dtype","views","broadcasting"] },
  { f:"06-numpy-practice.html", n:"06", t:"NumPy in practice", part:1,
    d:"Vectorised operations, aggregating along axes, the random Generator API, and enough linear algebra to read the rest of the field.",
    tags:["axes","random","linalg","reductions"] },
  { f:"07-pandas-basics.html", n:"07", t:"Pandas: Series, DataFrame and the index", part:1,
    d:"The index as a first-class object, automatic alignment, loc against iloc, and why chained assignment silently does nothing.",
    tags:["index","alignment","loc","copies"] },
  { f:"08-reshape-join.html", n:"08", t:"Grouping, reshaping and joining", part:1,
    d:"groupby with agg and transform, pivot and melt, and merge semantics \u2014 including the row explosion that inflates a measure while every row stays correct.",
    tags:["groupby","pivot","merge","validate"] },

  { f:"09-files.html", n:"09", t:"Files and formats", part:2,
    d:"CSV type inference and the ways it goes wrong, encodings, chunking, Excel, JSON, and why Parquet is worth the switch.",
    tags:["csv","dtypes","parquet","memory"] },
  { f:"10-databases.html", n:"10", t:"Databases and SQL from Python", part:2,
    d:"sqlite3, SQLAlchemy, DuckDB and read_sql \u2014 and the habit of pushing work into the database instead of pulling everything out.",
    tags:["sql","duckdb","sqlalchemy","pushdown"] },
  { f:"11-web-data.html", n:"11", t:"Web data", part:2,
    d:"requests, pagination, rate limits and retries; parsing HTML with BeautifulSoup; and when scraping is the wrong tool.",
    tags:["requests","pagination","beautifulsoup","limits"] },

  { f:"12-missing.html", n:"12", t:"Missing data", part:3,
    d:"What NaN, None and NA each mean, and what dropping, mean-filling and forward-filling do to your mean, variance and correlation \u2014 measured.",
    tags:["nan","imputation","ffill","bias"] },
  { f:"13-outliers.html", n:"13", t:"Outliers", part:3,
    d:"IQR, z-scores and visual inspection disagree about which points are outliers, and \u201coutlier\u201d is a decision rather than a property of the data.",
    tags:["iqr","z-score","robustness","decisions"] },
  { f:"14-dates-types.html", n:"14", t:"Types, dates and categories", part:3,
    d:"Date parsing ambiguity that silently mangles a third of your rows, timezone handling, casting, categorical encoding and regex string cleaning.",
    tags:["dates","timezones","categorical","regex"] },

  { f:"15-descriptive.html", n:"15", t:"Descriptive statistics, honestly", part:4,
    d:"Mean, median, variance and skew \u2014 and four datasets with identical summary statistics and completely different shapes.",
    tags:["mean","variance","skew","anscombe"] },
  { f:"16-distributions.html", n:"16", t:"Distributions", part:4,
    d:"Histograms and the bin-width choice that changes the conclusion, kernel density, and what a boxplot hides.",
    tags:["histogram","bins","kde","boxplot"] },
  { f:"17-relationships.html", n:"17", t:"Relationships", part:4,
    d:"Pearson against Spearman, correlation matrices, cross-tabulation, and Simpson\u2019s paradox reversing a result within every group.",
    tags:["correlation","spearman","crosstab","simpson"] },
  { f:"18-testing.html", n:"18", t:"Testing and uncertainty", part:4,
    d:"What a p-value is exactly, why a third of significant findings can be false at p \u003c 0.05, multiple comparisons, power and effect size.",
    tags:["p-value","power","multiple comparisons","bootstrap"] },
  { f:"19-communicating.html", n:"19", t:"Communicating results", part:4,
    d:"Writing the finding rather than the process, quantifying uncertainty for a non-technical reader, and the analysis nobody acts on.",
    tags:["writing","uncertainty","audience","decisions"] },

  { f:"20-scale.html", n:"20", t:"When Pandas stops", part:5,
    d:"Memory arithmetic, dtype downcasting, chunking, and where Polars, DuckDB, Dask and PySpark each take over.",
    tags:["memory","polars","duckdb","dask"] },
  { f:"21-repeatable.html", n:"21", t:"Making an analysis repeatable", part:5,
    d:"Notebooks against scripts, project structure, parameterisation, testing an analysis, and the execution-order problem that makes results unreproducible.",
    tags:["structure","testing","parameters","reproducibility"] },
  { f:"22-practice.html", n:"22", t:"Practice", part:5,
    d:"A checklist for your own analyses, a debugging routine, a searchable glossary of every term in the unit, and a quiz scored by part.",
    tags:["checklist","glossary","quiz"] }
];

/* Chapters that exist on disk. Add a number here when one lands. */
var LIVE = { 1:1, 2:1, 3:1, 4:1, 5:1, 6:1, 7:1, 8:1, 9:1, 10:1, 11:1, 12:1, 13:1, 14:1, 15:1, 16:1, 17:1, 18:1, 19:1, 20:1, 21:1, 22:1 };

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
