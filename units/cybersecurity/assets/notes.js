/* ============================================================
   Roadmap Notes — Cyber Security unit
   Same chrome as the other units: chapter manifest, left rail,
   in-page contents with scrollspy, reading progress, prev/next,
   code copying, heading anchors and Mermaid rendering.
   ============================================================ */
(function () {
  "use strict";

  var PARTS = [
    { id: "p1", name: "Foundations",
      blurb: "What the work is actually for, and the two systems everything else is built on — the network and the host." },
    { id: "p2", name: "The adversary",
      blurb: "How intrusions are structured, and the attacks that recur at every layer from the person to the application." },
    { id: "p3", name: "Cryptography and identity",
      blurb: "The primitives, the protocols built from them, and how systems decide who someone is." },
    { id: "p4", name: "Defence",
      blurb: "Reducing what can be attacked, controlling what crosses a boundary, and knowing what you are exposed to." },
    { id: "p5", name: "Detection and response",
      blurb: "Seeing it happen, deciding it matters, containing it, and finding out what actually occurred." },
    { id: "p6", name: "Offence and the profession",
      blurb: "Testing your own defences deliberately, and the frameworks, standards and career the field is organised around." }
  ];

  var CHAPTERS = [
    { n: 1,  p: "p1", f: "01-what-security-is.html",   t: "What security work is for",
      d: "The CIA triad used precisely, risk as likelihood times impact, threat modelling, defence in depth and what zero trust actually means.",
      k: "CIA · risk · threat modelling · zero trust", ready: true },
    { n: 2,  p: "p1", f: "02-networking.html",          t: "Networking for defenders",
      d: "The OSI model as a diagnostic tool, addressing and subnetting, the protocols and ports that matter, and segmentation as a control.",
      k: "OSI · TCP/IP · subnetting · VLAN · DMZ", ready: true },
    { n: 3,  p: "p1", f: "03-hosts.html",               t: "Hosts and operating systems",
      d: "Processes, privileges and the permission models of Windows and Linux, plus the commands that tell you what a machine is doing.",
      k: "permissions · processes · services · registry", ready: true },

    { n: 4,  p: "p2", f: "04-attack-structure.html",    t: "How an intrusion is structured",
      d: "The cyber kill chain, MITRE ATT&CK tactics and techniques, the diamond model, and why the structure matters for defence.",
      k: "kill chain · ATT&CK · TTPs · diamond model", ready: true },
    { n: 5,  p: "p2", f: "05-recon-and-access.html",    t: "Reconnaissance and initial access",
      d: "OSINT, footprinting, phishing and its variants, the rest of social engineering, and credential attacks.",
      k: "OSINT · phishing · password spray · pretexting", ready: true },
    { n: 6,  p: "p2", f: "06-network-attacks.html",     t: "Network attacks",
      d: "Spoofing, ARP and DNS poisoning, machine-in-the-middle, denial of service, VLAN hopping and wireless attacks.",
      k: "MITM · ARP · DDoS · evil twin · deauth", ready: true },
    { n: 7,  p: "p2", f: "07-application-attacks.html", t: "Application attacks",
      d: "The OWASP Top 10 as it actually appears: injection, broken access control, XSS, CSRF, deserialisation and traversal.",
      k: "OWASP · SQLi · XSS · CSRF · SSRF", ready: true },

    { n: 8,  p: "p3", f: "08-cryptography.html",        t: "Cryptography",
      d: "Symmetric and asymmetric ciphers, hashing, key exchange, digital signatures and the PKI that binds keys to names.",
      k: "AES · RSA · hashing · PKI · certificates", ready: true },
    { n: 9,  p: "p3", f: "09-secure-protocols.html",    t: "Secure protocols",
      d: "TLS, SSH, IPsec, DNSSEC and their insecure ancestors — what each protects, and what is still exposed.",
      k: "TLS · SSH · IPsec · VPN · DNSSEC", ready: true },
    { n: 10, p: "p3", f: "10-identity.html",            t: "Identity and access",
      d: "Kerberos, LDAP, RADIUS and SAML, multi-factor authentication, least privilege, and the privilege-escalation paths that matter.",
      k: "Kerberos · LDAP · SSO · MFA · privesc", ready: true },

    { n: 11, p: "p4", f: "11-hardening.html",           t: "Hardening",
      d: "Attack surface reduction, secure baselines, patching, group policy, ACLs and the hardening decisions with the highest return.",
      k: "CIS benchmarks · baselines · patching · GPO", ready: true },
    { n: 12, p: "p4", f: "12-controls.html",            t: "Perimeter and endpoint controls",
      d: "Firewall generations, IDS and IPS, EDR, DLP, proxies, sandboxing and honeypots — what each catches and what it misses.",
      k: "firewall · IDS/IPS · EDR · DLP · NAC", ready: true },
    { n: 13, p: "p4", f: "13-vulnerability-management.html", t: "Vulnerability management",
      d: "Scanning, CVE and CVSS, why the score is not the priority, exploit prediction, and running a patch cycle that finishes.",
      k: "CVE · CVSS · EPSS · KEV · scanning", ready: true },
    { n: 14, p: "p4", f: "14-cloud-security.html",      t: "Cloud security",
      d: "Shared responsibility, identity as the new perimeter, the misconfigurations that cause most cloud breaches, and scanning infrastructure as code.",
      k: "IAM · shared responsibility · CSPM · secrets", ready: true },

    { n: 15, p: "p5", f: "15-logging.html",             t: "Logging and telemetry",
      d: "What each source actually tells you, what is missing by default, retention, and the cost model that decides what you keep.",
      k: "syslog · event logs · netflow · PCAP", ready: true },
    { n: 16, p: "p5", f: "16-detection.html",           t: "Detection engineering",
      d: "SIEM, detection rules, the base rate problem, tuning false positives, and hunting for what the rules do not catch.",
      k: "SIEM · Sigma · false positives · hunting", ready: true },
    { n: 17, p: "p5", f: "17-incident-response.html",   t: "Incident response",
      d: "Preparation, identification, containment, eradication, recovery and lessons learned — with the decisions that are genuinely hard.",
      k: "IR lifecycle · containment · comms · tabletop", ready: true },
    { n: 18, p: "p5", f: "18-forensics.html",           t: "Digital forensics",
      d: "Order of volatility, memory and disk acquisition, timelines, chain of custody, and what an attacker does to defeat all of it.",
      k: "volatility · imaging · timeline · anti-forensics", ready: true },

    { n: 19, p: "p6", f: "19-penetration-testing.html", t: "Penetration testing",
      d: "Methodology, rules of engagement, the toolchain, and the difference between a scan, a test and a red-team engagement.",
      k: "scoping · nmap · Burp · Metasploit · reporting", ready: true },
    { n: 20, p: "p6", f: "20-red-blue-purple.html",     t: "Red, blue and purple",
      d: "Adversary emulation, detection validation, capture the flag, home labs and how to actually build the skill.",
      k: "red team · purple team · CTF · Atomic tests", ready: true },
    { n: 21, p: "p6", f: "21-governance.html",          t: "Governance, risk and compliance",
      d: "NIST CSF, ISO 27001, SOC 2 and the rest, risk registers, policy that people follow, and audits that are not theatre.",
      k: "NIST · ISO 27001 · SOC 2 · risk register", ready: true },
    { n: 22, p: "p6", f: "22-career.html",              t: "The profession",
      d: "The specialisms and what each day looks like, which certifications are worth what, and staying current without drowning.",
      k: "SOC · certifications · specialisms · burnout", ready: true }
  ];

  var UNIT = { title: "Cyber Security", home: "../../index.html", contents: "index.html" };
  window.CSUNIT = { PARTS: PARTS, CHAPTERS: CHAPTERS, UNIT: UNIT };

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
