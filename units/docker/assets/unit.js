/* ============================================================
   Docker — shared manifest, helpers and chapter scaffolding.
   Self-contained: this unit has no dependency on any parent
   directory except the optional catalogue link.
   ============================================================ */

var PARTS = [
  { id: "found",  name: "Foundations",              blurb: "What a container actually is, and the kernel features that make one." },
  { id: "build",  name: "Building images",          blurb: "Dockerfiles, the build cache, multi-stage builds and BuildKit." },
  { id: "run",    name: "Running containers",       blurb: "Lifecycle, resource limits, storage and networking." },
  { id: "compose",name: "Composition and workflow", blurb: "Compose, the development loop, registries and CI." },
  { id: "ops",    name: "Security and operations",  blurb: "Image and runtime hardening, debugging, and what production needs." },
  { id: "beyond", name: "Beyond Docker",            blurb: "The wider ecosystem, Kubernetes, and a reference to keep." }
];

var CHAPTERS = [
  { id: "ch01", n: 1,  p: "found",   mins: 26, demos: 2,
    t: "Orientation: what a container is",
    d: "A process with a restricted view of the machine — not a small virtual machine. Bare metal, VMs and containers compared honestly, and where Docker sits among containerd, runc and the OCI specs." },
  { id: "ch02", n: 2,  p: "found",   mins: 30, demos: 2,
    t: "Namespaces, cgroups and capabilities",
    d: "The three kernel mechanisms that are the whole trick: namespaces restrict what a process sees, cgroups restrict what it may consume, capabilities restrict what it may do." },
  { id: "ch03", n: 3,  p: "found",   mins: 30, demos: 2,
    t: "Images, layers and content addressing",
    d: "An image is a stack of tarballs plus a JSON config, addressed by SHA-256 digest. Why deleting a file in a later layer does not shrink the image." },
  { id: "ch04", n: 4,  p: "found",   mins: 24, demos: 2,
    t: "The CLI and the object model",
    d: "Images, containers, volumes and networks; the client–daemon split; what docker inspect tells you and how to read it." },
  { id: "ch05", n: 5,  p: "build",   mins: 28, demos: 2,
    t: "Dockerfiles: every instruction",
    d: "COPY versus ADD, ENV versus ARG, and the ENTRYPOINT/CMD combination that catches everyone. Shell form versus exec form, and why it decides whether your signals arrive." },
  { id: "ch06", n: 6,  p: "build",   mins: 28, demos: 2,
    t: "The build cache",
    d: "What invalidates a layer, why instruction order is a performance decision, and BuildKit cache mounts for package managers." },
  { id: "ch07", n: 7,  p: "build",   mins: 26, demos: 2,
    t: "Multi-stage builds and small images",
    d: "Build tools in one stage, the artefact in another. Alpine, slim and distroless compared, and what .dockerignore is really protecting you from." },
  { id: "ch08", n: 8,  p: "build",   mins: 28, demos: 2,
    t: "BuildKit, multi-arch and provenance",
    d: "buildx, cross-building for arm64, build secrets that do not land in the image, and attestations that say where an image came from." },
  { id: "ch09", n: 9,  p: "run",     mins: 28, demos: 2,
    t: "docker run, end to end",
    d: "The container lifecycle, restart policies, and PID 1: why your container ignores Ctrl-C and takes ten seconds to stop." },
  { id: "ch10", n: 10, p: "run",     mins: 28, demos: 2,
    t: "Resource limits and the OOM killer",
    d: "CPU quotas, memory limits, and the classic production failure: a runtime that sizes its thread pool and heap from the host rather than the cgroup." },
  { id: "ch11", n: 11, p: "run",     mins: 26, demos: 2,
    t: "Storage: volumes, binds and tmpfs",
    d: "The ephemeral container layer, named volumes versus bind mounts, and the UID mismatch that makes a mounted directory unwritable." },
  { id: "ch12", n: 12, p: "run",     mins: 30, demos: 2,
    t: "Networking",
    d: "Bridge, host, none and overlay; DNS between containers; and why publishing a port can quietly bypass your firewall." },
  { id: "ch13", n: 13, p: "compose", mins: 28, demos: 2,
    t: "Docker Compose",
    d: "Services, healthcheck-aware dependencies, profiles, override files, and the interpolation rules that decide what your variables actually become." },
  { id: "ch14", n: 14, p: "compose", mins: 24, demos: 2,
    t: "The development loop",
    d: "Hot reload that works, attaching a debugger, running the test suite inside the image you ship, and dev containers." },
  { id: "ch15", n: 15, p: "compose", mins: 26, demos: 2,
    t: "Registries and distribution",
    d: "Tags are mutable and digests are not. Tagging strategy, private registries, pull limits, retention, and signing." },
  { id: "ch16", n: 16, p: "compose", mins: 26, demos: 2,
    t: "Containers in CI",
    d: "Build once and promote, cache backends that actually help, multi-arch matrices, and integration tests against real services." },
  { id: "ch17", n: 17, p: "ops",     mins: 28, demos: 2,
    t: "Image security",
    d: "Base image choice, CVE triage that is not just noise, pinning by digest, and why a secret in a build argument is in the image forever." },
  { id: "ch18", n: 18, p: "ops",     mins: 30, demos: 2,
    t: "Runtime security",
    d: "Dropping capabilities, read-only root filesystems, seccomp, user namespaces and rootless mode — and why mounting the Docker socket is handing over the host." },
  { id: "ch19", n: 19, p: "ops",     mins: 26, demos: 2,
    t: "Observability and debugging",
    d: "Log drivers, stats, events, healthchecks and exit codes — plus how to debug a distroless image with no shell in it." },
  { id: "ch20", n: 20, p: "ops",     mins: 28, demos: 2,
    t: "What production needs",
    d: "Why a single host running docker run is not a deployment, graceful shutdown, configuration and secrets, and rolling updates." },
  { id: "ch21", n: 21, p: "beyond",  mins: 26, demos: 2,
    t: "The container ecosystem",
    d: "The OCI specifications, containerd and runc, Podman and nerdctl, and the image builders that never write a Dockerfile." },
  { id: "ch22", n: 22, p: "beyond",  mins: 28, demos: 2,
    t: "Kubernetes from a Docker mindset",
    d: "What maps across, what does not, and the handful of concepts that make Compose habits actively misleading." },
  { id: "ch23", n: 23, p: "beyond",  mins: 28, demos: 2,
    t: "Optimisation and troubleshooting",
    d: "Making images smaller, builds faster and startup quicker — and a catalogue of the failures you will actually meet." },
  { id: "ch24", n: 24, p: "beyond",  mins: 32, demos: 2,
    t: "Practice and reference",
    d: "The model in five sentences, a command reference by task, recipes for when something is broken, a glossary and a quiz." }
];

