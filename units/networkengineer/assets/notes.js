/* ============================================================
   Roadmap Notes — Network Engineer unit
   Same chrome as the other units: chapter manifest, left rail,
   in-page contents with scrollspy, reading progress, prev/next,
   code copying, heading anchors and Mermaid rendering.
   ============================================================ */
(function () {
  "use strict";

  var PARTS = [
    { id: "p1", name: "Foundations",
      blurb: "What actually happens when a packet crosses a network, the layered models as diagnostic tools, the wire itself, and how addresses are planned." },
    { id: "p2", name: "Moving packets",
      blurb: "Switching within a segment, routing between them, the interior protocols that converge, and the one protocol that holds the internet together." },
    { id: "p3", name: "Transport and services",
      blurb: "TCP and UDP in depth, then the services every network depends on and nobody notices until they break." },
    { id: "p4", name: "Wireless and the edge",
      blurb: "Radio as a shared medium, the wide-area links that connect sites, and shaping traffic when there is not enough capacity." },
    { id: "p5", name: "Security and resilience",
      blurb: "Firewalls and segmentation from the network engineer's side, encrypted tunnels, and designing so that a failure is survivable." },
    { id: "p6", name: "Operating",
      blurb: "Seeing what the network is doing, finding faults methodically, automating configuration, and the job itself." }
  ];

  var CHAPTERS = [
    { n: 1,  p: "p1", f: "01-how-networks-work.html",     t: "How a network actually works",
      d: "One packet from a laptop to a server, every hop, and where the milliseconds genuinely go.",
      k: "hops · latency · propagation · serialisation", ready: true },
    { n: 2,  p: "p1", f: "02-layered-models.html",        t: "The layered models",
      d: "OSI and TCP/IP treated as diagnostic instruments rather than trivia, plus what encapsulation costs.",
      k: "OSI · TCP/IP · encapsulation · overhead", ready: true },
    { n: 3,  p: "p1", f: "03-physical-and-link.html",     t: "The wire and the frame",
      d: "Copper, fibre and radio, Ethernet framing, MAC addressing, collision and broadcast domains.",
      k: "Ethernet · MAC · fibre · duplex", ready: true },
    { n: 4,  p: "p1", f: "04-addressing.html",            t: "Addressing and address plans",
      d: "IPv4 and IPv6, subnetting and CIDR, and designing a hierarchy that summarises cleanly.",
      k: "CIDR · VLSM · summarisation · IPv6", ready: true },

    { n: 5,  p: "p2", f: "05-switching.html",             t: "Switching",
      d: "MAC learning, VLANs and trunks, spanning tree, link aggregation, and the loops that take a site down.",
      k: "VLAN · STP · LACP · broadcast domain", ready: true },
    { n: 6,  p: "p2", f: "06-routing-fundamentals.html",  t: "Routing fundamentals",
      d: "The forwarding decision, longest prefix match, static routes, default gateways and administrative distance.",
      k: "FIB · longest prefix · static · metrics", ready: true },
    { n: 7,  p: "p2", f: "07-interior-routing.html",      t: "Interior routing protocols",
      d: "Distance vector against link state, OSPF areas, EIGRP, IS-IS, and what convergence really costs.",
      k: "OSPF · EIGRP · IS-IS · convergence", ready: true },
    { n: 8,  p: "p2", f: "08-bgp.html",                   t: "BGP and the internet",
      d: "Autonomous systems, path selection, peering and transit, route leaks, and MPLS.",
      k: "BGP · AS path · peering · MPLS", ready: true },

    { n: 9,  p: "p3", f: "09-transport.html",             t: "TCP and UDP",
      d: "The handshake, windows and congestion control, why throughput depends on latency, and when UDP wins.",
      k: "TCP · congestion · window · QUIC", ready: true },
    { n: 10, p: "p3", f: "10-dns.html",                   t: "DNS",
      d: "Resolution end to end, record types, caching and TTLs, anycast, and the failure modes.",
      k: "resolver · TTL · anycast · records", ready: true },
    { n: 11, p: "p3", f: "11-network-services.html",      t: "The services underneath",
      d: "DHCP, NTP, syslog and the rest — invisible until one of them fails, then responsible for everything.",
      k: "DHCP · NTP · syslog · IPAM", ready: true },
    { n: 12, p: "p3", f: "12-nat-and-ipv6.html",          t: "NAT and the IPv6 transition",
      d: "Why NAT exists, what it breaks, and the honest state of running dual-stack.",
      k: "NAT · CGNAT · dual stack · SLAAC", ready: true },

    { n: 13, p: "p4", f: "13-wireless.html",              t: "Wireless",
      d: "Radio as a shared medium, channels and interference, standards, controllers and site survey.",
      k: "802.11 · RF · channels · roaming", ready: true },
    { n: 14, p: "p4", f: "14-wan-and-edge.html",          t: "The wide area",
      d: "Circuits and providers, MPLS against internet transport, SD-WAN, and mobile networks.",
      k: "WAN · SD-WAN · circuits · mobile", ready: true },
    { n: 15, p: "p4", f: "15-traffic-management.html",    t: "Load balancing and quality of service",
      d: "Distribution algorithms, health checks, queueing disciplines, shaping and policing.",
      k: "load balancing · QoS · shaping · queues", ready: true },

    { n: 16, p: "p5", f: "16-network-security.html",      t: "Network security",
      d: "Firewall types and where they sit, IDS and IPS, segmentation design, and access control on the port.",
      k: "firewall · IPS · segmentation · 802.1X", ready: true },
    { n: 17, p: "p5", f: "17-vpns.html",                  t: "Tunnels and VPNs",
      d: "IPsec, TLS-based remote access, WireGuard, overlays, and what zero trust changes for the network.",
      k: "IPsec · WireGuard · overlay · zero trust", ready: true },
    { n: 18, p: "p5", f: "18-resilience.html",            t: "Designing for failure",
      d: "Redundancy that helps, convergence times, first-hop redundancy, and the failures redundancy causes.",
      k: "HA · VRRP · convergence · blast radius", ready: true },

    { n: 19, p: "p6", f: "19-observability.html",         t: "Seeing the network",
      d: "SNMP, flow records, packet capture, streaming telemetry, and choosing what to keep.",
      k: "SNMP · NetFlow · capture · telemetry", ready: true },
    { n: 20, p: "p6", f: "20-troubleshooting.html",       t: "Troubleshooting",
      d: "A method that converges, the tools in order of usefulness, and reading a capture without drowning.",
      k: "method · ping · traceroute · Wireshark", ready: true },
    { n: 21, p: "p6", f: "21-automation.html",            t: "Network automation",
      d: "Configuration as code, idempotency on devices that resist it, testing changes, and intent-based networking.",
      k: "Ansible · NETCONF · CI · intent", ready: true },
    { n: 22, p: "p6", f: "22-the-profession.html",        t: "The profession",
      d: "Specialisms, certifications assessed honestly, building a lab, and where the field is going.",
      k: "career · certifications · lab · cloud", ready: true }
  ];

  var UNIT = { title: "Network Engineer", home: "../../index.html", contents: "index.html" };
  window.NEUNIT = { PARTS: PARTS, CHAPTERS: CHAPTERS, UNIT: UNIT };

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
            primaryBorderColor: "#3A5670", lineColor: "#7B92A4", secondaryColor: "#2B2510",
            tertiaryColor: "#12222F", fontSize: "14px"
          } : {
            background: "#FFFFFF", primaryColor: "#F4F7F9", primaryTextColor: "#16232F",
            primaryBorderColor: "#8FA3B5", lineColor: "#54677A", secondaryColor: "#FAF3DE",
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
