/* ============================================================
   Roadmap Notes — unit runtime
   Unit: Machine Learning
   Every page loads this. It builds the sidebar, the chapter
   strip and the prev/next links from the CHAPTERS manifest
   below, so adding a page means editing one array.
   Also exports Plot — a tiny canvas helper the demos share.
   ============================================================ */
(function () {
"use strict";

/* ---------- 1. the manifest ---------------------------------- */
const UNIT = { name: "Machine Learning", line: "Data & AI", root: "../../index.html" };

const CHAPTERS = [
  { n: "01", f: "01-role.html",           t: "The role and the map",        p: "Orientation" },
  { n: "02", f: "02-linear-algebra.html", t: "Linear algebra",              p: "Mathematical foundations" },
  { n: "03", f: "03-calculus.html",       t: "Calculus and optimisation",   p: "Mathematical foundations" },
  { n: "04", f: "04-probability.html",    t: "Probability",                 p: "Mathematical foundations" },
  { n: "05", f: "05-statistics.html",     t: "Statistics",                  p: "Mathematical foundations" },
  { n: "06", f: "06-python-stack.html",   t: "Python and the stack",        p: "Tools" },
  { n: "07", f: "07-data-collection.html",t: "Collecting data",             p: "Working with data" },
  { n: "08", f: "08-preprocessing.html",  t: "Cleaning and preprocessing",  p: "Working with data" },
  { n: "09", f: "09-features.html",       t: "Features and dimensionality", p: "Working with data" },
  { n: "10", f: "10-learning.html",       t: "How learning works",          p: "Core machine learning" },
  { n: "11", f: "11-regression.html",     t: "Regression",                  p: "Core machine learning" },
  { n: "12", f: "12-classification.html", t: "Classification",              p: "Core machine learning" },
  { n: "13", f: "13-unsupervised.html",   t: "Unsupervised learning",       p: "Core machine learning" },
  { n: "14", f: "14-reinforcement.html",  t: "Reinforcement learning",      p: "Core machine learning" },
  { n: "15", f: "15-evaluation.html",     t: "Evaluating models",           p: "Core machine learning" },
  { n: "16", f: "16-neural-networks.html",t: "Neural networks",             p: "Deep learning" },
  { n: "17", f: "17-cnn.html",            t: "Convolutional networks",      p: "Deep learning" },
  { n: "18", f: "18-sequence.html",       t: "Sequence models",             p: "Deep learning" },
  { n: "19", f: "19-transformers.html",   t: "Transformers",                p: "Deep learning" },
  { n: "20", f: "20-generative.html",     t: "Generative models",           p: "Deep learning" },
  { n: "21", f: "21-nlp.html",            t: "Natural language processing", p: "Beyond the model" },
  { n: "22", f: "22-explainability.html", t: "Explainability and fairness", p: "Beyond the model" },
  { n: "23", f: "23-production.html",     t: "From notebook to production", p: "Beyond the model" },
  { n: "24", f: "24-practice.html",       t: "Practice and reference",      p: "Beyond the model" }
];

/* pages that exist on disk — the rest render as pending */
const LIVE = new Set(["index.html", "01-role.html", "02-linear-algebra.html", "03-calculus.html", "04-probability.html", "05-statistics.html", "06-python-stack.html", "07-data-collection.html", "08-preprocessing.html", "09-features.html", "10-learning.html", "11-regression.html", "12-classification.html", "13-unsupervised.html", "14-reinforcement.html", "15-evaluation.html", "16-neural-networks.html", "17-cnn.html", "18-sequence.html", "19-transformers.html", "20-generative.html", "21-nlp.html", "22-explainability.html", "23-production.html", "24-practice.html"]);

const here = (location.pathname.split("/").pop() || "index.html");
const idx = CHAPTERS.findIndex(c => c.f === here);

/* ---------- 2. chapter strip in the band --------------------- */
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

/* ---------- 3. sidebar --------------------------------------- */
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
  html += '</ol></div>';
  html += '<div class="inpage" id="inpage"></div>';
  html += '<div class="side-tools"><a href="index.html">Unit home</a><a href="' + UNIT.root + '">All units</a><button id="btnPrint">Print</button></div>';
  side.innerHTML = html;

  /* on-page headings */
  const heads = [...document.querySelectorAll("main > section[id] > h2")];
  const ip = document.getElementById("inpage");
  if (heads.length && ip) {
    ip.innerHTML = heads.map(h => '<a href="#' + h.parentElement.id + '">' + h.textContent.replace(/^\d+\.\s*/, "") + "</a>").join("");
  }
  const bp = document.getElementById("btnPrint");
  if (bp) bp.addEventListener("click", () => window.print());
}

/* ---------- 4. prev / next ----------------------------------- */
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

/* ---------- 5. reading progress + scrollspy ------------------ */
const prog = document.getElementById("prog");
const top = document.getElementById("toTop");
const secs = [...document.querySelectorAll("main > section[id]")];
const ipLinks = () => [...document.querySelectorAll("#inpage a")];

function onScroll() {
  const h = document.documentElement;
  const max = h.scrollHeight - h.clientHeight;
  const pct = max > 0 ? (h.scrollTop / max) * 100 : 0;
  if (prog) prog.style.width = pct + "%";
  if (top) top.classList.toggle("show", h.scrollTop > 700);
  if (secs.length) {
    let cur = secs[0].id;
    for (const s of secs) { if (s.getBoundingClientRect().top < 130) cur = s.id; }
    ipLinks().forEach(a => a.classList.toggle("on", a.getAttribute("href") === "#" + cur));
  }
}
addEventListener("scroll", onScroll, { passive: true });
addEventListener("resize", onScroll);
onScroll();
if (top) top.addEventListener("click", () => scrollTo({ top: 0, behavior: "smooth" }));

/* ---------- 6. word count / reading time --------------------- */
const mw = document.getElementById("mWords"), mt = document.getElementById("mTime");
if (mw || mt) {
  const words = (document.querySelector("main")?.innerText || "").trim().split(/\s+/).length;
  if (mw) mw.textContent = words.toLocaleString();
  if (mt) mt.textContent = Math.max(1, Math.round(words / 210));
}

/* ---------- 7. copy buttons ---------------------------------- */
document.querySelectorAll(".code").forEach(block => {
  const btn = block.querySelector(".code-copy");
  const pre = block.querySelector("pre");
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

/* ---------- 8. self-check reveals ---------------------------- */
document.querySelectorAll(".check .reveal").forEach(b => {
  b.addEventListener("click", () => {
    const a = b.nextElementSibling;
    if (!a) return;
    const open = a.classList.toggle("show");
    b.textContent = open ? "Hide answer" : "Show answer";
  });
});

/* ---------- 9. mermaid + katex ------------------------------- */
addEventListener("load", () => {
  if (window.mermaid) {
    try {
      window.mermaid.initialize({
        startOnLoad: true, securityLevel: "loose",
        theme: "base", fontFamily: "Archivo, Helvetica, Arial, sans-serif",
        themeVariables: {
          primaryColor: "#FBEAF2", primaryTextColor: "#0C1D30", primaryBorderColor: "#E0699F",
          lineColor: "#54677A", secondaryColor: "#EAF1F7", tertiaryColor: "#F4F7F9",
          fontSize: "13px", clusterBkg: "#F5F8FA", clusterBorder: "#CFD8E0"
        },
        flowchart: { curve: "basis", useMaxWidth: true, padding: 12 }
      });
      window.mermaid.run?.();
    } catch (e) { console.warn("mermaid failed", e); }
  }
  if (window.renderMathInElement) {
    try {
      window.renderMathInElement(document.body, {
        delimiters: [
          { left: "$$", right: "$$", display: true },
          { left: "\\[", right: "\\]", display: true },
          { left: "\\(", right: "\\)", display: false }
        ],
        throwOnError: false, strict: false
      });
    } catch (e) { console.warn("katex failed", e); }
  }
  onScroll();
});

/* ============================================================
   Plot — shared canvas helper for the demos
   ============================================================ */
const C = {
  ink: "#0C1D30", line: "#E0699F", lineDk: "#B84C7E", grid: "#E4EAEF",
  axis: "#94A3B8", text: "#54677A", ok: "#2E9E6B", bad: "#D9534F",
  info: "#3E8FD0", warn: "#D98324", purple: "#8B6FD4", card: "#FFFFFF"
};

function Plot(canvas, opts) {
  const o = Object.assign({ xr: [0, 1], yr: [0, 1], pad: [30, 14, 30, 44], grid: true, ratio: 0.58 }, opts || {});
  const ctx = canvas.getContext("2d");
  const api = { ctx, canvas, o, C };

  api.size = function () {
    const dpr = Math.min(devicePixelRatio || 1, 2);
    const w = canvas.clientWidth || 640;
    const h = o.height || Math.round(w * o.ratio);
    canvas.width = w * dpr; canvas.height = h * dpr;
    canvas.style.height = h + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    api.w = w; api.h = h;
    api.L = o.pad[3]; api.R = w - o.pad[1]; api.T = o.pad[0]; api.B = h - o.pad[2];
    return api;
  };
  api.X = v => api.L + (v - o.xr[0]) / (o.xr[1] - o.xr[0]) * (api.R - api.L);
  api.Y = v => api.B - (v - o.yr[0]) / (o.yr[1] - o.yr[0]) * (api.B - api.T);
  api.invX = px => o.xr[0] + (px - api.L) / (api.R - api.L) * (o.xr[1] - o.xr[0]);
  api.invY = py => o.yr[0] + (api.B - py) / (api.B - api.T) * (o.yr[1] - o.yr[0]);

  api.clear = function (bg) {
    ctx.clearRect(0, 0, api.w, api.h);
    if (bg !== false) { ctx.fillStyle = "#FBFCFD"; ctx.fillRect(0, 0, api.w, api.h); }
    return api;
  };
  api.axes = function (cfg) {
    const c = Object.assign({ xt: 5, yt: 5, xl: "", yl: "", fmt: v => (Math.abs(v) < 1e-9 ? "0" : (+v.toFixed(2)).toString()) }, cfg || {});
    ctx.save(); ctx.font = "11px Archivo, Arial, sans-serif"; ctx.textBaseline = "middle";
    for (let i = 0; i <= c.xt; i++) {
      const v = o.xr[0] + (o.xr[1] - o.xr[0]) * i / c.xt, x = api.X(v);
      if (o.grid) { ctx.strokeStyle = C.grid; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(x, api.T); ctx.lineTo(x, api.B); ctx.stroke(); }
      ctx.fillStyle = C.text; ctx.textAlign = "center"; ctx.fillText(c.fmt(v), x, api.B + 13);
    }
    for (let i = 0; i <= c.yt; i++) {
      const v = o.yr[0] + (o.yr[1] - o.yr[0]) * i / c.yt, y = api.Y(v);
      if (o.grid) { ctx.strokeStyle = C.grid; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(api.L, y); ctx.lineTo(api.R, y); ctx.stroke(); }
      ctx.fillStyle = C.text; ctx.textAlign = "right"; ctx.fillText(c.fmt(v), api.L - 7, y);
    }
    ctx.strokeStyle = C.axis; ctx.lineWidth = 1.2;
    ctx.beginPath(); ctx.moveTo(api.L, api.T); ctx.lineTo(api.L, api.B); ctx.lineTo(api.R, api.B); ctx.stroke();
    if (c.xl) { ctx.fillStyle = C.text; ctx.textAlign = "center"; ctx.font = "600 11.5px Archivo, Arial"; ctx.fillText(c.xl, (api.L + api.R) / 2, api.B + 26); }
    if (c.yl) { ctx.save(); ctx.translate(13, (api.T + api.B) / 2); ctx.rotate(-Math.PI / 2); ctx.fillStyle = C.text; ctx.textAlign = "center"; ctx.font = "600 11.5px Archivo, Arial"; ctx.fillText(c.yl, 0, 0); ctx.restore(); }
    ctx.restore(); return api;
  };
  api.fn = function (f, color, width, dash) {
    ctx.save(); ctx.strokeStyle = color || C.line; ctx.lineWidth = width || 2;
    if (dash) ctx.setLineDash(dash);
    ctx.beginPath(); let started = false;
    for (let px = api.L; px <= api.R; px += 1) {
      const y = f(api.invX(px));
      if (!isFinite(y)) { started = false; continue; }
      const py = api.Y(y);
      if (py < api.T - 400 || py > api.B + 400) { started = false; continue; }
      started ? ctx.lineTo(px, py) : (ctx.moveTo(px, py), started = true);
    }
    ctx.stroke(); ctx.restore(); return api;
  };
  api.path = function (pts, color, width, dash) {
    if (!pts.length) return api;
    ctx.save(); ctx.strokeStyle = color || C.line; ctx.lineWidth = width || 2;
    if (dash) ctx.setLineDash(dash);
    ctx.beginPath(); pts.forEach((p, i) => i ? ctx.lineTo(api.X(p[0]), api.Y(p[1])) : ctx.moveTo(api.X(p[0]), api.Y(p[1])));
    ctx.stroke(); ctx.restore(); return api;
  };
  api.dot = function (x, y, r, fill, stroke) {
    ctx.save(); ctx.beginPath(); ctx.arc(api.X(x), api.Y(y), r || 4, 0, 7);
    ctx.fillStyle = fill || C.line; ctx.fill();
    if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = 1.6; ctx.stroke(); }
    ctx.restore(); return api;
  };
  api.seg = function (x1, y1, x2, y2, color, width, dash) {
    ctx.save(); ctx.strokeStyle = color || C.axis; ctx.lineWidth = width || 1.4;
    if (dash) ctx.setLineDash(dash);
    ctx.beginPath(); ctx.moveTo(api.X(x1), api.Y(y1)); ctx.lineTo(api.X(x2), api.Y(y2)); ctx.stroke(); ctx.restore(); return api;
  };
  api.arrow = function (x1, y1, x2, y2, color, width) {
    const X1 = api.X(x1), Y1 = api.Y(y1), X2 = api.X(x2), Y2 = api.Y(y2);
    const a = Math.atan2(Y2 - Y1, X2 - X1), hl = 9;
    ctx.save(); ctx.strokeStyle = ctx.fillStyle = color || C.ink; ctx.lineWidth = width || 2;
    ctx.beginPath(); ctx.moveTo(X1, Y1); ctx.lineTo(X2 - Math.cos(a) * hl * .8, Y2 - Math.sin(a) * hl * .8); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(X2, Y2);
    ctx.lineTo(X2 - hl * Math.cos(a - .38), Y2 - hl * Math.sin(a - .38));
    ctx.lineTo(X2 - hl * Math.cos(a + .38), Y2 - hl * Math.sin(a + .38));
    ctx.closePath(); ctx.fill(); ctx.restore(); return api;
  };
  api.label = function (x, y, text, color, align, font) {
    ctx.save(); ctx.fillStyle = color || C.text; ctx.textAlign = align || "left";
    ctx.font = font || "600 11.5px Archivo, Arial, sans-serif"; ctx.textBaseline = "middle";
    ctx.fillText(text, api.X(x), api.Y(y)); ctx.restore(); return api;
  };
  api.px = function (x, y, text, color, align, font) {
    ctx.save(); ctx.fillStyle = color || C.text; ctx.textAlign = align || "left";
    ctx.font = font || "11.5px Archivo, Arial, sans-serif"; ctx.textBaseline = "middle";
    ctx.fillText(text, x, y); ctx.restore(); return api;
  };
  api.legend = function (items, x, y) {
    ctx.save(); ctx.font = "11.5px Archivo, Arial, sans-serif"; ctx.textBaseline = "middle";
    let cx = x == null ? api.L + 8 : x, cy = y == null ? api.T + 10 : y;
    items.forEach(it => {
      ctx.fillStyle = it[1]; ctx.fillRect(cx, cy - 4, 14, 3.5);
      ctx.fillStyle = C.text; ctx.textAlign = "left"; ctx.fillText(it[0], cx + 19, cy);
      cx += 19 + ctx.measureText(it[0]).width + 16;
    });
    ctx.restore(); return api;
  };
  return api.size();
}

/* seeded RNG so demos are reproducible across reloads */
function RNG(seed) {
  let s = seed || 42;
  const r = () => (s = (s * 1664525 + 1013904223) % 4294967296) / 4294967296;
  r.norm = (mu, sd) => {
    const u = Math.max(1e-9, r()), v = r();
    return (mu || 0) + (sd == null ? 1 : sd) * Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  };
  r.pick = arr => arr[Math.floor(r() * arr.length)];
  return r;
}

window.Plot = Plot; window.RNG = RNG; window.PC = C;
window.debounceResize = function (fn) {
  let t; addEventListener("resize", () => { clearTimeout(t); t = setTimeout(fn, 140); });
};
})();
