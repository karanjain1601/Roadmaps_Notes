/* ============================================================
   Roadmap Notes — Backend Developer unit
   Same chrome as the other units: chapter manifest, left rail,
   in-page contents with scrollspy, reading progress, prev/next,
   code copying, heading anchors and Mermaid rendering.
   ============================================================ */
(function () {
  "use strict";

  var PARTS = [
    { id: "p1", name: "Foundations",
      blurb: "What a backend is actually doing, and the layers underneath it that decide how long everything takes." },
    { id: "p2", name: "Serving requests",
      blurb: "The server, the proxy in front of it, the shape of the interface it exposes, and who is allowed to call it." },
    { id: "p3", name: "Data",
      blurb: "Modelling it, finding it quickly, changing it safely under concurrency, and choosing where it lives." },
    { id: "p4", name: "Speed and safety",
      blurb: "Caching, defending against the internet, moving work off the request path, and search." },
    { id: "p5", name: "Architecture",
      blurb: "How a backend codebase is arranged, when to split it, and how it gets its configuration." },
    { id: "p6", name: "Operating",
      blurb: "Proving it works, knowing what it is doing in production, and getting it there repeatedly." }
  ];

  var CHAPTERS = [
    { n: 1,  p: "p1", f: "01-what-a-backend-does.html", t: "What a backend actually does",
      d: "One request traced end to end, every hop timed, and the nine orders of magnitude between a CPU cache and a cross-ocean round trip.",
      k: "request lifecycle · latency · the waterfall", ready: true },
    { n: 2,  p: "p1", f: "02-the-network.html",        t: "The network beneath",
      d: "DNS resolution step by step, what TCP guarantees and what it costs, and the TLS handshake including the trap that breaks it in production.",
      k: "DNS · TCP · TLS · handshakes · RTT", ready: true },
    { n: 3,  p: "p1", f: "03-http.html",               t: "HTTP",
      d: "Methods and their properties, the status codes that matter, headers, cookies, CORS, content negotiation and what changed in HTTP/2 and /3.",
      k: "methods · status codes · headers · CORS", ready: true },

    { n: 4,  p: "p2", f: "04-servers-and-concurrency.html", t: "Servers, proxies and concurrency",
      d: "What a reverse proxy is for, three concurrency models and how each behaves under load, and sizing a connection pool with real queueing maths.",
      k: "nginx · thread pool · event loop · pooling", ready: true },
    { n: 5,  p: "p2", f: "05-rest-api-design.html",    t: "Designing an HTTP API",
      d: "Resource modelling, pagination that survives inserts, idempotency keys, versioning strategies, error shapes and rate-limit headers.",
      k: "REST · pagination · idempotency · RFC 9457", ready: true },
    { n: 6,  p: "p2", f: "06-other-api-styles.html",   t: "GraphQL, gRPC and real-time",
      d: "Where each alternative wins, what GraphQL relocates rather than solves, and choosing between polling, server-sent events and WebSockets.",
      k: "GraphQL · gRPC · SSE · WebSockets", ready: true },
    { n: 7,  p: "p2", f: "07-auth.html",               t: "Authentication and authorisation",
      d: "Sessions versus tokens, JWT and its sharp edges, OAuth 2.1 and OIDC flows, password storage, and RBAC against ABAC.",
      k: "sessions · JWT · OAuth · bcrypt · RBAC", ready: true },

    { n: 8,  p: "p3", f: "08-relational-modelling.html", t: "Relational modelling and SQL",
      d: "Keys, relationships, normal forms and when to denormalise, constraints as enforcement, and the SQL you actually need.",
      k: "normalisation · keys · joins · constraints", ready: false },
    { n: 9,  p: "p3", f: "09-indexes.html",            t: "Indexes and query performance",
      d: "B-trees and what they cost, composite index ordering, covering indexes, reading a query plan, and why the planner ignores your index.",
      k: "B-tree · EXPLAIN · selectivity · covering", ready: false },
    { n: 10, p: "p3", f: "10-transactions.html",       t: "Transactions and concurrency",
      d: "ACID precisely, the anomaly-by-isolation-level matrix, MVCC, locking, deadlocks, and the lost update nobody notices.",
      k: "ACID · isolation · MVCC · deadlock", ready: false },
    { n: 11, p: "p3", f: "11-nosql.html",              t: "NoSQL and choosing a store",
      d: "Key-value, document, wide-column, graph, time series and search — what each is genuinely for, and how the design method inverts.",
      k: "MongoDB · Redis · Cassandra · access patterns", ready: false },
    { n: 12, p: "p3", f: "12-scaling-data.html",       t: "Scaling data",
      d: "The cheapest-first ladder, read replicas and lag, sharding strategies, the N+1 problem, and zero-downtime schema migrations.",
      k: "replication · sharding · migrations · N+1", ready: false },

    { n: 13, p: "p4", f: "13-caching.html",            t: "Caching",
      d: "Every layer from the browser to the query cache, read and write strategies, invalidation, and the stampede that takes the database down.",
      k: "CDN · Redis · TTL · stampede · eviction", ready: false },
    { n: 14, p: "p4", f: "14-security.html",           t: "Web security",
      d: "The OWASP risks that actually appear, injection, XSS and CSRF, secrets handling, TLS configuration and security headers.",
      k: "OWASP · injection · CSRF · CSP · secrets", ready: false },
    { n: 15, p: "p4", f: "15-async-work.html",         t: "Asynchronous work",
      d: "Queues versus logs, delivery semantics, idempotent consumers, retries and dead letters, the outbox pattern and background jobs.",
      k: "RabbitMQ · Kafka · outbox · DLQ · retries", ready: false },
    { n: 16, p: "p4", f: "16-search.html",             t: "Search",
      d: "The inverted index, analysis and tokenisation, relevance scoring, and when a database LIKE query stops being enough.",
      k: "Elasticsearch · inverted index · BM25", ready: false },

    { n: 17, p: "p5", f: "17-structure.html",          t: "Structuring a backend codebase",
      d: "Layers, feature slices, where business rules go, dependency direction, and the twelve-factor rules that are actually load-bearing.",
      k: "layering · use cases · dependency rule", ready: false },
    { n: 18, p: "p5", f: "18-monolith-to-services.html", t: "Monolith to services",
      d: "The modular monolith, forcing reasons to split, service boundaries, inter-service communication and the distributed monolith.",
      k: "microservices · boundaries · SOA · saga", ready: false },
    { n: 19, p: "p5", f: "19-config-and-environments.html", t: "Configuration and environments",
      d: "Config as environment, secrets management, feature flags, environment parity and the twelve-factor discipline in practice.",
      k: "12-factor · secrets · feature flags", ready: false },

    { n: 20, p: "p6", f: "20-testing.html",            t: "Testing a backend",
      d: "The pyramid costed honestly, testing against a real database, contract tests between services, and load testing that tells you something.",
      k: "integration · contract · fixtures · load", ready: false },
    { n: 21, p: "p6", f: "21-observability.html",      t: "Observability",
      d: "Logs, metrics and traces with their costs, cardinality, RED and USE, correlation ids, and alerting on symptoms rather than causes.",
      k: "metrics · tracing · SLO · burn rate", ready: false },
    { n: 22, p: "p6", f: "22-deployment.html",         t: "Deploying and running it",
      d: "Containers, the build pipeline, deployment strategies, graceful shutdown, health checks, and the runbook for the first incident.",
      k: "Docker · CI/CD · blue-green · canary", ready: false }
  ];

  var UNIT = { title: "Backend Developer", home: "../../index.html", contents: "index.html" };
  window.BEUNIT = { PARTS: PARTS, CHAPTERS: CHAPTERS, UNIT: UNIT };

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
            primaryBorderColor: "#3A5670", lineColor: "#7B92A4", secondaryColor: "#12291F",
            tertiaryColor: "#12222F", fontSize: "14px"
          } : {
            background: "#FFFFFF", primaryColor: "#F4F7F9", primaryTextColor: "#16232F",
            primaryBorderColor: "#8FA3B5", lineColor: "#54677A", secondaryColor: "#E7F7EF",
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
