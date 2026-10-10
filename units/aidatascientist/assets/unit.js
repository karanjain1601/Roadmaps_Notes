/* ============================================================
   Roadmap Notes — AI and Data Scientist unit
   Unit: AI and Data Scientist · line: Data & AI

   One source of truth for the chapter list. The hub renders its
   rows from CHAPTERS, the counters derive from LIVE, and every
   chapter builds its own sidebar and pager from the same array.
   To mark a chapter ready, add its number to LIVE. Nothing else.
   ============================================================ */

var PARTS = [
  { p:"Foundations",
    d:"The probability, sampling and linear algebra a data scientist uses daily \u2014 and the places where the standard results quietly stop holding." },
  { p:"Inference",
    d:"Testing, intervals, power and the minimum detectable effect. What an experiment can and cannot resolve, worked out before it runs." },
  { p:"Experimentation",
    d:"The heart of the role: designing a trial, randomising it, measuring ratio metrics correctly, cutting variance, and reading the result honestly." },
  { p:"Econometrics and time series",
    d:"Regression read properly, distributions and generalised linear models, and forecasting that is evaluated the way it will be used." },
  { p:"Prediction",
    d:"What changes when the goal is a forecast rather than an explanation \u2014 and how to evaluate a model against the decision it feeds." },
  { p:"Delivering the work",
    d:"Shipping a model, watching it drift, the craft around the analysis, then a full test of the unit." }
];

