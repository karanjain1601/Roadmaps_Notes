/* ============================================================
   Roadmap Notes — Data Analyst unit
   The chapter list, plus the behaviours every page shares.
   ============================================================ */

const CHAPTERS = [
  { f:"01-the-work.html", n:"01", t:"What the work actually is",
    part:"The job",
    d:"Descriptive through prescriptive, where an analyst adds value that a dashboard cannot, and the four ways the role goes wrong.",
    tags:["types","value","failure modes"] },
  { f:"02-the-question.html", n:"02", t:"Asking an answerable question",
    part:"The job",
    d:"Turning \"why are sales down\" into something the data can settle. The single highest-leverage skill in the job.",
    tags:["scoping","specification","decisions"] },
  { f:"03-knowing-the-data.html", n:"03", t:"Knowing your data",
    part:"The job",
    d:"Where the numbers came from, what they were recorded for, and why that determines what they can support.",
    tags:["provenance","instrumentation","semantics"] },

  { f:"04-cleaning.html", n:"04", t:"Cleaning without lying",
    part:"Getting to clean",
    d:"Missing values, duplicates and outliers — and what each handling choice quietly does to the answer.",
    tags:["missingness","duplicates","outliers"] },
  { f:"05-reshaping.html", n:"05", t:"Reshaping and joining",
    part:"Getting to clean",
    d:"Long against wide, grain, and the join errors that silently multiply or destroy rows.",
    tags:["grain","joins","fan-out"] },
  { f:"06-tools.html", n:"06", t:"Excel, SQL or Python",
    part:"Getting to clean",
    d:"What each is genuinely best at, where each hits a ceiling, and how to tell which one you are fighting.",
    tags:["excel","sql","pandas","r"] },

  { f:"07-summary-stats.html", n:"07", t:"Summaries that do not mislead",
    part:"Describing",
    d:"Centre, spread and shape — and the situations where the mean is the wrong number to report.",
    tags:["mean","median","variance","skew"] },
  { f:"08-distributions.html", n:"08", t:"Distributions",
    part:"Describing",
    d:"What the shape of your data tells you, and why it decides which method is available next.",
    tags:["shape","normality","heavy tails"] },
  { f:"09-visualisation.html", n:"09", t:"Charts that carry the argument",
    part:"Describing",
    d:"Encoding, chart choice, and the specific ways honest people mislead with graphs by accident.",
    tags:["encoding","chart choice","axes"] },

  { f:"10-sampling.html", n:"10", t:"Sampling and uncertainty",
    part:"Inferring",
    d:"What a sample can and cannot tell you about a population, and where the error actually comes from.",
    tags:["bias","confidence","clt"] },
  { f:"11-hypothesis-testing.html", n:"11", t:"Hypothesis testing",
    part:"Inferring",
    d:"What a p-value means, what it does not, and the practices that turn a test into a coin flip.",
    tags:["p-values","power","multiplicity"] },
  { f:"12-causation.html", n:"12", t:"Correlation, regression, causation",
    part:"Inferring",
    d:"The three-way confusion that costs organisations the most, and how to tell which one you have.",
    tags:["confounding","regression","selection"] },
  { f:"13-experiments.html", n:"13", t:"A/B tests and experiments",
    part:"Inferring",
    d:"Design, power, and the six ways a test that ran cleanly still gives you the wrong answer.",
    tags:["power","peeking","srm","novelty"] },

  { f:"14-cohorts.html", n:"14", t:"Cohorts, funnels and retention",
    part:"Delivering",
    d:"The three analyses every product team asks for, and the artefacts in each that fool people.",
    tags:["cohorts","funnels","retention","survivorship"] },
  { f:"15-time-series.html", n:"15", t:"Time series and seasonality",
    part:"Delivering",
    d:"Trend, seasonality and noise; comparing periods honestly; and why year-on-year is not always the answer.",
    tags:["seasonality","yoy","smoothing","anomalies"] },
  { f:"16-metrics.html", n:"16", t:"Metrics and definitions",
    part:"Delivering",
    d:"Why the same number differs across three teams, and what to do about it that actually works.",
    tags:["definitions","semantic layer","goodhart"] },
  { f:"17-dashboards.html", n:"17", t:"Dashboards and reporting",
    part:"Delivering",
    d:"What gets read, what gets ignored, and how a dashboard becomes maintenance nobody wanted.",
    tags:["design","self-serve","maintenance"] },
  { f:"18-communicating.html", n:"18", t:"Communicating a finding",
    part:"Delivering",
    d:"Leading with the answer, carrying the uncertainty, and being wrong in a way that keeps your credibility.",
    tags:["narrative","caveats","credibility"] }
];

const UNIT = { title:"Data Analyst", sub:"Data & AI line · 18 chapters", home:"../../index.html" };
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
