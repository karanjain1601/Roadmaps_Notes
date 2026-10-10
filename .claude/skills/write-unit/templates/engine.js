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
  var demos = CHAPTERS.reduce(function (a, c) { return a + c.demos; }, 0);
  set("s-live", live.length + " of " + CHAPTERS.length + " chapters written");
  set("s-demos", demos + " demos");
  set("s-mins", Math.round(CHAPTERS.reduce(function (a, c) { return a + c.mins; }, 0) / 60) + " hours");
  set("s-parts", PARTS.length + " parts");
  set("start", live.length === CHAPTERS.length
    ? "Complete: all " + CHAPTERS.length + " chapters are written."
    : live.length + " of " + CHAPTERS.length + " chapters written so far. Planned chapters are listed but not linked.");
  paintCode(document);
  wireCopy(document);
  progressBar();
  var top = document.querySelector(".top");
  if (top) top.addEventListener("click", function () { window.scrollTo({ top: 0, behavior: "smooth" }); });
}