var LIVE = new Set(["ch01", "ch02", "ch03", "ch04", "ch05", "ch06", "ch07", "ch08", "ch09", "ch10", "ch11", "ch12", "ch13", "ch14", "ch15", "ch16", "ch17", "ch18", "ch19", "ch20", "ch21", "ch22", "ch23", "ch24"]);

/* ==================================================================
 * SHA-256 (FIPS 180-4). Docker addresses layers, configs and
 * manifests by SHA-256 digest, so this is the real function.
 * Verified against Python hashlib.
 * ================================================================== */
var SHA256_K = [
  0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
  0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
  0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
  0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
  0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
  0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
  0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
  0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
];

function sha256Bytes(bytes) {
  var h = [0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19];
  var ml = bytes.length;
  var out = new Uint8Array(((ml + 8) >> 6 << 6) + 64);
  out.set(bytes);
  out[ml] = 0x80;
  var dv = new DataView(out.buffer);
  var bl = ml * 8;
  dv.setUint32(out.length - 8, Math.floor(bl / 4294967296));
  dv.setUint32(out.length - 4, bl >>> 0);
  var w = new Uint32Array(64);
  var rotr = function (x, n) { return ((x >>> n) | (x << (32 - n))) >>> 0; };
  for (var i = 0; i < out.length; i += 64) {
    var j;
    for (j = 0; j < 16; j++) w[j] = dv.getUint32(i + j * 4);
    for (j = 16; j < 64; j++) {
      var s0 = (rotr(w[j - 15], 7) ^ rotr(w[j - 15], 18) ^ (w[j - 15] >>> 3)) >>> 0;
      var s1 = (rotr(w[j - 2], 17) ^ rotr(w[j - 2], 19) ^ (w[j - 2] >>> 10)) >>> 0;
      w[j] = (w[j - 16] + s0 + w[j - 7] + s1) >>> 0;
    }
    var a = h[0], b = h[1], c = h[2], d = h[3], e = h[4], f = h[5], g = h[6], hh = h[7];
    for (j = 0; j < 64; j++) {
      var S1 = (rotr(e, 6) ^ rotr(e, 11) ^ rotr(e, 25)) >>> 0;
      var ch = ((e & f) ^ (~e & g)) >>> 0;
      var t1 = (hh + S1 + ch + SHA256_K[j] + w[j]) >>> 0;
      var S0 = (rotr(a, 2) ^ rotr(a, 13) ^ rotr(a, 22)) >>> 0;
      var maj = ((a & b) ^ (a & c) ^ (b & c)) >>> 0;
      var t2 = (S0 + maj) >>> 0;
      hh = g; g = f; f = e; e = (d + t1) >>> 0;
      d = c; c = b; b = a; a = (t1 + t2) >>> 0;
    }
    h[0] = (h[0] + a) >>> 0; h[1] = (h[1] + b) >>> 0; h[2] = (h[2] + c) >>> 0; h[3] = (h[3] + d) >>> 0;
    h[4] = (h[4] + e) >>> 0; h[5] = (h[5] + f) >>> 0; h[6] = (h[6] + g) >>> 0; h[7] = (h[7] + hh) >>> 0;
  }
  return h.map(function (x) { return x.toString(16).padStart(8, "0"); }).join("");
}
function sha256Text(s) { return sha256Bytes(new TextEncoder().encode(s)); }

