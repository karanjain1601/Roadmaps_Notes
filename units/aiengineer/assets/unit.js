/* ============================================================
   Roadmap Notes — AI Engineer unit
   One source of truth for the chapter list, plus the small
   behaviours every page shares: rail, progress, copy, keys.
   ============================================================ */

const CHAPTERS = [
  { f:"01-the-role.html", n:"01", t:"What an AI engineer actually does",
    part:"Groundwork",
    d:"The job, how it differs from ML engineering and from ordinary backend work, and the shape of the stack you are about to learn.",
    tags:["role","ml engineer","stack"] },
  { f:"02-how-llms-work.html", n:"02", t:"Inside the model",
    part:"Groundwork",
    d:"Tokens, training versus inference, what a transformer is doing, why sampling settings matter and why models make things up.",
    tags:["tokens","transformer","sampling","hallucination"] },
  { f:"03-model-landscape.html", n:"03", t:"Choosing a model",
    part:"Groundwork",
    d:"The families on offer, context windows, knowledge cutoffs, reasoning models, hosting routes, and a method for picking one.",
    tags:["openai","claude","gemini","llama","bedrock"] },

  { f:"04-calling-the-api.html", n:"04", t:"Talking to a model in code",
    part:"Working with models",
    d:"The chat completions shape, message roles, streaming, retries, timeouts, and a provider-agnostic client you can actually keep.",
    tags:["api","streaming","sdk","retries"] },
  { f:"05-tokens-and-cost.html", n:"05", t:"Tokens, context and money",
    part:"Working with models",
    d:"Counting tokens before you send them, budgeting a context window, prompt caching, batch pricing and unit economics per request.",
    tags:["tokenizer","context window","pricing","caching"] },
  { f:"06-prompting.html", n:"06", t:"Prompt engineering that survives production",
    part:"Working with models",
    d:"Prompt anatomy, few-shot examples, chain of thought, delimiters, role prompting, and treating prompts as versioned code.",
    tags:["system prompt","few-shot","cot","versioning"] },
  { f:"07-structured-output.html", n:"07", t:"Structured output and tool calling",
    part:"Working with models",
    d:"JSON schemas, constrained decoding, the function-calling loop, validation, parallel tools and the errors you must handle.",
    tags:["json schema","function calling","validation"] },
  { f:"08-open-models.html", n:"08", t:"Open weights and local inference",
    part:"Working with models",
    d:"Licences, the Hugging Face Hub, quantisation, Ollama and vLLM, hardware sizing, and when self-hosting is genuinely cheaper.",
    tags:["hugging face","ollama","vllm","gguf","quantisation"] },

  { f:"09-embeddings.html", n:"09", t:"Embeddings",
    part:"Knowledge and retrieval",
    d:"What a vector actually encodes, cosine similarity, model choice and dimensions, and the five jobs embeddings do well.",
    tags:["vectors","cosine","semantic search","clustering"] },
  { f:"10-vector-search.html", n:"10", t:"Vector databases and search",
    part:"Knowledge and retrieval",
    d:"HNSW and IVF indexes, recall versus latency, metadata filtering, hybrid search with BM25, reranking and the store landscape.",
    tags:["hnsw","pinecone","qdrant","pgvector","bm25"] },
  { f:"11-rag-ingestion.html", n:"11", t:"RAG part one: getting your data in",
    part:"Knowledge and retrieval",
    d:"Loading and parsing real documents, chunking strategies with worked numbers, metadata design and incremental re-indexing.",
    tags:["chunking","parsing","pipeline","metadata"] },
  { f:"12-rag-retrieval.html", n:"12", t:"RAG part two: retrieval and generation",
    part:"Knowledge and retrieval",
    d:"Query rewriting, hybrid retrieval, reranking, packing the context, grounded prompting, citations and the advanced variants.",
    tags:["reranking","hyde","citations","grounding"] },
  { f:"13-rag-evaluation.html", n:"13", t:"RAG part three: making it good",
    part:"Knowledge and retrieval",
    d:"Splitting retrieval failure from generation failure, golden sets, faithfulness scoring, and a debugging order that works.",
    tags:["ragas","recall","faithfulness","golden set"] },

  { f:"14-fine-tuning.html", n:"14", t:"Fine-tuning and other adaptations",
    part:"Adaptation and autonomy",
    d:"When fine-tuning beats prompting or retrieval, dataset construction, LoRA, preference tuning, distillation and the real costs.",
    tags:["lora","sft","dpo","distillation"] },
  { f:"15-agents.html", n:"15", t:"AI agents",
    part:"Adaptation and autonomy",
    d:"The agent loop in plain code, ReAct, tool design, memory, planning, MCP, multi-agent patterns and how agents fail.",
    tags:["react","tools","memory","mcp","loop"] },
  { f:"16-multimodal.html", n:"16", t:"Multimodal: vision, audio, video",
    part:"Adaptation and autonomy",
    d:"Image understanding and generation, speech to text and back, document extraction, video, and low-latency voice pipelines.",
    tags:["vision","whisper","tts","ocr","image gen"] },

  { f:"17-safety.html", n:"17", t:"Safety, security and abuse",
    part:"Taking it to production",
    d:"Prompt injection, jailbreaks, the OWASP LLM top ten, moderation, PII handling, bias testing and sandboxing tool use.",
    tags:["injection","owasp","moderation","pii","red team"] },
  { f:"18-evals.html", n:"18", t:"Evaluation and observability",
    part:"Taking it to production",
    d:"Building an eval set, choosing metrics, LLM-as-judge done carefully, tracing, online monitoring and closing the feedback loop.",
    tags:["evals","llm judge","tracing","regression"] },
  { f:"19-production.html", n:"19", t:"Shipping and running it",
    part:"Taking it to production",
    d:"Reference architecture, streaming UX, caching layers, rate limits, fallbacks, latency budgets and controlling spend.",
    tags:["architecture","caching","fallback","latency","cost"] },
  { f:"20-dev-tools.html", n:"20", t:"The AI-assisted development workflow",
    part:"Taking it to production",
    d:"Editors, completion, agentic CLIs, context files, reviewing generated code, and the habits that keep quality up.",
    tags:["claude code","cursor","copilot","review"] }
];

const UNIT = { title:"AI Engineer", sub:"Data & AI line · 20 chapters", home:"../../index.html" };

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
