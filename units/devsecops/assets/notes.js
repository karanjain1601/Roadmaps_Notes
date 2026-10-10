/* ============================================================
   Roadmap Notes — DevSecOps unit
   Same chrome as the other units: chapter manifest, left rail,
   in-page contents with scrollspy, reading progress, prev/next,
   code copying, heading anchors and Mermaid rendering.
   ============================================================ */
(function () {
  "use strict";

  var PARTS = [
    { id: "p1", name: "Foundations",
      blurb: "What the practice actually changes, the delivery pipeline as a system to be secured, and threat modelling aimed at how software is built." },
    { id: "p2", name: "Writing it",
      blurb: "Secure coding, the analysis tools and what each genuinely finds, the dependencies you inherit, and secrets." },
    { id: "p3", name: "Building it",
      blurb: "The pipeline as your most privileged system: hardening it, proving what came out of it, and expressing policy as code." },
    { id: "p4", name: "Running it",
      blurb: "Containers, Kubernetes, cloud posture and runtime — the platforms the artefacts land on." },
    { id: "p5", name: "Operating it",
      blurb: "Vulnerability management that finishes, response with engineering teams, and the architecture patterns that hold." },
    { id: "p6", name: "The programme",
      blurb: "Automation worth having, compliance as evidence rather than theatre, and making any of it stick." }
  ];

  var CHAPTERS = [
    { n: 1,  p: "p1", f: "01-what-devsecops-changes.html", t: "What DevSecOps changes",
      d: "Shifting left, why the feedback loop is the mechanism rather than the slogan, and friction as the thing that decides whether a control exists.",
      k: "shift left · feedback · friction · ownership", ready: true },
    { n: 2,  p: "p1", f: "02-the-pipeline.html",           t: "The delivery pipeline as a system",
      d: "Every stage from an idea to production, which control belongs at each, and what each one costs in cycle time.",
      k: "SDLC · gates · cycle time · guardrails", ready: true },
    { n: 3,  p: "p1", f: "03-threat-modelling.html",       t: "Threat modelling the build",
      d: "STRIDE applied to your own delivery system, mapping the attack surface of the thing that ships your code.",
      k: "STRIDE · trust boundaries · build attack surface", ready: true },

    { n: 4,  p: "p2", f: "04-secure-coding.html",          t: "Secure coding",
      d: "The defect classes that recur, the language and framework features that remove them, and review that finds what tools cannot.",
      k: "injection · validation · encoding · review", ready: true },
    { n: 5,  p: "p2", f: "05-code-analysis.html",          t: "Finding flaws in code",
      d: "SAST, DAST, IAST and fuzzing — what each genuinely detects, the false positive economics, and where to run them.",
      k: "SAST · DAST · fuzzing · false positives", ready: true },
    { n: 6,  p: "p2", f: "06-supply-chain.html",           t: "Dependencies and the supply chain",
      d: "Transitive risk, SBOMs, typosquatting and confusion attacks, provenance, and pinning that actually protects.",
      k: "SBOM · SCA · transitive · provenance", ready: true },
    { n: 7,  p: "p2", f: "07-secrets.html",                t: "Secrets",
      d: "Detection, storage, injection, rotation and revocation — the full lifecycle, and why history is the hard part.",
      k: "vaults · rotation · scanning · dynamic credentials", ready: true },

    { n: 8,  p: "p3", f: "08-pipeline-hardening.html",     t: "Hardening the pipeline",
      d: "The build system is your most privileged principal. Runner isolation, untrusted pull requests, and the permissions nobody scoped.",
      k: "runners · OIDC · fork PRs · least privilege", ready: true },
    { n: 9,  p: "p3", f: "09-provenance.html",             t: "Artefacts and provenance",
      d: "Signing, attestation, SLSA levels and reproducibility — proving that what you deploy is what you built.",
      k: "signing · SLSA · attestation · admission", ready: true },
    { n: 10, p: "p3", f: "10-policy-as-code.html",         t: "Policy as code",
      d: "Expressing rules as testable artefacts, where to enforce them, and the difference between a guardrail and a gate.",
      k: "OPA · Rego · guardrails · exceptions", ready: true },
    { n: 11, p: "p3", f: "11-iac-security.html",           t: "Infrastructure as code",
      d: "Scanning definitions rather than deployments, module design with secure defaults, state files, and drift.",
      k: "Terraform · modules · drift · state", ready: true },

    { n: 12, p: "p4", f: "12-container-security.html",     t: "Container security",
      d: "Images and layers, minimal bases, rootless and capabilities, and what isolation a container does and does not give you.",
      k: "images · rootless · capabilities · seccomp", ready: true },
    { n: 13, p: "p4", f: "13-kubernetes-security.html",    t: "Kubernetes security",
      d: "RBAC, network policy, admission control, pod security standards, secrets, and multi-tenancy that holds.",
      k: "RBAC · NetworkPolicy · admission · tenancy", ready: true },
    { n: 14, p: "p4", f: "14-cloud-posture.html",          t: "Cloud posture at scale",
      d: "Landing zones, organisation guardrails, permission right-sizing, and detecting the misconfiguration classes that matter.",
      k: "landing zones · SCPs · CSPM · right-sizing", ready: true },
    { n: 15, p: "p4", f: "15-runtime.html",                t: "Runtime protection",
      d: "eBPF and syscall-level visibility, runtime detection for workloads, and what to watch when the artefact is running.",
      k: "eBPF · Falco · workload telemetry", ready: true },

    { n: 16, p: "p5", f: "16-vuln-management.html",        t: "Vulnerability management for delivery teams",
      d: "Targets that can be met, reachability analysis, automated upgrades, and routing findings to whoever can fix them.",
      k: "SLAs · reachability · auto-upgrade · ownership", ready: true },
    { n: 17, p: "p5", f: "17-response.html",               t: "Response with engineering teams",
      d: "Who is on call for a security incident, runbooks engineers will follow, and retrospectives that change the system.",
      k: "on-call · runbooks · blameless · game days", ready: true },
    { n: 18, p: "p5", f: "18-secure-architecture.html",    t: "Secure architecture patterns",
      d: "Zero trust between services, mutual TLS and workload identity, secure API design, and surviving traffic you did not want.",
      k: "mTLS · service mesh · API design · DDoS", ready: true },
    { n: 19, p: "p5", f: "19-identity-at-scale.html",      t: "Identity and certificates at scale",
      d: "Workload identity, short-lived credentials, PKI design, certificate lifecycle and the outages it causes.",
      k: "workload identity · PKI · rotation · SPIFFE", ready: true },

    { n: 20, p: "p6", f: "20-automation.html",             t: "Automating security work",
      d: "What to automate and what not to, SOAR in practice, auto-remediation, and the failure modes of acting without a human.",
      k: "SOAR · auto-remediation · toil · blast radius", ready: true },
    { n: 21, p: "p6", f: "21-compliance-as-code.html",     t: "Compliance as code",
      d: "Control mapping, generating evidence from systems rather than screenshots, and audits that are not theatre.",
      k: "SOC 2 · ISO 27001 · evidence · control mapping", ready: true },
    { n: 22, p: "p6", f: "22-making-it-stick.html",        t: "Making it stick",
      d: "Metrics that drive the right behaviour, security champions, maturity models used honestly, and the role itself.",
      k: "metrics · champions · maturity · the role", ready: true }
  ];

  var UNIT = { title: "DevSecOps", home: "../../index.html", contents: "index.html" };
  window.DSUNIT = { PARTS: PARTS, CHAPTERS: CHAPTERS, UNIT: UNIT };

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