function hexToByteArray(hex) {
  var a = new Uint8Array(hex.length / 2);
  for (var i = 0; i < a.length; i++) a[i] = parseInt(hex.substr(i * 2, 2), 16);
  return a;
}

/* HMAC-SHA256: H((K ^ opad) || H((K ^ ipad) || message)) */
function hmacSha256(keyText, msgText) {
  var enc = new TextEncoder();
  var key = enc.encode(keyText);
  if (key.length > 64) key = hexToByteArray(sha256Bytes(key));
  var k = new Uint8Array(64);
  k.set(key);
  var ipad = new Uint8Array(64), opad = new Uint8Array(64);
  for (var i = 0; i < 64; i++) { ipad[i] = k[i] ^ 0x36; opad[i] = k[i] ^ 0x5c; }
  var msg = enc.encode(msgText);
  var inner = new Uint8Array(64 + msg.length);
  inner.set(ipad); inner.set(msg, 64);
  var innerHash = hexToByteArray(sha256Bytes(inner));
  var outer = new Uint8Array(64 + 32);
  outer.set(opad); outer.set(innerHash, 64);
  return sha256Bytes(outer);
}

/* A patch fingerprint in the spirit of git patch-id: hash the diff with all
   whitespace removed and hunk headers dropped, so the same change gets the
   same id regardless of commit metadata, position or indentation. Git's own
   serialisation differs in detail, so the hex here will not equal the output
   of `git patch-id` — the equivalence property is what matters. */

