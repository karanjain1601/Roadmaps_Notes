#!/usr/bin/env node
/* Runtime pass for check_unit.py.

   node smoke.js <unit dir> <file.html>...

   Loads each page in jsdom with its scripts, then:
     - hub: #parts must have been filled by initHub()
     - chapter: the rail and the pager must exist (initChapter() ran)
     - every .demo must show something on load (.term / .rgrid / .readout non-empty)
     - every demo control is driven — buttons clicked, selects stepped through,
       ranges pushed to both ends, text fields emptied and edited — and any
       exception is reported against the control that caused it.

   Prints a JSON array of {level, file, msg}. Network is blocked; only files
   under file:// load. */
"use strict";
const path = require("path");
const { JSDOM, VirtualConsole, requestInterceptor } = require("jsdom");

const argv = process.argv.slice(2);
const liveArg = argv.find((a) => a.startsWith("--live="));
const LIVE = liveArg ? new Set(liveArg.slice(7).split(",").filter(Boolean)) : null;
const [unitDir, ...files] = argv.filter((a) => a !== liveArg);
const out = [];
const push = (level, file, msg) => out.push({ level, file, msg });

/* Local files load; anything else (the font stylesheet) gets an empty answer. */
const localOnly = {
  interceptors: [
    requestInterceptor((request) => {
      if (!request.url.startsWith("file:")) return new Response("", { status: 200, headers: { "Content-Type": "text/css" } });
    }),
  ],
};

function fakeContext() {
  const t = {
    measureText: (s) => ({ width: String(s).length * 6, actualBoundingBoxAscent: 8, actualBoundingBoxDescent: 2 }),
    getImageData: (x, y, w, h) => ({ data: new Uint8ClampedArray(Math.max(1, w * h * 4)), width: w, height: h }),
    createImageData: (w, h) => ({ data: new Uint8ClampedArray(Math.max(1, w * h * 4)), width: w, height: h }),
    createLinearGradient: () => ({ addColorStop() {} }),
    createRadialGradient: () => ({ addColorStop() {} }),
    createConicGradient: () => ({ addColorStop() {} }),
    getLineDash: () => [],
    getTransform: () => ({ a: 1, b: 0, c: 0, d: 1, e: 0, f: 0 }),
    isPointInPath: () => false,
  };
  return new Proxy(t, {
    get(target, k) { return k in target ? target[k] : (typeof k === "string" ? function () {} : undefined); },
    set(target, k, v) { target[k] = v; return true; },
  });
}

/* Inline scripts as {start, lines}, so a script-relative line can be mapped
   back to a line in the HTML file. */
const scriptSpans = {};
function spansOf(file) {
  if (scriptSpans[file]) return scriptSpans[file];
  const src = require("fs").readFileSync(path.join(unitDir, file), "utf8");
  const spans = [];
  const re = /<script>([\s\S]*?)<\/script>/g;
  let m;
  while ((m = re.exec(src))) {
    spans.push({ start: src.slice(0, m.index).split("\n").length, lines: m[1].split("\n").length });
  }
  return (scriptSpans[file] = spans);
}

/* The first stack frame inside the unit's own files, as " (ch05.html:461)". */
function where(stack) {
  const m = /([\w.-]+\.(?:html|js)):(\d+):\d+/.exec(
    stack.split("\n").filter((l) => !/node_modules|node:internal|smoke\.js/.test(l)).join("\n"));
  if (!m) return "";
  const [, f, n] = m, line = +n;
  if (f.endsWith(".html")) {
    const fit = spansOf(f).filter((s) => s.lines >= line);
    if (fit.length === 1) return ` (${f}:${fit[0].start + line - 1})`;
    return ` (${f}, line ${line} of an inline script)`;
  }
  return ` (${f}:${line})`;
}

function label(el) {
  const txt = (el.textContent || el.value || "").trim().replace(/\s+/g, " ").slice(0, 40);
  return el.tagName.toLowerCase() + (el.id ? "#" + el.id : "") + (txt ? ` "${txt}"` : "");
}

