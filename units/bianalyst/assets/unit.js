/* ============================================================
   Roadmap Notes — BI Analyst unit
   Unit: BI Analyst · line: Data & AI

   One source of truth for the chapter list. The hub renders its
   rows from CHAPTERS, the counters derive from LIVE, and every
   chapter builds its own sidebar and pager from the same array.
   To mark a chapter ready, add its number to LIVE. Nothing else.
   ============================================================ */

var PARTS = [
  { p:"What BI is for",
    d:"Whose decision this is, where the role sits, and why a metric without a written definition is not a metric." },
  { p:"The data underneath",
    d:"Facts, dimensions and grain; star against snowflake; history that changes; and the semantic layer that holds a definition." },
  { p:"Getting numbers right",
    d:"The SQL that answers business questions, data quality in dimensions, and telling variation from signal." },
  { p:"Showing it",
    d:"Chart choice, dashboard design, the limits of self-service, and writing the summary someone actually reads." },
  { p:"Operating",
    d:"Governance and lineage, query performance and cost, and putting the whole thing together." }
];

var CHAPTERS = [
  { f:"01-decisions.html", n:"01", t:"Decisions, not dashboards", part:0,
    d:"What BI is for, four honest definitions of the same metric, and what a dashboard portfolio actually returns.",
    tags:["scope","metrics","portfolio"] },
  { f:"02-role.html", n:"02", t:"Where the BI analyst sits", part:0,
    d:"The boundary against data engineering and data science, and the work only this role does.",
    tags:["role","boundaries","stakeholders"] },
  { f:"03-metrics.html", n:"03", t:"Metrics, KPIs and definitions", part:0,
    d:"Writing a definition that survives a meeting, choosing a north star, and the arithmetic of metric trees.",
    tags:["kpi","north star","definitions"] },
  { f:"04-dimensional.html", n:"04", t:"Facts, dimensions and grain", part:1,
    d:"Grain as the decision everything else follows from, additive against non-additive measures, and conformed dimensions.",
    tags:["grain","facts","dimensions"] },
  { f:"05-schemas.html", n:"05", t:"Star against snowflake", part:1,
    d:"What normalising a dimension costs at query time, and when the join depth stops being free.",
    tags:["star","snowflake","joins"] },
  { f:"06-scd.html", n:"06", t:"Slowly changing dimensions", part:1,
    d:"What happens to last year's numbers when a customer changes segment, and the types that answer it.",
    tags:["scd","history","restatement"] },
  { f:"07-semantic.html", n:"07", t:"The semantic layer", part:1,
    d:"Where a definition lives so tools cannot disagree, and what a metric layer can and cannot enforce.",
    tags:["semantic layer","governance","metrics"] },
  { f:"08-sql.html", n:"08", t:"SQL that answers business questions", part:2,
    d:"Window functions, cohorts, period comparison, and the fan-out that silently doubles a total.",
    tags:["window functions","cohorts","fan-out"] },
  { f:"09-quality.html", n:"09", t:"Data quality, in dimensions", part:2,
    d:"Accuracy, completeness, timeliness, consistency — measured, with the checks that pay for themselves.",
    tags:["quality","freshness","checks"] },
  { f:"10-variation.html", n:"10", t:"Variation against signal", part:2,
    d:"Whether last week's dip means anything, control limits, and why weekly reporting manufactures stories.",
    tags:["variation","control limits","noise"] },
  { f:"11-causation.html", n:"11", t:"Correlation and the question you were asked", part:2,
    d:"Simpson's paradox, confounding, and answering the decision rather than the query.",
    tags:["causation","confounding","segments"] },
  { f:"12-charts.html", n:"12", t:"Chart choice and what the eye can do", part:3,
    d:"What each encoding is actually good for, measured against how accurately people read it.",
    tags:["encoding","perception","charts"] },
  { f:"13-dashboards.html", n:"13", t:"Dashboard design", part:3,
    d:"Layout, defaults, drill paths, and the difference between a monitoring surface and an analysis tool.",
    tags:["layout","defaults","drilldown"] },
  { f:"14-selfservice.html", n:"14", t:"Self-service and its limits", part:3,
    d:"What self-service buys, what it costs in divergent numbers, and where the boundary sits.",
    tags:["self-service","enablement","divergence"] },
  { f:"15-narrative.html", n:"15", t:"Writing the summary", part:3,
    d:"Executive summaries, the order of a finding, and saying what you do not know.",
    tags:["narrative","summary","uncertainty"] },
  { f:"16-governance.html", n:"16", t:"Governance, lineage and trust", part:4,
    d:"Certification, lineage, deprecation, and what makes people believe a number.",
    tags:["lineage","certification","trust"] },
  { f:"17-performance.html", n:"17", t:"Performance and cost", part:4,
    d:"Aggregates, partitioning, extracts and caching — and what each buys per pound spent.",
    tags:["performance","cost","aggregates"] },
  { f:"18-practice.html", n:"18", t:"Putting it together", part:4,
    d:"Worked problems, an index of every measured finding, and where to go next.",
    tags:["synthesis","index","practice"] }
];

var LIVE = { 1:1, 2:1, 3:1, 4:1, 5:1, 6:1, 7:1, 8:1, 9:1, 10:1, 11:1, 12:1, 13:1, 14:1, 15:1, 16:1, 17:1 };

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
