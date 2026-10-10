/* ============================================================
   Roadmap Notes — unit runtime
   Unit: DevOps
   ============================================================ */
(function () {
"use strict";

const UNIT = { name: "DevOps", line: "DevOps & cloud", root: "../../index.html" };

const CHAPTERS = [
  { n: "01", f: "01-orientation.html", t: "What DevOps actually is", p: "Foundations" },
  { n: "02", f: "02-linux.html", t: "The Linux machine underneath", p: "Foundations" },
  { n: "03", f: "03-shell.html", t: "The shell and scripting", p: "Foundations" },
  { n: "04", f: "04-networking.html", t: "Networking for operators", p: "Foundations" },
  { n: "05", f: "05-git.html", t: "Version control as infrastructure", p: "Source and servers" },
  { n: "06", f: "06-web-servers.html", t: "Web servers, proxies and load balancers", p: "Source and servers" },
  { n: "07", f: "07-dns-tls.html", t: "DNS, TLS and certificates", p: "Source and servers" },
  { n: "08", f: "08-caching-edge.html", t: "Caching and the edge", p: "Source and servers" },
  { n: "09", f: "09-containers.html", t: "Containers from first principles", p: "Containers" },
  { n: "10", f: "10-images.html", t: "Building images", p: "Containers" },
  { n: "11", f: "11-orchestration.html", t: "Orchestration and scheduling", p: "Containers" },
  { n: "12", f: "12-service-networking.html", t: "Service networking, ingress and mesh", p: "Containers" },
  { n: "13", f: "13-cloud.html", t: "Cloud providers and their primitives", p: "Infrastructure" },
  { n: "14", f: "14-iac.html", t: "Infrastructure as code", p: "Infrastructure" },
  { n: "15", f: "15-config-management.html", t: "Configuration management", p: "Infrastructure" },
  { n: "16", f: "16-serverless.html", t: "Serverless and managed compute", p: "Infrastructure" },
  { n: "17", f: "17-ci.html", t: "Continuous integration", p: "Delivery" },
  { n: "18", f: "18-deployment.html", t: "Deployment strategies", p: "Delivery" },
  { n: "19", f: "19-gitops.html", t: "GitOps and reconciliation", p: "Delivery" },
  { n: "20", f: "20-artifacts.html", t: "Artifacts, registries and supply chain", p: "Delivery" },
  { n: "21", f: "21-secrets.html", t: "Secrets management", p: "Running it" },
  { n: "22", f: "22-observability.html", t: "Monitoring and observability", p: "Running it" },
  { n: "23", f: "23-reliability.html", t: "Reliability, incidents and cost", p: "Running it" },
  { n: "24", f: "24-practice.html", t: "Practice and reference", p: "Reference" }
];

const LIVE = new Set(["index.html", "01-orientation.html", "02-linux.html", "03-shell.html", "04-networking.html", "05-git.html", "06-web-servers.html", "07-dns-tls.html", "08-caching-edge.html", "09-containers.html", "10-images.html", "11-orchestration.html", "12-service-networking.html", "13-cloud.html", "14-iac.html", "15-config-management.html", "16-serverless.html", "17-ci.html", "18-deployment.html", "19-gitops.html", "20-artifacts.html", "21-secrets.html", "22-observability.html", "23-reliability.html", "24-practice.html"]);

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
          primaryColor: "#EFF1FE", primaryTextColor: "#0C1D30", primaryBorderColor: "#7C8CF8",
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
const C = { ink:"#0C1D30", line:"#7C8CF8", lineDk:"#3F4CB8", grid:"#E4EAEF", axis:"#94A3B8",
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
