/* ============================================================
   Roadmap Notes — MLOps unit
   One source of truth for the chapter list, plus the small
   behaviours every page shares: rail, progress, copy, keys.
   ============================================================ */

const CHAPTERS = [
  { f:"01-what-mlops-is.html", n:"01", t:"What MLOps is",
    part:"The problem",
    d:"Why ML systems decay when nothing changed, what makes them different from ordinary software, and an honest maturity ladder to locate yourself on.",
    tags:["decay","vs devops","maturity","tech debt"] },
  { f:"02-the-system.html", n:"02", t:"The system, end to end",
    part:"The problem",
    d:"The model is a small box in a large diagram. What the other boxes are, how they connect, and which ones fail most.",
    tags:["architecture","components","glue code"] },
  { f:"03-reproducibility.html", n:"03", t:"Reproducibility",
    part:"The problem",
    d:"Four things must be versioned together and most teams version one. Determinism, data versioning, and what \"we cannot reproduce it\" costs.",
    tags:["versioning","determinism","dvc","lockfiles"] },

  { f:"04-pipelines.html", n:"04", t:"Data pipelines and orchestration",
    part:"Data",
    d:"DAGs, idempotency, backfills and retries — the properties that separate a pipeline from a script on a cron job.",
    tags:["airflow","dagster","idempotency","backfill"] },
  { f:"05-features.html", n:"05", t:"Feature stores and lineage",
    part:"Data",
    d:"Point-in-time correctness, the offline and online split, and why a feature store is a consistency tool rather than a database.",
    tags:["feature store","point-in-time","leakage"] },
  { f:"06-data-validation.html", n:"06", t:"Data validation and drift",
    part:"Data",
    d:"Schema checks, distribution tests and the failure that actually happens: an upstream field silently changing meaning.",
    tags:["great expectations","schema","drift","nulls"] },

  { f:"07-experiments.html", n:"07", t:"Experiment tracking",
    part:"Training",
    d:"What to log so a result can be defended six months later, and the difference between a tracked run and a reproducible one.",
    tags:["mlflow","w&b","metrics","artifacts"] },
  { f:"08-training-pipelines.html", n:"08", t:"Training pipelines",
    part:"Training",
    d:"Getting out of the notebook: parameterised steps, caching, hyperparameter search, and when distribution is worth it.",
    tags:["notebooks","kubeflow","hpo","distributed"] },
  { f:"09-registry.html", n:"09", t:"Model registry and promotion",
    part:"Training",
    d:"Versions, stages and approval gates — plus the lineage that lets you walk from a prediction back to the rows that trained it.",
    tags:["registry","stages","lineage","approval"] },
  { f:"10-evaluation.html", n:"10", t:"Evaluating and testing models",
    part:"Training",
    d:"Aggregate metrics hide the failures that matter. Slice-based evaluation, behavioural tests, and testing the pipeline rather than the model.",
    tags:["slices","behavioural","baselines","ci"] },

  { f:"11-serving.html", n:"11", t:"Packaging and serving",
    part:"Serving",
    d:"Batch, online and streaming inference, model servers, and what actually goes inside the container.",
    tags:["batch","online","triton","containers"] },
  { f:"12-deployment.html", n:"12", t:"Deployment strategies",
    part:"Serving",
    d:"Shadow, canary, A/B and blue-green applied to models — where the usual playbook works and where it needs changing.",
    tags:["shadow","canary","rollback","a/b"] },
  { f:"13-serving-performance.html", n:"13", t:"Latency, throughput and cost",
    part:"Serving",
    d:"Batching, quantisation, GPU utilisation and the arithmetic that decides whether inference is affordable.",
    tags:["batching","quantisation","gpu","cost"] },
  { f:"14-skew.html", n:"14", t:"Training and serving skew",
    part:"Serving",
    d:"The single largest cause of models that work in evaluation and fail in production, and the four shapes it takes.",
    tags:["skew","leakage","parity","logging"] },

  { f:"15-monitoring.html", n:"15", t:"Monitoring in production",
    part:"Running it",
    d:"Measuring quality when labels arrive late or never. Data drift, concept drift, and the proxies worth alerting on.",
    tags:["drift","delayed labels","alerting","psi"] },
  { f:"16-infrastructure.html", n:"16", t:"Infrastructure",
    part:"Running it",
    d:"Kubernetes, infrastructure as code, GPU scheduling and the cost decisions that dominate an ML platform's bill.",
    tags:["kubernetes","terraform","gpu","spot"] },
  { f:"17-governance.html", n:"17", t:"Governance and compliance",
    part:"Running it",
    d:"Audit trails, model cards, fairness review and what the EU AI Act asks for — written as engineering requirements.",
    tags:["audit","model cards","eu ai act","fairness"] },
  { f:"18-choosing.html", n:"18", t:"Choosing a stack",
    part:"Running it",
    d:"Build against buy, the maturity-appropriate answer, and the platform work that is genuinely premature.",
    tags:["build vs buy","tooling","maturity"] }
];

const UNIT = { title:"MLOps", sub:"Data & AI line · 18 chapters", home:"../../index.html" };
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
