/* ============================================================
   Roadmap Notes — System Design unit
   One script shared by the contents page and every chapter.
   Owns: the chapter manifest, the left rail, the in-page
   contents with scrollspy, reading progress, prev/next links,
   code copying, heading anchors and Mermaid rendering.
   ============================================================ */
(function () {
  "use strict";

  /* ---- 1. the manifest: single source of truth ------------- */
  var PARTS = [
    { id: "p1", name: "Groundwork",
      blurb: "The vocabulary and the arithmetic. Everything later in the unit is an application of these four chapters." },
    { id: "p2", name: "Distributed systems core",
      blurb: "What changes once one machine becomes many: the trade-offs you cannot design around, only choose between." },
    { id: "p3", name: "The path of a request",
      blurb: "Follow a single request from a browser's address bar to your application process, layer by layer." },
    { id: "p4", name: "Storing the data",
      blurb: "How databases actually work, how to make one bigger, which family to pick, and what to keep in memory." },
    { id: "p5", name: "Moving the data",
      blurb: "Protocols and API styles for synchronous calls; queues, logs and jobs for everything that can wait." },
    { id: "p6", name: "Running it",
      blurb: "A design is not finished when it works. It is finished when you can see it working and it survives not working." },
    { id: "p7", name: "Patterns and practice",
      blurb: "The named patterns worth recognising, then ten complete designs built from every part above." }
  ];

  var CHAPTERS = [
    { n: 1,  p: "p1", f: "01-approach.html",       t: "How to approach a system design",
      d: "A repeatable four-phase method: requirements, estimates, high-level design, deep dives. Plus what interviewers actually score.",
      k: "requirements · functional vs non-functional · API sketch · trade-off talk", ready: true },
    { n: 2,  p: "p1", f: "02-estimation.html",     t: "Back-of-the-envelope estimation",
      d: "Powers of two, latency numbers, QPS, storage, bandwidth and memory — the arithmetic that turns hand-waving into a design.",
      k: "napkin math · latency table · QPS · storage growth", ready: true },
    { n: 3,  p: "p1", f: "03-performance.html",    t: "Performance, scalability and the queue",
      d: "Latency vs throughput, Little's Law, utilisation and why the last 10% of capacity costs the most. Tail latency and how it multiplies.",
      k: "Little's Law · p99 · Amdahl · USL · tail amplification", ready: true },
    { n: 4,  p: "p1", f: "04-availability.html",   t: "Availability, reliability and failure",
      d: "Nines and what they cost, series vs parallel maths, SLI/SLO/SLA and error budgets, failover modes and their failure modes.",
      k: "99.99% · MTBF/MTTR · error budget · active-active · split brain", ready: true },

    { n: 5,  p: "p2", f: "05-cap.html",            t: "CAP, PACELC and consistency",
      d: "What CAP really claims, why almost every 'CA system' label is wrong, and the full ladder of consistency models.",
      k: "partition tolerance · linearizability · read-your-writes · PACELC", ready: true },
    { n: 6,  p: "p2", f: "06-replication.html",    t: "Replication and consensus",
      d: "Leader-follower, multi-leader and leaderless replication, quorums, replication lag, Raft in plain terms, split brain and fencing.",
      k: "WAL shipping · R+W>N · Raft · leases · conflict resolution", ready: true },
    { n: 7,  p: "p2", f: "07-sharding.html",       t: "Partitioning, sharding, consistent hashing",
      d: "Range vs hash partitioning, the consistent-hashing ring with virtual nodes, rebalancing, hot keys and cross-shard queries.",
      k: "shard key · ring · vnodes · resharding · scatter-gather", ready: true },

    { n: 8,  p: "p3", f: "08-dns.html",            t: "DNS",
      d: "Recursion and caching, record types, TTL as a control knob, and DNS as a load-balancing and failover tool.",
      k: "resolver · A/AAAA/CNAME · TTL · GeoDNS · anycast", ready: true },
    { n: 9,  p: "p3", f: "09-cdn.html",            t: "CDN and the edge",
      d: "Push vs pull, cache keys, invalidation, origin shielding, and what belongs at the edge versus the origin.",
      k: "PoP · cache-control · purge · signed URLs · edge compute", ready: true },
    { n: 10, p: "p3", f: "10-load-balancing.html", t: "Load balancers and reverse proxies",
      d: "L4 vs L7, the algorithms and when each wins, health checks, sticky sessions, connection draining and LB high availability.",
      k: "round robin · least connections · EWMA · health check · drain", ready: true },
    { n: 11, p: "p3", f: "11-app-layer.html",      t: "The application layer",
      d: "Stateless services, horizontal scaling, the monolith-to-microservices decision, service discovery, gateways and meshes.",
      k: "12-factor · session store · discovery · gateway · sidecar", ready: true },

    { n: 12, p: "p4", f: "12-databases.html",      t: "Databases: engines, indexes, transactions",
      d: "B-trees vs LSM trees, what an index costs, ACID in practice, isolation levels and the anomalies each one still allows.",
      k: "B+tree · LSM · covering index · MVCC · phantom reads", ready: true },
    { n: 13, p: "p4", f: "13-scaling-data.html",   t: "Scaling a database",
      d: "Read replicas, federation, denormalisation, materialised views, sharding a live table and query tuning that pays.",
      k: "replica lag · federation · CQRS reads · online migration", ready: true },
    { n: 14, p: "p4", f: "14-nosql.html",          t: "The NoSQL families",
      d: "Key-value, document, wide-column, graph, time-series and search — the access pattern each is shaped for, with modelling examples.",
      k: "DynamoDB · Mongo · Cassandra · Neo4j · single-table design", ready: true },
    { n: 15, p: "p4", f: "15-caching.html",        t: "Caching",
      d: "Where caches live, the four write strategies, eviction, TTL choice, invalidation, stampedes and cache-related outages.",
      k: "cache-aside · write-through · LRU/LFU · stampede · hot key", ready: true },

    { n: 16, p: "p5", f: "16-communication.html",  t: "Communication: protocols and API styles",
      d: "TCP vs UDP, HTTP/1.1 through /3, REST vs RPC vs gRPC vs GraphQL, real-time transports, and idempotency done properly.",
      k: "handshake · head-of-line · gRPC · WebSocket · idempotency key", ready: true },
    { n: 17, p: "p5", f: "17-async.html",          t: "Asynchronism: queues, streams, jobs",
      d: "Queues vs logs, delivery semantics, ordering, consumer groups, dead letters, backpressure, sagas and the outbox pattern.",
      k: "Kafka · at-least-once · DLQ · outbox · saga · fan-out", ready: true },

    { n: 18, p: "p6", f: "18-observability.html",  t: "Monitoring and observability",
      d: "Metrics, logs and traces; RED and USE; health checks that mean something; alerting on symptoms; dashboards worth keeping.",
      k: "cardinality · histogram · trace context · SLO alerting", ready: true },
    { n: 19, p: "p6", f: "19-antipatterns.html",   t: "Performance antipatterns",
      d: "The ten classic ways a design collapses under load — busy database, chatty I/O, noisy neighbour, retry storm — and the fix for each.",
      k: "N+1 · synchronous I/O · monolithic persistence · retry storm", ready: true },
    { n: 20, p: "p6", f: "20-resilience.html",     t: "Resiliency under stress",
      d: "Timeouts and budgets, retries with jitter, circuit breakers, bulkheads, rate limiting, load shedding and graceful degradation.",
      k: "token bucket · breaker states · bulkhead · brownout · chaos", ready: true },

    { n: 21, p: "p7", f: "21-patterns.html",       t: "The cloud design pattern catalogue",
      d: "Messaging, data management, design and implementation, reliability and security patterns — each in a paragraph you can recall.",
      k: "CQRS · sidecar · strangler fig · valet key · gatekeeper", ready: true },
    { n: 22, p: "p7", f: "22-worked-designs.html", t: "Ten designs, worked end to end",
      d: "URL shortener, rate limiter, news feed, chat, notifications, autocomplete, video, file sync, ticketing and metrics — full walkthroughs.",
      k: "complete write-ups · numbers · schemas · trade-offs", ready: true }
  ];

  var UNIT = { title: "System Design", home: "../../index.html", contents: "index.html" };

  /* expose for the contents page */
  window.SDUNIT = { PARTS: PARTS, CHAPTERS: CHAPTERS, UNIT: UNIT };

  /* ---- 2. helpers ------------------------------------------ */
  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }
  function pad(n) { return n < 10 ? "0" + n : String(n); }
  function ready() { return document.readyState !== "loading"; }
  function onReady(fn) { ready() ? fn() : document.addEventListener("DOMContentLoaded", fn); }

  /* ---- 3. chapter chrome ----------------------------------- */
  function currentFile() {
    var p = location.pathname.split("/").pop();
    return p || "index.html";
  }

  function buildRail(here) {
    var rail = document.getElementById("rail");
    if (!rail) return;

    var h = el("h2", null, "Chapters");
    var list = el("ul", "chlist");
    var lastPart = null;

    CHAPTERS.forEach(function (c) {
      var li = el("li");
      if (c.p !== lastPart) {
        lastPart = c.p;
        var pinfo = PARTS.filter(function (x) { return x.id === c.p; })[0];
        li.appendChild(el("div", "part", pinfo ? pinfo.name : ""));
      }
      var node;
      if (c.ready) {
        node = el("a");
        node.href = c.f;
        if (c.f === here) node.setAttribute("aria-current", "page");
      } else {
        node = el("span", "soon");
        node.title = "Not written yet";
      }
      var num = el("span", "n");
      num.appendChild(el("span", null, pad(c.n)));
      node.appendChild(num);
      node.appendChild(el("span", "tt", c.t));
      li.appendChild(node);
      list.appendChild(li);
    });

    rail.appendChild(h);
    rail.appendChild(list);

    var onPage = document.querySelector("article .body");
    if (onPage) {
      rail.appendChild(el("h2", null, "On this page"));
      rail.appendChild(buildMini(onPage));
    }
  }

  function buildMini(scope) {
    var ul = el("ul", "mini");
    var heads = scope.querySelectorAll("h2, h3");
    var i = 0;
    Array.prototype.forEach.call(heads, function (hd) {
      if (hd.closest(".recap")) return;
      if (!hd.id) hd.id = "s" + (++i);
      var li = el("li", hd.tagName === "H3" ? "sub" : null);
      var a = el("a");
      a.href = "#" + hd.id;
      var label = hd.querySelector(".h2n");
      a.textContent = label
        ? hd.textContent.replace(label.textContent, "").trim()
        : hd.textContent.replace(/#$/, "").trim();
      li.appendChild(a);
      ul.appendChild(li);
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
      var active = links[best];
      var rail = document.getElementById("rail");
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
      var h = document.documentElement;
      var max = h.scrollHeight - h.clientHeight;
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
    var nb = neighbours(here);
    var top = document.querySelector(".top-nav");
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
          b.textContent = "Copied";
          b.classList.add("done");
          setTimeout(function () { b.textContent = "Copy"; b.classList.remove("done"); }, 1600);
        };
        if (navigator.clipboard) { navigator.clipboard.writeText(txt).then(done, function () {}); }
        else {
          var ta = el("textarea"); ta.value = txt; document.body.appendChild(ta);
          ta.select(); try { document.execCommand("copy"); done(); } catch (err) {}
          document.body.removeChild(ta);
        }
      });
      w.appendChild(b);
    });
  }

  function railToggle() {
    var btn = document.querySelector(".rail-toggle");
    var rail = document.getElementById("rail");
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

  /* ---- 4. mermaid ------------------------------------------ */
  function diagrams() {
    var nodes = document.querySelectorAll(".mermaid");
    if (!nodes.length) return;
    var dark = matchMedia("(prefers-color-scheme: dark)").matches;
    import("https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs")
      .then(function (m) {
        var mermaid = m.default;
        mermaid.initialize({
          startOnLoad: false,
          securityLevel: "loose",
          theme: "base",
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
          var pre = el("pre", "mmfallback", n.textContent.trim());
          n.replaceWith(pre);
        });
      });
  }

  /* ---- 5. go ----------------------------------------------- */
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