function paintDockerfile(s) {
  var KW = /^(FROM|RUN|CMD|LABEL|MAINTAINER|EXPOSE|ENV|ADD|COPY|ENTRYPOINT|VOLUME|USER|WORKDIR|ARG|ONBUILD|STOPSIGNAL|HEALTHCHECK|SHELL)\b/;
  return escapeHtml(s).split("\n").map(function (line) {
    if (/^\s*#/.test(line)) return '<i>' + line + "</i>";
    var m = KW.exec(line.replace(/^\s+/, ""));
    if (m) {
      var lead = line.slice(0, line.length - line.replace(/^\s+/, "").length);
      var rest = line.replace(/^\s+/, "").slice(m[0].length);
      rest = rest.replace(/(--[a-z-]+=?)/g, '<u>$1</u>');
      return lead + "<b>" + m[0] + "</b>" + rest;
    }
    return line;
  }).join("\n");
}
function escapeHtml(s) {
  return s.replace(/[&<>]/g, function (c) {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c];
  });
}

function paintShell(s) {
  /* Alternation is scanned leftmost-first, so a # inside a quoted string is
     consumed by the string rule before the comment rule can see it. */
  return s.replace(
    /(^|\n)(\$)( )|(^|\n|[ \t])(#[^\n]*)|('[^'\n]*')|("[^"\n]*")|(\s)(--?[A-Za-z][\w-]*)/g,
    function (m, nl1, sym, sp, lead, cmt, sq, dq, ws, flag) {
      if (cmt !== undefined) return lead + '<span class="c">' + cmt + "</span>";
      if (sq !== undefined) return '<span class="s">' + sq + "</span>";
      if (dq !== undefined) return '<span class="s">' + dq + "</span>";
      if (flag !== undefined) return ws + '<span class="o">' + flag + "</span>";
      return nl1 + '<span class="p">' + sym + "</span>" + sp;
    }
  );
}

function paintYaml(s) {
  return s.replace(
    /(^|\n)(\s*#[^\n]*)|(^|\n)(\s*-?\s*)([A-Za-z_][\w.-]*)(:)|('[^'\n]*'|"[^"\n]*")|(\$\{\{[^}]*\}\})/g,
    function (m, nl1, cmt, nl2, lead, key, colon, str, expr) {
      if (cmt !== undefined) return nl1 + '<span class="c">' + cmt + "</span>";
      if (str !== undefined) return '<span class="s">' + str + "</span>";
      if (expr !== undefined) return '<span class="o">' + expr + "</span>";
      return nl2 + lead + '<span class="y">' + key + "</span>" + colon;
    }
  );
}

function paintDiff(s) {
  return s
    .split("\n")
    .map(function (line) {
      if (/^@@/.test(line)) return '<span class="h">' + line + "</span>";
      if (/^\+/.test(line)) return '<span class="a">' + line + "</span>";
      if (/^-/.test(line)) return '<span class="r">' + line + "</span>";
      return line;
    })
    .join("\n");
}

function paintCode(root) {
  var blocks = (root || document).querySelectorAll("pre[data-lang]");
  Array.prototype.forEach.call(blocks, function (pre) {
    if (pre.dataset.painted) return;
    var raw = pre.textContent.replace(/\n$/, "");
    pre.dataset.raw = raw;
    var esc = escapeHtml(raw);
    var lang = pre.dataset.lang;
    if (lang === "sh") esc = paintShell(esc);
    else if (lang === "yaml") esc = paintYaml(esc);
    else if (lang === "diff") esc = paintDiff(esc);
    pre.innerHTML = esc;
    pre.dataset.painted = "1";
  });
}

/* ------------------------------------------------------------------ copy */
function wireCopy(root) {
  var btns = (root || document).querySelectorAll(".copy");
  Array.prototype.forEach.call(btns, function (btn) {
    btn.addEventListener("click", function () {
      var block = btn.closest(".code");
      var pre = block && block.querySelector("pre");
      if (!pre) return;
      var text = pre.dataset.raw !== undefined ? pre.dataset.raw : pre.textContent;
      var done = function () {
        btn.textContent = "Copied";
        btn.classList.add("done");
        setTimeout(function () {
          btn.textContent = "Copy";
          btn.classList.remove("done");
        }, 1400);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done, function () { fallback(text, done); });
      } else {
        fallback(text, done);
      }
    });
  });
  function fallback(text, done) {
    var ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand("copy"); done(); } catch (e) { /* nothing to do */ }
    document.body.removeChild(ta);
  }
}

