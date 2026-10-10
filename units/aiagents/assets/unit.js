/* ============================================================
   Roadmap Notes — AI Agents unit
   One source of truth for the chapter list, plus the small
   behaviours every page shares: rail, progress, copy, keys.
   ============================================================ */

const CHAPTERS = [
  { f:"01-what-is-an-agent.html", n:"01", t:"What an agent actually is",
    part:"Foundations",
    d:"The autonomy spectrum from single call to open loop, where agents genuinely beat simpler designs, and the honest failure rate.",
    tags:["autonomy","use cases","when not to"] },
  { f:"02-the-loop.html", n:"02", t:"The loop, from scratch",
    part:"Foundations",
    d:"Building a working agent in plain code with no framework: message state, tool dispatch, budgets, termination and the parts everyone gets wrong.",
    tags:["loop","messages","budgets","termination"] },
  { f:"03-model-choice.html", n:"03", t:"Choosing a model for agentic work",
    part:"Foundations",
    d:"Tool-calling reliability, reasoning models, instruction adherence over long runs, cost per step and the arithmetic of a 12-step task.",
    tags:["tool calling","reasoning","cost per step"] },

  { f:"04-tool-design.html", n:"04", t:"Designing tools",
    part:"Tools and actions",
    d:"Schemas, descriptions, naming, granularity, return shapes and the difference between an API wrapper and a tool an agent can use.",
    tags:["schemas","descriptions","granularity"] },
  { f:"05-tool-execution.html", n:"05", t:"Executing tools safely",
    part:"Tools and actions",
    d:"Validation, authorisation, idempotency, timeouts, sandboxing code execution, and returning failures the model can recover from.",
    tags:["validation","authorisation","sandbox","idempotency"] },
  { f:"06-mcp.html", n:"06", t:"The Model Context Protocol",
    part:"Tools and actions",
    d:"Hosts, clients and servers, building one, transports and deployment modes, and the supply-chain risk of installing somebody else's.",
    tags:["mcp","servers","transports","risk"] },

  { f:"07-context.html", n:"07", t:"Context engineering",
    part:"Context and memory",
    d:"What occupies the window at step nine, compaction and summarisation, result truncation, and why long runs decay.",
    tags:["window","compaction","truncation","decay"] },
  { f:"08-memory.html", n:"08", t:"Memory",
    part:"Context and memory",
    d:"Short and long term, episodic versus semantic, deciding what to write, retrieving it usefully, and forgetting on purpose.",
    tags:["long term","episodic","retrieval","forgetting"] },

  { f:"09-reasoning.html", n:"09", t:"Reasoning and planning patterns",
    part:"Architectures",
    d:"ReAct, chain of thought, plan-and-execute, replanning, tree of thought, DAG agents and reflection — with the cost of each.",
    tags:["react","planning","reflection","tot"] },
  { f:"10-multi-agent.html", n:"10", t:"Multi-agent systems",
    part:"Architectures",
    d:"Supervisor, pipeline, parallel workers, handoff and debate. Why context isolation is the real benefit and swarms are not.",
    tags:["supervisor","handoff","parallel","debate"] },
  { f:"11-frameworks.html", n:"11", t:"Frameworks, and whether to use one",
    part:"Architectures",
    d:"LangGraph, LlamaIndex, CrewAI, AutoGen, smolagents and the SDKs — what each is actually for, and the build-versus-buy line.",
    tags:["langgraph","crewai","autogen","build vs buy"] },

  { f:"12-failure-modes.html", n:"12", t:"How agents fail",
    part:"Making it work",
    d:"Looping, oscillation, context exhaustion, fabricated arguments, premature success and silent partial failure — with detectors for each.",
    tags:["loops","oscillation","fabrication","detection"] },
  { f:"13-evaluation.html", n:"13", t:"Evaluating agents",
    part:"Making it work",
    d:"Outcome versus trajectory, golden tasks, tool-selection accuracy, cost per completed task, and simulating the environment.",
    tags:["trajectory","golden tasks","simulation"] },
  { f:"14-observability.html", n:"14", t:"Tracing and debugging a run",
    part:"Making it work",
    d:"Span design for agent runs, replay, the questions a trace must answer, and the tooling landscape.",
    tags:["tracing","spans","replay","langfuse"] },
  { f:"15-security.html", n:"15", t:"Security and the confused deputy",
    part:"Making it work",
    d:"Injection arriving through tool results, the lethal trifecta, permissioning, egress control and where humans belong in the loop.",
    tags:["injection","confused deputy","egress","approval"] },
  { f:"16-shipping.html", n:"16", t:"Shipping an agent",
    part:"Making it work",
    d:"Synchronous or queued, streaming progress, interruption and resumption, budgets, rollout and the operational runbook.",
    tags:["async","streaming","resume","rollout"] }
];

const UNIT = { title:"AI Agents", sub:"Data & AI line · 16 chapters", home:"../../index.html" };

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
