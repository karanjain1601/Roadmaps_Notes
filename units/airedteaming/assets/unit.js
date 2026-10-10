/* ============================================================
   Roadmap Notes — AI Red Teaming unit
   One source of truth for the chapter list, plus the small
   behaviours every page shares: rail, progress, copy, keys.
   ============================================================ */

const CHAPTERS = [
  { f:"01-what-it-is.html", n:"01", t:"What AI red teaming is",
    part:"The discipline",
    d:"How it differs from penetration testing and from model evaluation, why the attack surface is genuinely new, and the authorisation and ethics that come first.",
    tags:["scope","ethics","authorisation","vs pentest"] },
  { f:"02-threat-modelling.html", n:"02", t:"Threat modelling an AI system",
    part:"The discipline",
    d:"Assets, actors and trust boundaries for a system whose inputs are instructions. STRIDE and MITRE ATLAS applied to a real architecture.",
    tags:["stride","atlas","trust boundaries","assets"] },
  { f:"03-attack-surface.html", n:"03", t:"The attack surface",
    part:"The discipline",
    d:"Six layers — data, model, prompt, output, tools, infrastructure — and which failures live at each.",
    tags:["surface map","layers","taxonomy"] },

  { f:"04-instruction-channel.html", n:"04", t:"Why guardrails are soft",
    part:"The prompt layer",
    d:"Instructions and data arrive on the same channel with no privilege separation. Everything in this part follows from that one structural fact.",
    tags:["no privilege separation","system prompt","alignment"] },
  { f:"05-prompt-injection.html", n:"05", t:"Prompt injection",
    part:"The prompt layer",
    d:"Direct and indirect injection, why it is an architectural problem rather than a filtering problem, and an honest account of the mitigations.",
    tags:["indirect","rag","mitigations","architecture"] },
  { f:"06-jailbreaks.html", n:"06", t:"Jailbreaks and safety bypass",
    part:"The prompt layer",
    d:"The mechanisms behind the technique families, why blocking individual prompts does not work, and how to test coverage rather than examples.",
    tags:["taxonomy","mechanisms","coverage","refusals"] },
  { f:"07-output-handling.html", n:"07", t:"Insecure output handling",
    part:"The prompt layer",
    d:"Model output is untrusted input to whatever consumes it. The injection that reaches your database, your browser and your shell.",
    tags:["xss","sql","command","rendering"] },

  { f:"08-adversarial-examples.html", n:"08", t:"Adversarial examples",
    part:"Model and data",
    d:"Perturbation attacks, transferability between models, and what adversarial robustness actually buys you in production.",
    tags:["perturbation","transferability","robustness"] },
  { f:"09-poisoning.html", n:"09", t:"Poisoning and backdoors",
    part:"Model and data",
    d:"Training-time attacks, the dataset supply chain, backdoor triggers, and why detection is harder than prevention.",
    tags:["backdoor","dataset","triggers","detection"] },
  { f:"10-extraction.html", n:"10", t:"Extraction and inversion",
    part:"Model and data",
    d:"Model stealing, membership inference, memorised training data, and the query patterns that give each away.",
    tags:["stealing","membership","memorisation","pii"] },
  { f:"11-model-defences.html", n:"11", t:"Defences at the model layer",
    part:"Model and data",
    d:"Adversarial training, robust design, differential privacy and unlearning — what each costs and where each stops working.",
    tags:["adversarial training","dp","unlearning","limits"] },

  { f:"12-supply-chain.html", n:"12", t:"The AI supply chain",
    part:"Systems and agents",
    d:"A model file is executable code. Deserialisation, model hubs, dependency risk and provenance you can actually verify.",
    tags:["pickle","hubs","provenance","sbom"] },
  { f:"13-agents.html", n:"13", t:"Agentic systems",
    part:"Systems and agents",
    d:"Tools turn a text vulnerability into an action. Permissioning, sandboxing, the confused deputy, and the combination to avoid.",
    tags:["tools","sandboxing","permissions","mcp"] },
  { f:"14-infrastructure.html", n:"14", t:"Infrastructure and APIs",
    part:"Systems and agents",
    d:"Authentication, tenancy, rate limiting, and the denial-of-wallet attacks that are specific to metered inference.",
    tags:["authn","tenancy","rate limits","cost"] },

  { f:"15-methodology.html", n:"15", t:"Testing methodology",
    part:"Doing the work",
    d:"Black, white and grey box against an AI system. Manual against automated, how to establish coverage, and when an engagement is finished.",
    tags:["scoping","coverage","manual vs auto"] },
  { f:"16-harness.html", n:"16", t:"Building an evaluation harness",
    part:"Doing the work",
    d:"Turning findings into a regression suite: attack corpora, scoring, automated red teaming, and keeping it honest over time.",
    tags:["benchmarks","scoring","regression","automation"] },
  { f:"17-reporting.html", n:"17", t:"Reporting and disclosure",
    part:"Doing the work",
    d:"Severity for findings that are probabilistic, writing something a team can act on, and disclosing to a model provider.",
    tags:["severity","repro","disclosure","cvss"] },
  { f:"18-programme.html", n:"18", t:"Building the practice",
    part:"Doing the work",
    d:"Standards worth knowing, where red teaming sits alongside evaluation and safety work, and an honest read on the field.",
    tags:["nist ai rmf","owasp","iso 42001","careers"] }
];

const UNIT = { title:"AI Red Teaming", sub:"Data & AI line · 18 chapters", home:"../../index.html" };
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