async function run(file) {
  const errors = [];
  const vc = new VirtualConsole();
  vc.on("jsdomError", (e) => {
    const stack = String((e && e.stack) || e);
    const first = stack.split("\n")[0].replace(/^Error: Uncaught \[(.*)\]$/, "$1");
    if (/Not implemented/.test(stack)) return errors.push({ soft: true, msg: first });
    const orig = e && (e.detail || e.cause);
    errors.push({ soft: false, msg: first + where(String((orig && orig.stack) || stack)) });
  });
  vc.on("error", (...a) => errors.push({ soft: true, msg: "console.error: " + a.join(" ").slice(0, 200) }));

  const full = path.join(unitDir, file);
  const dom = await JSDOM.fromFile(full, {
    runScripts: "dangerously",
    resources: localOnly,
    pretendToBeVisual: true,
    virtualConsole: vc,
    beforeParse(w) {
      w.HTMLCanvasElement.prototype.getContext = function () { return fakeContext(); };
      w.HTMLCanvasElement.prototype.toDataURL = function () { return "data:,"; };
      w.Element.prototype.scrollIntoView = function () {};
      /* Every browser has IntersectionObserver; jsdom does not, and older unit
         engines call it unguarded. A no-op keeps their init running. */
      if (!w.IntersectionObserver) {
        w.IntersectionObserver = function () { return { observe() {}, unobserve() {}, disconnect() {}, takeRecords() { return []; } }; };
      }
      if (!w.ResizeObserver) {
        w.ResizeObserver = function () { return { observe() {}, unobserve() {}, disconnect() {} }; };
      }
      w.scrollTo = w.scrollBy = function () {};
      w.matchMedia = (q) => ({ matches: false, media: q, addListener() {}, removeListener() {}, addEventListener() {}, removeEventListener() {} });
      w.alert = function () {};
      w.confirm = function () { return true; };
      w.prompt = function () { return null; };
    },
  });
  const w = dom.window, doc = w.document;
  await new Promise((resolve) => {
    if (doc.readyState === "complete") return resolve();
    w.addEventListener("load", resolve);
    setTimeout(resolve, 8000);
  });
  await new Promise((r) => setTimeout(r, 60));

  const report = (ctx) => {
    while (errors.length) {
      const e = errors.shift();
      push(e.soft ? "warn" : "error", file, (ctx ? ctx + ": " : "") + e.msg);
    }
  };
  report("on load");

  if (file === "index.html") {
    const parts = doc.getElementById("parts");
    if (!parts || !parts.children.length) push("error", file, "#parts is empty after load — initHub() failed or assets/unit.js did not load");
  } else {
    if (!doc.querySelector(".side ol")) push("error", file, "the rail was not built — initChapter() failed or assets/unit.js did not load");
    const live = !LIVE || LIVE.has(file.replace(/\.html$/, ""));
    if (live && !doc.querySelector(".pager")) push("error", file, "no pager — does <body data-ch> match the file name?");
  }

  const demos = Array.from(doc.querySelectorAll(".demo"));
  const emptyOutputs = (d) =>
    Array.from(d.querySelectorAll(".term, .rgrid, .readout")).filter((el) => !el.textContent.trim());
  demos.forEach((d, i) => {
    const name = ((d.querySelector(".demo-top h3") || {}).textContent || `demo ${i + 1}`).trim();
    const emptyAtLoad = new Set(emptyOutputs(d));
    for (const el of emptyAtLoad) {
      push("error", file, `${name}: ${el.className.split(" ")[0]}${el.id ? "#" + el.id : ""} is empty on load — call render() once at the end of the demo`);
    }

    let actions = 0;
    const act = (el, fn) => {
      if (actions++ > 250) return;
      try { fn(); } catch (e) { const s = String(e && e.stack || e); errors.push({ soft: false, msg: s.split("\n")[0] + where(s) }); }
      report(`${name}: ${label(el)}`);
    };
    const fire = (el, type) => el.dispatchEvent(new w.Event(type, { bubbles: true }));

    for (const el of Array.from(d.querySelectorAll("button, select, input, textarea"))) {
      if (!el.isConnected || el.disabled) continue;
      const tag = el.tagName.toLowerCase(), type = (el.getAttribute("type") || "").toLowerCase();
      if (tag === "button" || type === "checkbox" || type === "radio") {
        act(el, () => el.click());
      } else if (tag === "select") {
        const orig = el.selectedIndex;
        for (let k = 0; k < el.options.length; k++) act(el, () => { el.selectedIndex = k; fire(el, "input"); fire(el, "change"); });
        act(el, () => { el.selectedIndex = orig; fire(el, "change"); });
      } else if (type === "range" || type === "number") {
        const orig = el.value;
        for (const v of [el.min || "0", el.max || "100", orig]) act(el, () => { el.value = v; fire(el, "input"); fire(el, "change"); });
      } else {
        const orig = el.value;
        for (const v of ["", orig + " x", orig]) act(el, () => { el.value = v; fire(el, "input"); fire(el, "change"); });
      }
    }
    for (const el of emptyOutputs(d)) {
      if (!emptyAtLoad.has(el)) {
        push("warn", file, `${name}: ${el.className.split(" ")[0]}${el.id ? "#" + el.id : ""} rendered on load but is empty after the controls were exercised`);
      }
    }
  });

  await new Promise((r) => setTimeout(r, 30));
  report("after interaction");
  w.close();
}

(async () => {
  for (const f of files) {
    try { await run(f); } catch (e) { push("error", f, "could not load: " + String(e && e.message || e)); }
  }
  process.stdout.write(JSON.stringify(out));
})();
