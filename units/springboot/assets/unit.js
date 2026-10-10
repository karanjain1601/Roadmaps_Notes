/* ============================================================
   Roadmap Notes — unit runtime
   Unit: Spring Boot
   ============================================================ */
(function () {
"use strict";

const UNIT = { name: "Spring Boot", line: "Back end & APIs", root: "../../index.html" };

const CHAPTERS = [
  { n: "01", f: "01-orientation.html", t: "What Spring actually is", p: "Foundations" },
  { n: "02", f: "02-ioc-di.html", t: "The container and dependency injection", p: "Foundations" },
  { n: "03", f: "03-configuration.html", t: "Configuration and profiles", p: "Foundations" },
  { n: "04", f: "04-autoconfiguration.html", t: "Starters and auto-configuration", p: "Building" },
  { n: "05", f: "05-web-mvc.html", t: "Web MVC and REST controllers", p: "Building" },
  { n: "06", f: "06-aop.html", t: "Proxies and AOP", p: "Building" },
  { n: "07", f: "07-concurrency.html", t: "Servlet, virtual threads and WebFlux", p: "Building" },
  { n: "08", f: "08-jpa.html", t: "Spring Data JPA", p: "Data" },
  { n: "09", f: "09-hibernate.html", t: "The persistence context", p: "Data" },
  { n: "10", f: "10-relationships.html", t: "Associations and the N+1 problem", p: "Data" },
  { n: "11", f: "11-transactions.html", t: "Transactions", p: "Data" },
  { n: "12", f: "12-security.html", t: "Spring Security", p: "Security" },
  { n: "13", f: "13-oauth.html", t: "OAuth 2.0 and JWT", p: "Security" },
  { n: "14", f: "14-testing.html", t: "Testing a Spring application", p: "Operating" },
  { n: "15", f: "15-actuator.html", t: "Actuator and observability", p: "Operating" },
  { n: "16", f: "16-performance.html", t: "Performance and startup", p: "Operating" },
  { n: "17", f: "17-messaging.html", t: "Events, scheduling and messaging", p: "Distribution" },
  { n: "18", f: "18-cloud.html", t: "Spring Cloud", p: "Distribution" },
  { n: "19", f: "19-packaging.html", t: "Packaging and deployment", p: "Distribution" },
  { n: "20", f: "20-practice.html", t: "Practice and reference", p: "Distribution" }
];

const LIVE = new Set(["index.html", "01-orientation.html", "02-ioc-di.html", "03-configuration.html", "04-autoconfiguration.html", "05-web-mvc.html", "06-aop.html", "07-concurrency.html", "08-jpa.html", "09-hibernate.html", "10-relationships.html", "11-transactions.html", "12-security.html", "13-oauth.html", "14-testing.html", "15-actuator.html", "16-performance.html", "17-messaging.html", "18-cloud.html", "19-packaging.html", "20-practice.html"]);

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
          primaryColor: "#FDEDEB", primaryTextColor: "#0C1D30", primaryBorderColor: "#3FB984",
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
const C = { ink:"#0C1D30", line:"#3FB984", lineDk:"#1F7A52", grid:"#E4EAEF", axis:"#94A3B8",
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