var CHAPTERS = [
  { f:"01-role.html", n:"01", t:"What a data scientist actually does", part:0,
    d:"The role against the analyst and the ML engineer, the decision-first framing, and why most of this unit is about experiments rather than models.",
    tags:["role","scoping","decisions","causality"] },
  { f:"02-probability.html", n:"02", t:"Probability you actually use", part:0,
    d:"Distributions worth recognising, expectation and variance, and the central limit theorem \u2014 including the cases where it needs far more data than people assume.",
    tags:["distributions","expectation","variance","CLT"] },
  { f:"03-sampling.html", n:"03", t:"Sampling, estimation and the bootstrap", part:0,
    d:"Standard error, what a sampling distribution is, when the bootstrap works and the specific situations where it fails.",
    tags:["standard error","bootstrap","bias","resampling"] },
  { f:"04-linear-algebra.html", n:"04", t:"Linear algebra for data", part:0,
    d:"Vectors, matrices, projection and decomposition \u2014 the geometric reading that makes regression, PCA and embeddings the same idea.",
    tags:["projection","SVD","eigenvalues","rank"] },

  { f:"05-testing.html", n:"05", t:"Choosing and reading a test", part:1,
    d:"Which test for which comparison, one-sided against two-sided, assumptions that matter and assumptions that do not.",
    tags:["t-test","Mann-Whitney","chi-squared","assumptions"] },
  { f:"06-intervals.html", n:"06", t:"Confidence intervals, done honestly", part:1,
    d:"What an interval covers, how to read one, and why it carries more information for a decision than any p-value.",
    tags:["coverage","precision","bootstrap CI","reporting"] },
  { f:"07-power.html", n:"07", t:"Power and the minimum detectable effect", part:1,
    d:"The calculation that decides whether an experiment is worth running, and what it means when the MDE exceeds any plausible effect.",
    tags:["power","MDE","sample size","sensitivity"] },
  { f:"08-peeking.html", n:"08", t:"Peeking, sequential testing and multiplicity", part:1,
    d:"What repeatedly checking a running experiment does to the false-positive rate, and the two families of correction that fix it.",
    tags:["peeking","sequential","alpha spending","FDR"] },

  { f:"09-design.html", n:"09", t:"Designing an experiment", part:2,
    d:"The unit of randomisation, interference between units, and the exposure and eligibility choices that decide what the result can mean.",
    tags:["randomisation unit","SUTVA","interference","eligibility"] },
  { f:"10-aa-tests.html", n:"10", t:"Randomisation, balance and A/A tests", part:2,
    d:"Checking that the randomisation worked, what a balance test can and cannot tell you, and what an A/A test is really measuring.",
    tags:["A/A","balance","SRM","assignment"] },
  { f:"11-ratio-metrics.html", n:"11", t:"Ratio metrics and the delta method", part:2,
    d:"Why the naive standard error is wrong when the denominator is random, and the correction that fixes it.",
    tags:["ratio metrics","delta method","clustering","variance"] },
  { f:"12-variance-reduction.html", n:"12", t:"Variance reduction: CUPED and stratification", part:2,
    d:"Using pre-period data to cut variance without touching the estimate \u2014 what CUPED buys, and what stratification adds.",
    tags:["CUPED","stratification","covariates","sensitivity"] },
  { f:"13-quasi.html", n:"13", t:"When you cannot randomise", part:2,
    d:"Difference-in-differences, regression discontinuity and synthetic control \u2014 what each assumes, and how to check it.",
    tags:["diff-in-diff","RDD","synthetic control","parallel trends"] },
  { f:"14-reading.html", n:"14", t:"Reading an experiment", part:2,
    d:"Novelty and primacy effects, heterogeneous treatment effects, Twyman's law, and deciding what to do when the result is ambiguous.",
    tags:["novelty","heterogeneity","Twyman","decisions"] },

  { f:"15-regression.html", n:"15", t:"Regression, read properly", part:3,
    d:"What a coefficient means, which assumptions matter for which claim, and the diagnostics that catch a wrong functional form.",
    tags:["OLS","coefficients","residuals","collinearity"] },
  { f:"16-glm.html", n:"16", t:"Distributions and generalised linear models", part:3,
    d:"Fitting a distribution to data, when linear regression is the wrong model, and logistic and Poisson regression read as decisions.",
    tags:["GLM","logistic","Poisson","link function"] },
  { f:"17-time-series.html", n:"17", t:"Time series: structure and stationarity", part:3,
    d:"Trend, seasonality and autocorrelation, why stationarity matters, and the spurious relationships that trending series produce.",
    tags:["stationarity","autocorrelation","decomposition","differencing"] },
  { f:"18-forecasting.html", n:"18", t:"Forecasting and backtesting", part:3,
    d:"Baselines that are hard to beat, ARIMA and its alternatives, and evaluating a forecast the way it will actually be used.",
    tags:["ARIMA","baselines","backtesting","horizon"] },

  { f:"19-two-cultures.html", n:"19", t:"From explanation to prediction", part:4,
    d:"What changes when the goal is a forecast rather than an understanding \u2014 and the mistakes that come from confusing the two.",
    tags:["prediction","explanation","overfitting","validation"] },
  { f:"20-evaluation.html", n:"20", t:"Evaluating a model for a decision", part:4,
    d:"Calibration, thresholds and cost-sensitive choices. Why accuracy is nearly always the wrong headline number.",
    tags:["calibration","thresholds","cost","AUC"] },
  { f:"21-uplift.html", n:"21", t:"Uplift: predicting the effect, not the outcome", part:4,
    d:"Targeting the people a treatment will change rather than the people most likely to convert \u2014 and why those are different groups.",
    tags:["uplift","treatment effect","targeting","persuadables"] },

  { f:"22-shipping.html", n:"22", t:"Shipping a model, and watching it drift", part:5,
    d:"The gap between a notebook and a served prediction, training-serving skew, and the monitoring that catches a model going quietly stale.",
    tags:["serving","skew","drift","monitoring"] },
  { f:"23-craft.html", n:"23", t:"The craft", part:5,
    d:"Scoping a question, working with stakeholders, deciding what not to analyse, and the value of an answer nobody acts on.",
    tags:["scoping","stakeholders","decision analysis","communication"] },
  { f:"24-practice.html", n:"24", t:"Practice", part:5,
    d:"A scored self-assessment, a debugging routine for a suspect result, a searchable glossary and a quiz over the whole unit.",
    tags:["checklist","glossary","quiz","review"] },
];

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