/* ------------------------------------------------------- chapter scaffold */
function buildRail(main, side) {
  var sections = main.querySelectorAll("section[id]");
  if (!sections.length) return [];
  var h = document.createElement("h2");
  h.textContent = "On this page";
  var ol = document.createElement("ol");
  var links = [];
  Array.prototype.forEach.call(sections, function (sec, i) {
    var head = sec.querySelector("h2");
    if (!head) return;
    var li = document.createElement("li");
    var a = document.createElement("a");
    a.href = "#" + sec.id;
    var n = document.createElement("span");
    n.className = "n";
    n.textContent = String(i + 1).padStart(2, "0");
    a.appendChild(n);
    a.appendChild(document.createTextNode(head.dataset.nav || head.textContent));
    li.appendChild(a);
    ol.appendChild(li);
    links.push({ a: a, sec: sec });
  });
  side.appendChild(h);
  side.appendChild(ol);
  return links;
}

function spy(links) {
  if (!links.length || !("IntersectionObserver" in window)) return;
  var map = new Map();
  links.forEach(function (l) { map.set(l.sec, l.a); });
  var seen = new Set();
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) seen.add(e.target); else seen.delete(e.target);
    });
    var first = null;
    links.forEach(function (l) { if (!first && seen.has(l.sec)) first = l; });
    links.forEach(function (l) { l.a.classList.toggle("on", first !== null && l === first); });
  }, { rootMargin: "-12% 0px -70% 0px", threshold: 0 });
  links.forEach(function (l) { io.observe(l.sec); });
}

function progressBar() {
  var bar = document.querySelector("#prog i");
  var top = document.querySelector(".top");
  if (!bar) return;
  var tick = function () {
    var h = document.documentElement;
    var max = h.scrollHeight - h.clientHeight;
    var pct = max > 0 ? (h.scrollTop / max) * 100 : 0;
    bar.style.width = pct.toFixed(2) + "%";
    if (top) top.classList.toggle("show", h.scrollTop > 700);
  };
  var queued = false;
  window.addEventListener("scroll", function () {
    if (queued) return;
    queued = true;
    requestAnimationFrame(function () { tick(); queued = false; });
  }, { passive: true });
  tick();
}

function liveList() {
  return CHAPTERS.filter(function (c) { return LIVE.has(c.id); });
}

function buildPager(main, id) {
  var live = liveList();
  var i = live.findIndex(function (c) { return c.id === id; });
  if (i < 0) return;
  var prev = i > 0 ? live[i - 1] : null;
  var next = i < live.length - 1 ? live[i + 1] : null;
  var wrap = document.createElement("nav");
  wrap.className = "pager";
  wrap.setAttribute("aria-label", "Chapter navigation");
  wrap.innerHTML =
    (prev
      ? '<a href="' + prev.id + '.html"><span class="dir">Previous</span><span class="ttl">' + prev.n + ". " + escapeHtml(prev.t) + "</span></a>"
      : '<a class="none" href="index.html"><span class="dir">Start</span><span class="ttl">Unit contents</span></a>') +
    (next
      ? '<a class="next" href="' + next.id + '.html"><span class="dir">Next</span><span class="ttl">' + next.n + ". " + escapeHtml(next.t) + "</span></a>"
      : '<a class="next none" href="index.html"><span class="dir">Next</span><span class="ttl">Not written yet — back to contents</span></a>');
  main.appendChild(wrap);
  return { prev: prev, next: next };
}

