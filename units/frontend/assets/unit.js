/* ============================================================
   Roadmap Notes — unit runtime
   Unit: Front-end Developer

   Every page in this folder loads this one file. It owns the
   chapter manifest, so adding a chapter means editing two
   arrays here plus the LIVE set — nothing else.

   Also exports Plot: a small canvas helper the demos share so
   each chapter does not re-invent axes and device-pixel scaling.
   ============================================================ */
(function () {
  "use strict";

  /* ---------------------------------------------------------
     1. Manifest
     --------------------------------------------------------- */
  var PARTS = [
    { id: "p1", name: "The platform" },
    { id: "p2", name: "Markup and meaning" },
    { id: "p3", name: "CSS" },
    { id: "p4", name: "JavaScript in the browser" },
    { id: "p5", name: "Building applications" },
    { id: "p6", name: "The toolchain" },
    { id: "p7", name: "Shipping and practice" }
  ];

  var CHAPTERS = [
    { n:  1, p: "p1", f: "ch01.html", t: "What the front end owns" },
    { n:  2, p: "p1", f: "ch02.html", t: "The network path" },
    { n:  3, p: "p1", f: "ch03.html", t: "Inside the rendering engine" },

    { n:  4, p: "p2", f: "ch04.html", t: "HTML documents and semantics" },
    { n:  5, p: "p2", f: "ch05.html", t: "Forms, inputs and validation" },
    { n:  6, p: "p2", f: "ch06.html", t: "Accessibility" },
    { n:  7, p: "p2", f: "ch07.html", t: "Metadata, SEO and sharing" },

    { n:  8, p: "p3", f: "ch08.html", t: "Cascade, specificity and the box model" },
    { n:  9, p: "p3", f: "ch09.html", t: "Layout: flow, flexbox and grid" },
    { n: 10, p: "p3", f: "ch10.html", t: "Responsive and adaptive design" },
    { n: 11, p: "p3", f: "ch11.html", t: "Colour, type, motion and effects" },
    { n: 12, p: "p3", f: "ch12.html", t: "CSS at scale" },

    { n: 13, p: "p4", f: "ch13.html", t: "JavaScript essentials" },
    { n: 14, p: "p4", f: "ch14.html", t: "The DOM and events" },
    { n: 15, p: "p4", f: "ch15.html", t: "Async JavaScript and the event loop" },
    { n: 16, p: "p4", f: "ch16.html", t: "Talking to servers" },
    { n: 17, p: "p4", f: "ch17.html", t: "TypeScript for the front end" },

    { n: 18, p: "p5", f: "ch18.html", t: "Reactivity: how frameworks differ" },
    { n: 19, p: "p5", f: "ch19.html", t: "Components, state and routing" },
    { n: 20, p: "p5", f: "ch20.html", t: "Web components" },
    { n: 21, p: "p5", f: "ch21.html", t: "Rendering strategies" },

    { n: 22, p: "p6", f: "ch22.html", t: "Packages and dependencies" },
    { n: 23, p: "p6", f: "ch23.html", t: "Bundlers and build pipelines" },
    { n: 24, p: "p6", f: "ch24.html", t: "Linting, formatting and Git" },
    { n: 25, p: "p6", f: "ch25.html", t: "Testing the front end" },

    { n: 26, p: "p7", f: "ch26.html", t: "Performance" },
    { n: 27, p: "p7", f: "ch27.html", t: "Security and authentication" },
    { n: 28, p: "p7", f: "ch28.html", t: "PWAs and browser APIs" },
    { n: 29, p: "p7", f: "ch29.html", t: "Deploy, monitor and beyond the browser" },
    { n: 30, p: "p7", f: "ch30.html", t: "Practice" }
  ];

  /* Chapters whose files exist. Add a number when its page is written. */
  var LIVE = { 1: 1, 2: 1, 3: 1, 4: 1, 5: 1, 6: 1, 7: 1, 8: 1, 9: 1, 10: 1, 11: 1, 12: 1, 13: 1, 14: 1, 15: 1, 16: 1, 17: 1, 18: 1, 19: 1, 20: 1, 21: 1, 22: 1, 23: 1, 24: 1, 25: 1, 26: 1, 27: 1, 28: 1, 29: 1, 30: 1 };

  /* ---------------------------------------------------------
     2. Helpers
     --------------------------------------------------------- */
  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }
  function pad2(n) { return (n < 10 ? "0" : "") + n; }
  function currentFile() {
    var m = location.pathname.split("/").pop();
    return m || "index.html";
  }

  /* ---------------------------------------------------------
     3. Sidebar: chapter list + in-page contents
     --------------------------------------------------------- */
  function buildSidebar() {
    var side = document.querySelector("nav.side");
    if (!side) return;

    var here = currentFile();

    var head = el("h2", null, "Front-end Developer");
    side.appendChild(head);

    var hub = el("div", "part");
    var hubOl = el("ol");
    var hubLi = el("li");
    var hubA = el("a", here === "index.html" ? "on" : null);
    hubA.href = "index.html";
    hubA.appendChild(el("span", "n", "\u00B7"));
    hubA.appendChild(document.createTextNode("Contents"));
    hubLi.appendChild(hubA);
    hubOl.appendChild(hubLi);
    hub.appendChild(hubOl);
    side.appendChild(hub);

    var wrap = el("div", "chlist");
    PARTS.forEach(function (part) {
      var block = el("div", "part");
      block.appendChild(el("b", null, part.name));
      var ol = el("ol");
      CHAPTERS.filter(function (c) { return c.p === part.id; }).forEach(function (c) {
        var li = el("li");
        var live = !!LIVE[c.n];
        var a = el("a", live ? (c.f === here ? "on" : null) : "todo");
        if (live) {
          a.href = c.f;
        } else {
          a.setAttribute("aria-disabled", "true");
          a.title = "Not written yet";
        }
        a.appendChild(el("span", "n", pad2(c.n)));
        a.appendChild(document.createTextNode(c.t));
        li.appendChild(a);
        ol.appendChild(li);
      });
      block.appendChild(ol);
      wrap.appendChild(block);
    });
    side.appendChild(wrap);

    /* in-page contents, built from the h2.sec elements on the page */
    var secs = Array.prototype.slice.call(document.querySelectorAll("main section.ch[id]"));
    if (!secs.length) return;
    var box = el("div", "inpage");
    box.appendChild(el("h2", null, "On this page"));
    var ul = el("ul");
    secs.forEach(function (s) {
      var h = s.querySelector("h2.sec");
      if (!h) return;
      var li = el("li");
      var a = el("a");
      a.href = "#" + s.id;
      a.dataset.target = s.id;
      a.textContent = (h.textContent || "").replace(/^\s*\d+[.\u00B7]?\s*/, "").trim();
      li.appendChild(a);
      ul.appendChild(li);
    });
    box.appendChild(ul);
    side.appendChild(box);

    /* scrollspy */
    var links = Array.prototype.slice.call(box.querySelectorAll("a"));
    var spy = function () {
      var best = null, bestTop = -Infinity;
      secs.forEach(function (s) {
        var top = s.getBoundingClientRect().top - 90;
        if (top <= 0 && top > bestTop) { bestTop = top; best = s.id; }
      });
      if (!best && secs.length) best = secs[0].id;
      links.forEach(function (a) { a.classList.toggle("on", a.dataset.target === best); });
    };
    document.addEventListener("scroll", spy, { passive: true });
    spy();
  }

  /* ---------------------------------------------------------
     4. Chapter strip + prev/next
     --------------------------------------------------------- */
  function buildNav() {
    var here = currentFile();
    var idx = -1;
    CHAPTERS.forEach(function (c, i) { if (c.f === here) idx = i; });

    var strip = document.querySelector(".strip");
    if (strip && idx >= 0) {
      var part = PARTS.filter(function (p) { return p.id === CHAPTERS[idx].p; })[0];
      var liveCount = CHAPTERS.filter(function (c) { return LIVE[c.n]; }).length;
      strip.textContent = "";
      strip.appendChild(el("span", null, part ? part.name : ""));
      strip.appendChild(el("span", "pipe", "/"));
      var b = el("b", null, "Chapter " + pad2(CHAPTERS[idx].n) + " of " + CHAPTERS.length);
      strip.appendChild(b);
      strip.appendChild(el("span", "pipe", "/"));
      strip.appendChild(el("span", null, liveCount + " chapters written so far"));
    }

    var nav = document.querySelector(".pagenav");
    if (!nav || idx < 0) return;

    var prev = null, next = null, i;
    for (i = idx - 1; i >= 0; i--) { if (LIVE[CHAPTERS[i].n]) { prev = CHAPTERS[i]; break; } }
    for (i = idx + 1; i < CHAPTERS.length; i++) { if (LIVE[CHAPTERS[i].n]) { next = CHAPTERS[i]; break; } }

    nav.textContent = "";
    function card(chap, dir) {
      var a;
      if (chap) {
        a = el("a", dir === "next" ? "nx" : null);
        a.href = chap.f;
        a.appendChild(el("span", "ph", dir === "next" ? "Next" : "Previous"));
        a.appendChild(el("span", "pt", pad2(chap.n) + " \u00B7 " + chap.t));
      } else {
        a = el("a", (dir === "next" ? "nx " : "") + "empty");
        a.href = "index.html";
        a.appendChild(el("span", "ph", dir === "next" ? "Next" : "Previous"));
        a.appendChild(el("span", "pt", dir === "next" ? "Not written yet \u2014 back to contents" : "Back to contents"));
      }
      return a;
    }
    nav.appendChild(card(prev, "prev"));
    nav.appendChild(card(next, "next"));
  }

  /* ---------------------------------------------------------
     5. Reading progress + back to top
     --------------------------------------------------------- */
  function buildProgress() {
    var bar = document.getElementById("prog");
    var top = document.querySelector("button.top");
    function upd() {
      var h = document.documentElement;
      var max = h.scrollHeight - h.clientHeight;
      var pct = max > 0 ? (h.scrollTop / max) * 100 : 0;
      if (bar) bar.style.width = pct.toFixed(2) + "%";
      if (top) top.classList.toggle("show", h.scrollTop > 600);
    }
    document.addEventListener("scroll", upd, { passive: true });
    window.addEventListener("resize", upd);
    if (top) {
      top.addEventListener("click", function () {
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    }
    upd();
  }

  /* ---------------------------------------------------------
     6. Copy buttons on code blocks, self-check toggles
     --------------------------------------------------------- */
  function buildWidgets() {
    Array.prototype.forEach.call(document.querySelectorAll(".codewrap"), function (w) {
      var cap = w.querySelector(".cap");
      var pre = w.querySelector("pre");
      if (!cap || !pre || cap.querySelector(".copy")) return;
      var btn = el("button", "copy", "Copy");
      btn.addEventListener("click", function () {
        var text = pre.innerText;
        var done = function () {
          btn.textContent = "Copied";
          setTimeout(function () { btn.textContent = "Copy"; }, 1400);
        };
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text).then(done, function () { btn.textContent = "Press \u2318C"; });
        } else {
          var ta = document.createElement("textarea");
          ta.value = text;
          document.body.appendChild(ta);
          ta.select();
          try { document.execCommand("copy"); done(); } catch (e) { btn.textContent = "Press \u2318C"; }
          document.body.removeChild(ta);
        }
      });
      cap.appendChild(btn);
    });

    Array.prototype.forEach.call(document.querySelectorAll(".check"), function (c) {
      var rev = c.querySelector(".rev");
      if (!rev) return;
      rev.addEventListener("click", function () {
        c.classList.toggle("open");
        rev.textContent = c.classList.contains("open") ? "Hide answer" : "Show answer";
      });
    });

  }

  /* ---------------------------------------------------------
     7. Plot — shared canvas helper
     --------------------------------------------------------- */
  function Plot(canvas, opts) {
    opts = opts || {};
    this.c = canvas;
    this.ctx = canvas.getContext("2d");
    this.pad = Object.assign({ l: 44, r: 12, t: 12, b: 30 }, opts.pad || {});
    this.h = opts.height || 240;
    this.resize();
  }
  Plot.prototype.resize = function () {
    var dpr = window.devicePixelRatio || 1;
    var w = this.c.clientWidth || 600;
    this.w = w;
    this.c.width = Math.round(w * dpr);
    this.c.height = Math.round(this.h * dpr);
    this.c.style.height = this.h + "px";
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    return this;
  };
  Plot.prototype.clear = function (bg) {
    this.ctx.clearRect(0, 0, this.w, this.h);
    if (bg) { this.ctx.fillStyle = bg; this.ctx.fillRect(0, 0, this.w, this.h); }
    return this;
  };
  Plot.prototype.box = function () {
    return { x: this.pad.l, y: this.pad.t, w: this.w - this.pad.l - this.pad.r, h: this.h - this.pad.t - this.pad.b };
  };
  Plot.prototype.axes = function (o) {
    o = o || {};
    var b = this.box(), g = this.ctx;
    g.strokeStyle = "#CFD8E0"; g.lineWidth = 1;
    g.beginPath();
    g.moveTo(b.x + 0.5, b.y); g.lineTo(b.x + 0.5, b.y + b.h + 0.5); g.lineTo(b.x + b.w, b.y + b.h + 0.5);
    g.stroke();
    if (o.grid) {
      g.strokeStyle = "#E7EDF2";
      for (var i = 1; i <= o.grid; i++) {
        var y = b.y + (b.h * i) / o.grid;
        g.beginPath(); g.moveTo(b.x, y + 0.5); g.lineTo(b.x + b.w, y + 0.5); g.stroke();
      }
    }
    return this;
  };
  Plot.prototype.text = function (s, x, y, o) {
    o = o || {};
    var g = this.ctx;
    g.fillStyle = o.color || "#54677A";
    g.font = (o.weight || "500") + " " + (o.size || 11) + "px " + (o.mono ? "ui-monospace,Menlo,monospace" : "Archivo,Helvetica,Arial,sans-serif");
    g.textAlign = o.align || "left";
    g.textBaseline = o.base || "alphabetic";
    g.fillText(s, x, y);
    return this;
  };
  Plot.prototype.bar = function (x, y, w, h, fill, stroke) {
    var g = this.ctx;
    g.fillStyle = fill;
    g.fillRect(x, y, w, h);
    if (stroke) { g.strokeStyle = stroke; g.lineWidth = 1; g.strokeRect(x + 0.5, y + 0.5, w - 1, h - 1); }
    return this;
  };
  Plot.prototype.line = function (pts, color, width) {
    var g = this.ctx;
    g.strokeStyle = color; g.lineWidth = width || 2;
    g.lineJoin = "round"; g.lineCap = "round";
    g.beginPath();
    pts.forEach(function (p, i) { if (i === 0) g.moveTo(p[0], p[1]); else g.lineTo(p[0], p[1]); });
    g.stroke();
    return this;
  };

  /* ---------------------------------------------------------
     8. Boot
     --------------------------------------------------------- */
  function boot() {
    buildSidebar();
    buildNav();
    buildProgress();
    buildWidgets();
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }

  window.UNIT = { PARTS: PARTS, CHAPTERS: CHAPTERS, LIVE: LIVE, Plot: Plot };
  window.Plot = Plot;
})();
