/* ============================================================
   Roadmap Notes — unit runtime
   Unit: Python
   ============================================================ */
(function () {
"use strict";

const UNIT = { name: "Python", line: "Languages", root: "../../index.html" };

const CHAPTERS = [
  { n: "01", f: "01-setup.html",        t: "Getting set up",            p: "Orientation" },
  { n: "02", f: "02-objects.html",      t: "Names, objects and types",  p: "The language core" },
  { n: "03", f: "03-control-flow.html", t: "Control flow",              p: "The language core" },
  { n: "04", f: "04-data-structures.html", t: "Built-in data structures", p: "The language core" },
  { n: "05", f: "05-functions.html",    t: "Functions",                 p: "The language core" },
  { n: "06", f: "06-modules.html",      t: "Modules and packages",      p: "The language core" },
  { n: "07", f: "07-classes.html",      t: "Classes and objects",       p: "The language core" },
  { n: "08", f: "08-exceptions.html",   t: "Errors and exceptions",     p: "The language core" },
  { n: "09", f: "09-iterators.html",    t: "Iterators and generators",  p: "Idiomatic Python" },
  { n: "10", f: "10-decorators.html",   t: "Decorators and descriptors",p: "Idiomatic Python" },
  { n: "11", f: "11-typing.html",       t: "Type hints",                p: "Idiomatic Python" },
  { n: "12", f: "12-stdlib.html",       t: "The standard library",      p: "Working with the world" },
  { n: "13", f: "13-files.html",        t: "Files, text and encodings", p: "Working with the world" },
  { n: "14", f: "14-concurrency.html",  t: "Concurrency and async",     p: "Working with the world" },
  { n: "15", f: "15-testing.html",      t: "Testing",                   p: "Craft" },
  { n: "16", f: "16-debugging.html",    t: "Debugging and profiling",   p: "Craft" },
  { n: "17", f: "17-performance.html",  t: "Performance",               p: "Craft" },
  { n: "18", f: "18-packaging.html",    t: "Packaging and dependencies",p: "Craft" },
  { n: "19", f: "19-quality.html",      t: "Code quality and tooling",  p: "Craft" },
  { n: "20", f: "20-practice.html",     t: "Practice and reference",    p: "Craft" }
];

const LIVE = new Set(["index.html", "01-setup.html", "02-objects.html"]);

const here = (location.pathname.split("/").pop() || "index.html");
const idx = CHAPTERS.findIndex(c => c.f === here);

const strip = document.getElementById("strip");
if (strip) {
  CHAPTERS.forEach((c, i) => {
    const live = LIVE.has(c.f);
    const a = document.createElement(live ? "a" : "span");
    a.className = "stopbtn" + (i === idx ? " here" : live ? " done" : "");
    if (live) a.href = c.f;
    a.title = c.n + " · " + c.t + (live ? "" : " (not written yet)");
    a.innerHTML = '<i></i><u>' + c.n + '</u>';
    strip.appendChild(a);
  });
  const cur = strip.querySelector(".here");
  if (cur) cur.scrollIntoView({ block: "nearest", inline: "center" });
}

const side = document.getElementById("side");
if (side) {
  let html = '<h2>' + UNIT.name + '</h2><div class="chlist">';
  let part = "";
  CHAPTERS.forEach((c, i) => {
    if (c.p !== part) { part = c.p; html += (i ? '</ol>' : '') + '<div class="part">' + part + '</div><ol>'; }
    const live = LIVE.has(c.f);
    html += '<li>' + (live
      ? '<a href="' + c.f + '"' + (i === idx ? ' class="on" aria-current="page"' : '') + '><em>' + c.n + '</em>' + c.t + '</a>'
      : '<a style="opacity:.42;cursor:not-allowed" title="Not written yet" onclick="return false" href="#"><em>' + c.n + '</em>' + c.t + '</a>') + '</li>';
  });
  html += '</ol></div><div class="inpage" id="inpage"></div>';
  html += '<div class="side-tools"><a href="index.html">Unit home</a><a href="' + UNIT.root + '">All units</a><button id="btnPrint">Print</button></div>';
  side.innerHTML = html;
  const heads = [...document.querySelectorAll("main > section[id] > h2")];
  const ip = document.getElementById("inpage");
  if (heads.length && ip) ip.innerHTML = heads.map(h => '<a href="#' + h.parentElement.id + '">' + h.textContent.replace(/^\d+\.\s*/, "") + "</a>").join("");
  const bp = document.getElementById("btnPrint");
  if (bp) bp.addEventListener("click", () => window.print());
}

const pn = document.getElementById("pagenav");
if (pn && idx > -1) {
  const prev = CHAPTERS[idx - 1], next = CHAPTERS[idx + 1];
  const link = (c, dir) => {
    if (!c) return '<span class="ph"></span>';
    const live = LIVE.has(c.f);
    return '<a class="' + (dir === "next" ? "nx" : "") + '" href="' + (live ? c.f : "#") + '"' +
      (live ? "" : ' style="opacity:.45" onclick="return false"') + '><span>' +
      (dir === "next" ? "Next" : "Previous") + " · " + c.n + '</span><b>' + c.t + '</b></a>';
  };
  pn.innerHTML = link(prev, "prev") + link(next, "next");
}

const prog = document.getElementById("prog");
const top = document.getElementById("toTop");
const secs = [...document.querySelectorAll("main > section[id]")];
function onScroll() {
  const h = document.documentElement;
  const max = h.scrollHeight - h.clientHeight;
  if (prog) prog.style.width = (max > 0 ? (h.scrollTop / max) * 100 : 0) + "%";
  if (top) top.classList.toggle("show", h.scrollTop > 700);
  if (secs.length) {
    let cur = secs[0].id;
    for (const s of secs) { if (s.getBoundingClientRect().top < 130) cur = s.id; }
    [...document.querySelectorAll("#inpage a")].forEach(a => a.classList.toggle("on", a.getAttribute("href") === "#" + cur));
  }
}
addEventListener("scroll", onScroll, { passive: true });
addEventListener("resize", onScroll);
onScroll();
if (top) top.addEventListener("click", () => scrollTo({ top: 0, behavior: "smooth" }));

const mw = document.getElementById("mWords"), mt = document.getElementById("mTime");
if (mw || mt) {
  const words = (document.querySelector("main")?.innerText || "").trim().split(/\s+/).length;
  if (mw) mw.textContent = words.toLocaleString();
  if (mt) mt.textContent = Math.max(1, Math.round(words / 210));
}

document.querySelectorAll(".code").forEach(block => {
  const btn = block.querySelector(".code-copy"), pre = block.querySelector("pre");
  if (!btn || !pre) return;
  btn.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(pre.innerText);
      const old = btn.textContent; btn.textContent = "Copied";
      setTimeout(() => (btn.textContent = old), 1400);
    } catch (e) {
      const r = document.createRange(); r.selectNodeContents(pre);
      const s = getSelection(); s.removeAllRanges(); s.addRange(r);
      btn.textContent = "Selected";
    }
  });
});