function keys(nav) {
  document.addEventListener("keydown", function (e) {
    var t = e.target;
    if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) return;
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    if (e.key === "[" && nav && nav.prev) location.href = nav.prev.id + ".html";
    if (e.key === "]" && nav && nav.next) location.href = nav.next.id + ".html";
    if (e.key === "t") window.scrollTo({ top: 0, behavior: "smooth" });
    if (e.key === "c") location.href = "index.html";
  });
}

function initChapter() {
  var main = document.querySelector("main");
  var side = document.querySelector(".side");
  if (main && side) spy(buildRail(main, side));
  paintCode(document);
  wireCopy(document);
  progressBar();
  var top = document.querySelector(".top");
  if (top) top.addEventListener("click", function () { window.scrollTo({ top: 0, behavior: "smooth" }); });
  var nav = main ? buildPager(main, document.body.dataset.ch) : null;
  keys(nav);
}

/* ------------------------------------------------------------------- hub */
function initHub() {
  var host = document.getElementById("parts");
  if (!host) return;
  PARTS.forEach(function (part) {
    var chs = CHAPTERS.filter(function (c) { return c.p === part.id; });
    var done = chs.filter(function (c) { return LIVE.has(c.id); }).length;
    var sec = document.createElement("section");
    sec.className = "part";

    var head = document.createElement("div");
    head.className = "part-head";
    var h = document.createElement("h2");
    h.textContent = part.name;
    var pn = document.createElement("span");
    pn.className = "pn";
    pn.textContent = done + " of " + chs.length + " written";
    head.appendChild(h);
    head.appendChild(pn);

    var rule = document.createElement("div");
    rule.className = "part-rule";
    if (!done) rule.style.opacity = ".25";

    var blurb = document.createElement("p");
    blurb.style.cssText = "font-family:var(--serif);color:var(--text-2);margin:-6px 0 14px;font-size:15px";
    blurb.textContent = part.blurb;

    var grid = document.createElement("div");
    grid.className = "chs";
    chs.forEach(function (c) {
      var live = LIVE.has(c.id);
      var card = document.createElement(live ? "a" : "div");
      card.className = "ch" + (live ? "" : " soon");
      if (live) card.href = c.id + ".html";
      var num = document.createElement("span");
      num.className = "num";
      num.textContent = String(c.n).padStart(2, "0");
      var body = document.createElement("div");
      var t = document.createElement("p");
      t.className = "t";
      t.textContent = c.t;
      var d = document.createElement("p");
      d.className = "d";
      d.textContent = c.d;
      body.appendChild(t);
      body.appendChild(d);
      card.appendChild(num);
      card.appendChild(body);
      if (!live) {
        var flag = document.createElement("span");
        flag.className = "flag";
        flag.textContent = "Planned";
        card.appendChild(flag);
      }
      grid.appendChild(card);
    });

    sec.appendChild(head);
    sec.appendChild(rule);
    sec.appendChild(blurb);
    sec.appendChild(grid);
    host.appendChild(sec);
  });

  var live = liveList();
  var set = function (id, val) {
    var n = document.getElementById(id);
    if (n) n.textContent = val;
  };
  set("s-live", live.length + " of " + CHAPTERS.length);
  set("s-demos", CHAPTERS.reduce(function (a, c) { return a + c.demos; }, 0));
  set("s-mins", Math.round(CHAPTERS.reduce(function (a, c) { return a + c.mins; }, 0) / 60) + " hours");
  set("s-parts", PARTS.length);
  var start = document.getElementById("start");
  if (start && live.length) start.href = live[0].id + ".html";
  paintCode(document);
  wireCopy(document);
  progressBar();
  var top = document.querySelector(".top");
  if (top) top.addEventListener("click", function () { window.scrollTo({ top: 0, behavior: "smooth" }); });
}
