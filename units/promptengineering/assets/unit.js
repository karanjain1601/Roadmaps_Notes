/* ============================================================
   Roadmap Notes — Prompt Engineering unit
   One source of truth for the chapter list, plus the small
   behaviours every page shares: rail, progress, copy, keys.
   ============================================================ */

const CHAPTERS = [
  { f:"01-what-a-prompt-is.html", n:"01", t:"What a prompt actually is",
    part:"Foundations",
    d:"Conditioning rather than instruction: what the model is doing when it reads your text, and why that explains most of what works.",
    tags:["conditioning","tokens","distribution"] },
  { f:"02-sampling.html", n:"02", t:"Sampling and output control",
    part:"Foundations",
    d:"Temperature, top-p, top-k, penalties, stop sequences and max tokens — what each knob does to the distribution, and when to touch it.",
    tags:["temperature","top-p","penalties","stop"] },
  { f:"03-anatomy.html", n:"03", t:"The anatomy of a prompt",
    part:"Foundations",
    d:"The seven sections, the order that works, delimiters, and laying it out so prompt caching actually hits.",
    tags:["structure","delimiters","ordering","caching"] },

  { f:"04-instructions.html", n:"04", t:"Writing instructions that land",
    part:"Core techniques",
    d:"Specificity over constraint, positive framing, output contracts, and the rewrites that turn a vague prompt into a reliable one.",
    tags:["zero-shot","specificity","constraints"] },
  { f:"05-few-shot.html", n:"05", t:"Few-shot examples",
    part:"Core techniques",
    d:"How many, which ones, what order, and the failure where the model copies your examples' content instead of their shape.",
    tags:["examples","selection","format leakage"] },
  { f:"06-roles-and-context.html", n:"06", t:"Roles, system prompts and context",
    part:"Core techniques",
    d:"What a role instruction genuinely changes, where the system prompt earns its place, and how to supply reference material.",
    tags:["system","role","context","persona"] },
  { f:"07-reasoning.html", n:"07", t:"Getting the model to reason",
    part:"Core techniques",
    d:"Chain of thought, step-back, self-consistency, tree of thoughts and ReAct — with the cost of each and when it pays.",
    tags:["cot","step-back","self-consistency","tot"] },

  { f:"08-structured-output.html", n:"08", t:"Structured output",
    part:"Reliable output",
    d:"Schemas, JSON mode, constrained decoding, field design, and the validate-and-repair loop that makes it dependable.",
    tags:["json","schema","constrained decoding"] },
  { f:"09-reliability.html", n:"09", t:"Reliability tactics",
    part:"Reliable output",
    d:"Ensembling, self-evaluation, calibration, debiasing and majority voting — which of these actually move the number.",
    tags:["ensembling","calibration","self-eval","bias"] },
  { f:"10-injection.html", n:"10", t:"Prompt injection and defensive prompting",
    part:"Reliable output",
    d:"Why instructions and data share one channel, what a prompt can and cannot defend, and where the real boundary belongs.",
    tags:["injection","jailbreak","delimiters","defence"] },

  { f:"11-prompts-as-code.html", n:"11", t:"Prompts as code",
    part:"Engineering practice",
    d:"Templates, versioning, review, deployment and rollback — treating a prompt like the production artefact it is.",
    tags:["versioning","templates","review","deploy"] },
  { f:"12-evaluating.html", n:"12", t:"Evaluating a prompt",
    part:"Engineering practice",
    d:"Building the eval set, deterministic checks, judges done carefully, and telling a real improvement from noise.",
    tags:["evals","judge","regression","significance"] },
  { f:"13-cost-and-latency.html", n:"13", t:"Optimising cost and latency",
    part:"Engineering practice",
    d:"Prompt length, caching-aware layout, model routing, output limits, and automatic prompt optimisation.",
    tags:["caching","routing","length","ape"] },
  { f:"14-portability.html", n:"14", t:"Across models and modalities",
    part:"Engineering practice",
    d:"What breaks when you switch provider, adapting for reasoning models, and prompting with images and audio in the message.",
    tags:["portability","reasoning models","multimodal"] }
];

const UNIT = { title:"Prompt Engineering", sub:"Data & AI line · 14 chapters", home:"../../index.html" };

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