document.querySelectorAll(".check .reveal").forEach(b => {
  b.addEventListener("click", () => {
    const a = b.nextElementSibling; if (!a) return;
    b.textContent = a.classList.toggle("show") ? "Hide answer" : "Show answer";
  });
});

addEventListener("load", () => {
  if (window.mermaid) {
    try {
      window.mermaid.initialize({
        startOnLoad: true, securityLevel: "loose", theme: "base",
        fontFamily: "Archivo, Helvetica, Arial, sans-serif",
        themeVariables: {
          primaryColor: "#FEF4E6", primaryTextColor: "#0C1D30", primaryBorderColor: "#F2A03D",
          lineColor: "#54677A", secondaryColor: "#EAF1F7", tertiaryColor: "#F4F7F9",
          fontSize: "13px", clusterBkg: "#F5F8FA", clusterBorder: "#CFD8E0"
        },
        flowchart: { curve: "basis", useMaxWidth: true, padding: 12 }
      });
      window.mermaid.run?.();
    } catch (e) { console.warn("mermaid failed", e); }
  }
  onScroll();
});

/* ---------- shared canvas helper ---------- */
const C = { ink:"#0C1D30", line:"#F2A03D", lineDk:"#B0701A", grid:"#E4EAEF", axis:"#94A3B8",
            text:"#54677A", ok:"#2E9E6B", bad:"#D9534F", info:"#3E8FD0", warn:"#D98324",
            purple:"#8B6FD4", card:"#FFFFFF" };
function Plot(canvas, opts) {
  const o = Object.assign({ xr:[0,1], yr:[0,1], pad:[30,14,30,44], grid:true, ratio:0.58 }, opts||{});
  const ctx = canvas.getContext("2d"); const api = { ctx, canvas, o, C };
  api.size = function(){
    const dpr=Math.min(devicePixelRatio||1,2), w=canvas.clientWidth||640,
          h=o.height||Math.round(w*o.ratio);
    canvas.width=w*dpr; canvas.height=h*dpr; canvas.style.height=h+"px";
    ctx.setTransform(dpr,0,0,dpr,0,0);
    api.w=w; api.h=h; api.L=o.pad[3]; api.R=w-o.pad[1]; api.T=o.pad[0]; api.B=h-o.pad[2];
    return api;
  };
  api.X=v=>api.L+(v-o.xr[0])/(o.xr[1]-o.xr[0])*(api.R-api.L);
  api.Y=v=>api.B-(v-o.yr[0])/(o.yr[1]-o.yr[0])*(api.B-api.T);
  api.clear=function(bg){ ctx.clearRect(0,0,api.w,api.h);
    if(bg!==false){ ctx.fillStyle="#FBFCFD"; ctx.fillRect(0,0,api.w,api.h);} return api; };
  api.px=function(x,y,t,c,al,f){ ctx.save(); ctx.fillStyle=c||C.text; ctx.textAlign=al||"left";
    ctx.font=f||"11.5px Archivo, Arial, sans-serif"; ctx.textBaseline="middle"; ctx.fillText(t,x,y); ctx.restore(); return api; };
  return api.size();
}
function RNG(seed){ let s=seed||42;
  const r=()=> (s=(s*1664525+1013904223)%4294967296)/4294967296;
  r.norm=(mu,sd)=>{const u=Math.max(1e-9,r()),v=r();
    return (mu||0)+(sd==null?1:sd)*Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*v);};
  return r;
}
window.Plot=Plot; window.RNG=RNG; window.PC=C;
window.debounceResize=function(fn){ let t; addEventListener("resize",()=>{clearTimeout(t);t=setTimeout(fn,140);}); };
})();
