/* ============================================================
   Roadmap Notes — Software Design & Architecture unit
   Same chrome as the other units: chapter manifest, left rail,
   in-page contents with scrollspy, reading progress, prev/next,
   code copying, heading anchors and Mermaid rendering.
   ============================================================ */
(function () {
  "use strict";

  var PARTS = [
    { id: "p1", name: "Code that survives change",
      blurb: "Design is the discipline of keeping change cheap. These three chapters are what that means at the level of a function and a file." },
    { id: "p2", name: "Paradigms",
      blurb: "Structured, object-oriented and functional programming each take a capability away from you. Knowing which one, and why, is most of the value." },
    { id: "p3", name: "Principles",
      blurb: "SOLID, coupling and cohesion, and the working rules that decide where a boundary belongs." },
    { id: "p4", name: "Design patterns",
      blurb: "The Gang of Four catalogue and its successors — what each one is for, what it costs, and the ones you should rarely reach for." },
    { id: "p5", name: "Modelling the domain",
      blurb: "Domain-driven design, strategic and tactical, and the enterprise patterns that connect a model to a database." },
    { id: "p6", name: "Architecture",
      blurb: "Boundaries, components and dependency direction — then the styles and patterns built out of them." },
    { id: "p7", name: "Practice",
      blurb: "Changing code you did not write, and making decisions that survive the people who made them." }
  ];

  var CHAPTERS = [
    { n: 1,  p: "p1", f: "01-what-design-is.html",  t: "What software design is for",
      d: "Design as the cost of change, not the beauty of the code. Coupling, blast radius, and why the second version is where the money is.",
      k: "cost of change · coupling · blast radius · reversibility", ready: true },
    { n: 2,  p: "p1", f: "02-clean-code.html",      t: "Clean code",
      d: "Naming, function size, cyclomatic complexity, nulls and booleans as arguments, command-query separation, and code organised by actor.",
      k: "naming · small functions · CQS · complexity · comments", ready: true },
    { n: 3,  p: "p1", f: "03-tests-as-design.html", t: "Tests as design pressure",
      d: "Why hard-to-test code is badly designed code, the test pyramid as a feedback-loop argument, and tests coupled to implementation.",
      k: "feedback loop · test doubles · pyramid · brittleness", ready: true },

    { n: 4,  p: "p2", f: "04-paradigms.html",       t: "The three paradigms",
      d: "Structured, object-oriented and functional programming as three restrictions on what you are allowed to do — and what each one buys.",
      k: "goto · indirect transfer · assignment · discipline", ready: true },
    { n: 5,  p: "p2", f: "05-oop.html",             t: "Object-oriented programming",
      d: "Encapsulation, abstraction, inheritance and polymorphism as they are actually used, plus anemic models and where behaviour belongs.",
      k: "polymorphism · interfaces · anemic model · visibility", ready: true },
    { n: 6,  p: "p2", f: "06-functional.html",      t: "Functional thinking",
      d: "Pure functions, immutability, referential transparency, and how to push side effects to the edges of any codebase.",
      k: "purity · immutability · higher-order · functional core", ready: true },

    { n: 7,  p: "p3", f: "07-solid.html",           t: "SOLID",
      d: "All five principles with the misreadings that make them useless, and what each one actually asks you to do.",
      k: "SRP · OCP · LSP · ISP · DIP", ready: true },
    { n: 8,  p: "p3", f: "08-coupling.html",        t: "Coupling and cohesion",
      d: "The seven kinds of coupling, the seven kinds of cohesion, connascence as the sharper tool, and how to measure both.",
      k: "afferent/efferent · connascence · stability · distance", ready: true },
    { n: 9,  p: "p3", f: "09-principles.html",      t: "The working principles",
      d: "DRY, YAGNI, Law of Demeter, tell-don't-ask, composition over inheritance, Hollywood, and encapsulate what varies.",
      k: "DRY · YAGNI · Demeter · composition · inversion", ready: true },

    { n: 10, p: "p4", f: "10-creational.html",      t: "Creational patterns",
      d: "Factory method, abstract factory, builder, prototype, singleton — and why the last one is usually a mistake.",
      k: "factory · builder · singleton · object construction", ready: true },
    { n: 11, p: "p4", f: "11-structural.html",      t: "Structural patterns",
      d: "Adapter, decorator, facade, proxy, composite, bridge, flyweight — the patterns for composing objects into larger structures.",
      k: "adapter · decorator · facade · proxy · composite", ready: true },
    { n: 12, p: "p4", f: "12-behavioural.html",     t: "Behavioural patterns",
      d: "Strategy, observer, command, state, template method, visitor, chain of responsibility, mediator, iterator, memento.",
      k: "strategy · observer · command · state · visitor", ready: true },
    { n: 13, p: "p4", f: "13-patterns-in-perspective.html", t: "Patterns in perspective",
      d: "PoSA and other catalogues, patterns your language already has, and the specific ways pattern enthusiasm damages a codebase.",
      k: "PoSA · language features · over-abstraction", ready: true },

    { n: 14, p: "p5", f: "14-ddd-strategic.html",   t: "Domain-driven design: strategic",
      d: "Ubiquitous language, bounded contexts, context maps, subdomains, and deciding where a model should stop.",
      k: "bounded context · ubiquitous language · context map", ready: true },
    { n: 15, p: "p5", f: "15-ddd-tactical.html",    t: "Domain-driven design: tactical",
      d: "Entities, value objects, aggregates and their boundaries, domain events, repositories, factories and domain services.",
      k: "aggregate · value object · invariant · domain event", ready: true },
    { n: 16, p: "p5", f: "16-enterprise-patterns.html", t: "Enterprise patterns",
      d: "Transaction script versus domain model, DTOs, mappers, identity map, unit of work, repositories, use cases and ORMs.",
      k: "DTO · repository · unit of work · ORM · use case", ready: true },

    { n: 17, p: "p6", f: "17-architectural-principles.html", t: "Architectural principles",
      d: "Boundaries, policy versus detail, dependency direction, component cohesion and coupling, and the stable-dependencies principle.",
      k: "boundaries · policy vs detail · SDP · component design", ready: true },
    { n: 18, p: "p6", f: "18-styles.html",          t: "Architectural styles",
      d: "Monolithic, layered, component-based, client-server, peer-to-peer, event-driven, publish-subscribe and messaging styles compared.",
      k: "layered · event-driven · pub-sub · monolith · SOA", ready: true },
    { n: 19, p: "p6", f: "19-clean-architecture.html", t: "Layered, hexagonal, clean",
      d: "Three ways to draw the same dependency rule, what ports and adapters actually buy, and when the ceremony is not worth it.",
      k: "hexagonal · ports and adapters · onion · dependency rule", ready: true },
    { n: 20, p: "p6", f: "20-architectural-patterns.html", t: "Architectural patterns",
      d: "MVC and its relatives, microkernel, blackboard, pipes and filters, CQRS, event sourcing, microservices and serverless.",
      k: "MVC · microkernel · CQRS · event sourcing · serverless", ready: true },

    { n: 21, p: "p7", f: "21-refactoring.html",     t: "Refactoring and legacy code",
      d: "Refactoring as a safe sequence of small steps, seams and characterisation tests, strangling a legacy module, and paying down debt deliberately.",
      k: "seams · characterisation tests · mikado · debt", ready: true },
    { n: 22, p: "p7", f: "22-deciding.html",        t: "Deciding, and recording the decision",
      d: "Architecture decision records, fitness functions, trade-off analysis, and three designs argued end to end.",
      k: "ADR · fitness functions · trade-offs · worked examples", ready: true }
  ];

  var UNIT = { title: "Software Design & Architecture", home: "../../index.html", contents: "index.html" };
  window.SDUNIT = { PARTS: PARTS, CHAPTERS: CHAPTERS, UNIT: UNIT };

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }
  function pad(n) { return n < 10 ? "0" + n : String(n); }
  function onReady(fn) {
    document.readyState !== "loading" ? fn() : document.addEventListener("DOMContentLoaded", fn);
  }
  function currentFile() { return location.pathname.split("/").pop() || "index.html"; }

  function buildRail(here) {
    var rail = document.getElementById("rail");
    if (!rail) return;
    rail.appendChild(el("h2", null, "Chapters"));
    var list = el("ul", "chlist"), lastPart = null;
    CHAPTERS.forEach(function (c) {
      var li = el("li");
      if (c.p !== lastPart) {
        lastPart = c.p;
        var pinfo = PARTS.filter(function (x) { return x.id === c.p; })[0];
        li.appendChild(el("div", "part", pinfo ? pinfo.name : ""));
      }
      var node;
      if (c.ready) {
        node = el("a"); node.href = c.f;
        if (c.f === here) node.setAttribute("aria-current", "page");
      } else {
        node = el("span", "soon"); node.title = "Not written yet";
      }
      var num = el("span", "n");
      num.appendChild(el("span", null, pad(c.n)));
      node.appendChild(num);
      node.appendChild(el("span", "tt", c.t));
      li.appendChild(node);
      list.appendChild(li);
    });
    rail.appendChild(list);
    var body = document.querySelector("article .body");
    if (body) {
      rail.appendChild(el("h2", null, "On this page"));
      rail.appendChild(buildMini(body));
    }
  }

  function buildMini(scope) {
    var ul = el("ul", "mini"), i = 0;
    Array.prototype.forEach.call(scope.querySelectorAll("h2, h3"), function (hd) {
      if (hd.closest(".recap")) return;
      if (!hd.id) hd.id = "s" + (++i);
      var li = el("li", hd.tagName === "H3" ? "sub" : null);
      var a = el("a");
      a.href = "#" + hd.id;
      var label = hd.querySelector(".h2n");
      a.textContent = label
        ? hd.textContent.replace(label.textContent, "").trim()
        : hd.textContent.replace(/#$/, "").trim();
      li.appendChild(a); ul.appendChild(li);
    });
    return ul;
  }

  function spy() {
    var links = Array.prototype.slice.call(document.querySelectorAll(".mini a"));
    if (!links.length) return;
    var targets = links.map(function (a) { return document.getElementById(a.hash.slice(1)); });
    var tick = false;
    function update() {
      tick = false;
      var best = 0;
      for (var i = 0; i < targets.length; i++) {
        if (targets[i] && targets[i].getBoundingClientRect().top <= 120) best = i;
      }
      links.forEach(function (a, i) { a.classList.toggle("on", i === best); });
      var active = links[best], rail = document.getElementById("rail");
      if (active && rail && rail.scrollHeight > rail.clientHeight) {
        var ar = active.getBoundingClientRect(), rr = rail.getBoundingClientRect();
        if (ar.top < rr.top + 40 || ar.bottom > rr.bottom - 40) {
          rail.scrollTop += ar.top - rr.top - rail.clientHeight * 0.55;
        }
      }
    }
    addEventListener("scroll", function () {
      if (!tick) { tick = true; requestAnimationFrame(update); }
    }, { passive: true });
    update();
  }

  function progress() {
    var bar = document.querySelector(".readbar");
    if (!bar) return;
    var tick = false;
    function update() {
      tick = false;
      var h = document.documentElement, max = h.scrollHeight - h.clientHeight;
      bar.style.width = (max > 0 ? Math.min(100, (h.scrollTop / max) * 100) : 0) + "%";
    }
    addEventListener("scroll", function () {
      if (!tick) { tick = true; requestAnimationFrame(update); }
    }, { passive: true });
    update();
  }

  function neighbours(here) {
    var readyList = CHAPTERS.filter(function (c) { return c.ready; });
    var i = -1;
    readyList.forEach(function (c, idx) { if (c.f === here) i = idx; });
    return { prev: i > 0 ? readyList[i - 1] : null,
             next: i > -1 && i < readyList.length - 1 ? readyList[i + 1] : null };
  }

  function wireNav(here) {
    var nb = neighbours(here), top = document.querySelector(".top-nav");
    if (top) {
      var mk = function (c, label) {
        var a = el("a", null, label);
        if (c) { a.href = c.f; a.title = c.t; }
        else { a.setAttribute("aria-disabled", "true"); a.href = "#"; }
        return a;
      };
      top.appendChild(mk(nb.prev, "Prev"));
      top.appendChild(mk(nb.next, "Next"));
    }
    var pn = document.querySelector(".pn");
    if (pn) {
      var block = function (c, dir, cls) {
        var a = el("a", cls + (c ? "" : " empty"));
        a.href = c ? c.f : "#";
        a.appendChild(el("div", "dir", dir));
        a.appendChild(el("div", "t", c ? pad(c.n) + " · " + c.t : ""));
        return a;
      };
      pn.appendChild(block(nb.prev, "Previous chapter", "prev"));
      pn.appendChild(block(nb.next, "Next chapter", "next"));
    }
    addEventListener("keydown", function (e) {
      if (e.target.matches("input, textarea, select")) return;
      if (e.key === "[" && nb.prev) location.href = nb.prev.f;
      if (e.key === "]" && nb.next) location.href = nb.next.f;
    });
  }

  /* Neutralise links to chapters that are declared but not yet written, so a
     forward reference degrades to plain text rather than a dead link. Costs
     nothing once every chapter is ready, and repairs itself when one is added. */
  function guardForwardLinks() {
    var unwritten = {};
    CHAPTERS.forEach(function (c) { if (!c.ready) unwritten[c.f] = c.t; });
    if (!Object.keys(unwritten).length) return;
    Array.prototype.forEach.call(document.querySelectorAll("article a[href]"), function (a) {
      var href = a.getAttribute("href").split("#")[0];
      if (!unwritten[href]) return;
      var span = el("span", "soon-ref", a.textContent);
      span.title = unwritten[href] + " — not written yet";
      a.replaceWith(span);
    });
  }

  function anchors() {
    Array.prototype.forEach.call(document.querySelectorAll("article h2[id], article h3[id]"), function (h) {
      if (h.closest(".recap")) return;
      var a = el("a", "anchor", "#");
      a.href = "#" + h.id;
      a.setAttribute("aria-label", "Link to this section");
      h.appendChild(a);
    });
  }

  function copyButtons() {
    Array.prototype.forEach.call(document.querySelectorAll(".codewrap"), function (w) {
      var pre = w.querySelector("pre");
      if (!pre) return;
      var b = el("button", "copy", "Copy");
      b.addEventListener("click", function () {
        var txt = pre.innerText;
        var done = function () {
          b.textContent = "Copied"; b.classList.add("done");
          setTimeout(function () { b.textContent = "Copy"; b.classList.remove("done"); }, 1600);
        };
        if (navigator.clipboard) navigator.clipboard.writeText(txt).then(done, function () {});
        else {
          var ta = el("textarea"); ta.value = txt; document.body.appendChild(ta); ta.select();
          try { document.execCommand("copy"); done(); } catch (err) {}
          document.body.removeChild(ta);
        }
      });
      w.appendChild(b);
    });
  }

  function railToggle() {
    var btn = document.querySelector(".rail-toggle"), rail = document.getElementById("rail");
    if (!btn || !rail) return;
    btn.addEventListener("click", function () {
      var open = rail.classList.toggle("open");
      btn.setAttribute("aria-expanded", open ? "true" : "false");
    });
    rail.addEventListener("click", function (e) {
      if (e.target.closest("a")) { rail.classList.remove("open"); btn.setAttribute("aria-expanded", "false"); }
    });
    addEventListener("keydown", function (e) {
      if (e.key === "Escape") { rail.classList.remove("open"); btn.setAttribute("aria-expanded", "false"); }
    });
  }

  function diagrams() {
    var nodes = document.querySelectorAll(".mermaid");
    if (!nodes.length) return;
    var dark = matchMedia("(prefers-color-scheme: dark)").matches;
    import("https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs")
      .then(function (m) {
        var mermaid = m.default;
        mermaid.initialize({
          startOnLoad: false, securityLevel: "loose", theme: "base",
          fontFamily: "Archivo, Helvetica, Arial, sans-serif",
          themeVariables: dark ? {
            background: "#152531", primaryColor: "#1D3448", primaryTextColor: "#DCE7EF",
            primaryBorderColor: "#3A5670", lineColor: "#7B92A4", secondaryColor: "#331E1C",
            tertiaryColor: "#12222F", fontSize: "14px"
          } : {
            background: "#FFFFFF", primaryColor: "#F4F7F9", primaryTextColor: "#16232F",
            primaryBorderColor: "#8FA3B5", lineColor: "#54677A", secondaryColor: "#FBE9E7",
            tertiaryColor: "#ECEFF2", fontSize: "14px"
          }
        });
        return mermaid.run({ nodes: nodes });
      })
      .catch(function () {
        Array.prototype.forEach.call(nodes, function (n) {
          n.replaceWith(el("pre", "mmfallback", n.textContent.trim()));
        });
      });
  }

  onReady(function () {
    var here = currentFile();
    var t = document.querySelector(".top-title");
    if (t && !t.textContent.trim()) {
      var me = CHAPTERS.filter(function (c) { return c.f === here; })[0];
      t.textContent = me ? UNIT.title + " · " + pad(me.n) + " " + me.t : UNIT.title;
    }
    buildRail(here);
    anchors();
    guardForwardLinks();
    copyButtons();
    railToggle();
    wireNav(here);
    spy();
    progress();
    diagrams();
  });
})();
