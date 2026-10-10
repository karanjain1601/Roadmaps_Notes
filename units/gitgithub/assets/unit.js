/* ============================================================
   Git & GitHub — shared unit behaviour
   No dependencies, no network calls. Works from file://

   ONE manifest drives everything: the hub listing, the pager,
   and the chapter counts. Add a chapter here and to LIVE.
   ============================================================ */

var PARTS = [
  { id: "p1", name: "Foundations",             blurb: "The model underneath every command." },
  { id: "p2", name: "Everyday Git",            blurb: "The loop you run a hundred times a week." },
  { id: "p3", name: "Branching and integration", blurb: "Getting divergent work back together." },
  { id: "p4", name: "Distributed Git",         blurb: "Other people, other machines." },
  { id: "p5", name: "GitHub the platform",     blurb: "Everything built on top of the protocol." },
  { id: "p6", name: "Operating a repository",  blurb: "Archaeology, surgery and long-term care." }
];

var CHAPTERS = [
  { id: "ch01", n: 1, p: "p1", t: "Orientation: what Git actually is",
    d: "Why version control exists, centralised versus distributed, snapshots over deltas, and a configuration you won't have to redo.", mins: 26, demos: 2 },
  { id: "ch02", n: 2, p: "p1", t: "Inside .git: the object database",
    d: "Blobs, trees, commits and tags. Content addressing with real SHA-1, the directory tour, packfiles and the move to SHA-256.", mins: 32, demos: 2 },
  { id: "ch03", n: 3, p: "p1", t: "The three trees",
    d: "Working tree, index and HEAD; status codes, the diff matrix, selective staging and how .gitignore really resolves.", mins: 30, demos: 2 },
  { id: "ch04", n: 4, p: "p1", t: "Refs, HEAD and the reflog",
    d: "Branches as 41-byte files, detached HEAD, symbolic refs, packed-refs, and the safety net that makes Git hard to lose work in.", mins: 24, demos: 2 },

  { id: "ch05", n: 5, p: "p2", t: "Committing well",
    d: "Atomic commits, staging by hunk, amend, message conventions, trailers, and signing your work.", mins: 26, demos: 2 },
  { id: "ch06", n: 6, p: "p2", t: "Reading history",
    d: "log formatting, revision ranges, blame, shortlog and the pickaxe — finding when and why a line became what it is.", mins: 28, demos: 2 },
  { id: "ch07", n: 7, p: "p2", t: "Diffs and patches",
    d: "Diff algorithms compared, word diffs, format-patch and am, apply, and collaborating with no remote at all.", mins: 24, demos: 2 },
  { id: "ch08", n: 8, p: "p2", t: "Undoing anything",
    d: "restore, reset, revert, clean and reflog recovery, with a decision table for which one the situation calls for.", mins: 28, demos: 2 },

  { id: "ch09", n: 9, p: "p3", t: "Branching models",
    d: "Why Git branches are cheap, naming that scales, trunk-based versus GitHub flow versus git-flow, releases and tags.", mins: 26, demos: 2 },
  { id: "ch10", n: 10, p: "p3", t: "Merging",
    d: "Fast-forward versus three-way, merge bases, the ort strategy, merge options, and what a merge commit records.", mins: 26, demos: 2 },
  { id: "ch11", n: 11, p: "p3", t: "Conflicts",
    d: "Why they happen, reading markers, diff3 and zdiff3, mergetools, rerere, and habits that prevent most of them.", mins: 26, demos: 2 },
  { id: "ch12", n: 12, p: "p3", t: "Rebase and rewriting history",
    d: "Interactive rebase, squash and fixup, --onto, autosquash, the golden rule, and force-pushing without casualties.", mins: 30, demos: 2 },
  { id: "ch13", n: 13, p: "p3", t: "Cherry-pick, revert and backports",
    d: "Moving single commits between branches, reverting a merge, patch-id, and maintaining a release line.", mins: 22, demos: 2 },
  { id: "ch14", n: 14, p: "p3", t: "Stash, worktrees and parallel work",
    d: "Holding unfinished work safely, and running several checkouts of one repository side by side.", mins: 20, demos: 2 },

  { id: "ch15", n: 15, p: "p4", t: "Remotes and refspecs",
    d: "fetch versus pull, tracking branches, what push actually sends, pruning, and shallow and partial clones.", mins: 28, demos: 2 },
  { id: "ch16", n: 16, p: "p4", t: "Collaborating through pull requests",
    d: "Forks versus branches, PR anatomy, review flow, protected branches, merge queues and the three merge buttons.", mins: 28, demos: 2 },
  { id: "ch17", n: 17, p: "p4", t: "Submodules, subtrees, LFS and sparse checkout",
    d: "Composing repositories, surviving large binaries, and working in a repository too big to check out.", mins: 26, demos: 2 },

  { id: "ch18", n: 18, p: "p5", t: "GitHub essentials",
    d: "Repositories, issues, labels, milestones, discussions, Projects, organisations, teams and the permission model.", mins: 26, demos: 2 },
  { id: "ch19", n: 19, p: "p5", t: "Reviewing code and writing docs",
    d: "Review mechanics, CODEOWNERS, suggestions, README craft, Markdown on GitHub and the repo health files.", mins: 24, demos: 2 },
  { id: "ch20", n: 20, p: "p5", t: "GitHub Actions: the model",
    d: "Events, workflows, jobs, steps, runners, contexts, expressions, matrices and where the time actually goes.", mins: 32, demos: 2 },
  { id: "ch21", n: 21, p: "p5", t: "Actions in production",
    d: "Caching, artifacts, secrets and OIDC, environments, reusable workflows, and hardening against supply-chain attacks.", mins: 32, demos: 2 },
  { id: "ch22", n: 22, p: "p5", t: "Automating GitHub: CLI, APIs and webhooks",
    d: "gh, the REST and GraphQL APIs side by side, apps versus tokens, webhooks, rate limits and pagination.", mins: 28, demos: 2 },

  { id: "ch23", n: 23, p: "p6", t: "Repository archaeology and surgery",
    d: "bisect, filter-repo, gc and packfiles, fsck, scheduled maintenance, gitattributes and hooks.", mins: 30, demos: 2 },
  { id: "ch24", n: 24, p: "p6", t: "Practice and reference",
    d: "A command reference, recipes for the moments you've broken something, glossary, checklists and a self-quiz.", mins: 34, demos: 2 }
];

/* Chapters whose page exists. Everything else renders as planned. */
var LIVE = new Set(["ch01", "ch02", "ch03", "ch04", "ch05", "ch06", "ch07", "ch08",
  "ch09", "ch10", "ch11", "ch12", "ch13", "ch14", "ch15", "ch16",
  "ch17", "ch18", "ch19", "ch20", "ch21", "ch22", "ch23", "ch24"]);

/* ==================================================================
   Diff and three-way merge utilities (used by the merging chapters)

   threeWayMerge implements the classic line-based three-way merge:
   diff base against each side, then reconcile the two edit scripts.
   Git's real "ort" strategy adds rename detection, submodule handling
   and several heuristics, so pathological inputs can differ — but the
   clean/conflict decisions below are the same ones it makes.
   ================================================================== */

/* SHA-1 (FIPS 180-4), verified against git hash-object in chapter 2 */
function sha1Bytes(bytes) {
  var ml = bytes.length;
  var out = new Uint8Array(((ml + 8) >> 6 << 6) + 64);
  out.set(bytes);
  out[ml] = 0x80;
  var dv = new DataView(out.buffer), bl = ml * 8;
  dv.setUint32(out.length - 8, Math.floor(bl / 4294967296));
  dv.setUint32(out.length - 4, bl >>> 0);
  var h0 = 0x67452301, h1 = 0xEFCDAB89, h2 = 0x98BADCFE, h3 = 0x10325476, h4 = 0xC3D2E1F0;
  var w = new Uint32Array(80);
  for (var i = 0; i < out.length; i += 64) {
    var j;
    for (j = 0; j < 16; j++) w[j] = dv.getUint32(i + j * 4);
    for (j = 16; j < 80; j++) {
      var n = w[j - 3] ^ w[j - 8] ^ w[j - 14] ^ w[j - 16];
      w[j] = (n << 1) | (n >>> 31);
    }
    var a = h0, b = h1, c = h2, d = h3, e = h4;
    for (j = 0; j < 80; j++) {
      var f, k;
      if (j < 20) { f = (b & c) | (~b & d); k = 0x5A827999; }
      else if (j < 40) { f = b ^ c ^ d; k = 0x6ED9EBA1; }
      else if (j < 60) { f = (b & c) | (b & d) | (c & d); k = 0x8F1BBCDC; }
      else { f = b ^ c ^ d; k = 0xCA62C1D6; }
      var t = (((a << 5) | (a >>> 27)) + f + e + k + w[j]) >>> 0;
      e = d; d = c; c = ((b << 30) | (b >>> 2)) >>> 0; b = a; a = t;
    }
    h0 = (h0 + a) >>> 0; h1 = (h1 + b) >>> 0; h2 = (h2 + c) >>> 0;
    h3 = (h3 + d) >>> 0; h4 = (h4 + e) >>> 0;
  }
  return [h0, h1, h2, h3, h4].map(function (x) { return x.toString(16).padStart(8, "0"); }).join("");
}
function sha1Text(s) { return sha1Bytes(new TextEncoder().encode(s)); }

/* SHA-256 and HMAC-SHA256 (FIPS 180-4, RFC 2104), used for webhook
   signature verification in chapter 22. Verified against Python hashlib
   and hmac. */
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
function patchFingerprint(diffLines) {
  var norm = diffLines
    .filter(function (l) { return /^[+-]/.test(l) && !/^(\+\+\+|---)/.test(l); })
    .map(function (l) { return l.replace(/\s+/g, ""); })
    .filter(function (l) { return l.length > 1; })
    .join("\n");
  return sha1Text(norm);
}

/* longest common subsequence, match-first so equal lines pair greedily */
function lcsDiff(a, b) {
  var n = a.length, m = b.length, i, j;
  var dp = [];
  for (i = 0; i <= n; i++) dp.push(new Int32Array(m + 1));
  for (i = n - 1; i >= 0; i--) {
    for (j = m - 1; j >= 0; j--) {
      dp[i][j] = a[i] === b[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
    }
  }
  var ops = [];
  i = 0; j = 0;
  while (i < n && j < m) {
    if (a[i] === b[j]) { ops.push({ t: " ", s: a[i] }); i++; j++; }
    else if (dp[i + 1][j] >= dp[i][j + 1]) { ops.push({ t: "-", s: a[i] }); i++; }
    else { ops.push({ t: "+", s: b[j] }); j++; }
  }
  while (i < n) ops.push({ t: "-", s: a[i++] });
  while (j < m) ops.push({ t: "+", s: b[j++] });
  return ops;
}

/* an edit script becomes hunks over base line ranges: replace [s,e) with rep */
function editHunks(base, side) {
  var ops = lcsDiff(base, side);
  var hunks = [], cur = null, bi = 0;
  ops.forEach(function (o) {
    if (o.t === " ") {
      if (cur) { hunks.push(cur); cur = null; }
      bi++;
      return;
    }
    if (!cur) cur = { s: bi, e: bi, rep: [] };
    if (o.t === "-") { cur.e = ++bi; }
    else cur.rep.push(o.s);
  });
  if (cur) hunks.push(cur);
  return hunks;
}

function hunksOverlap(x, y) {
  var xEmpty = x.s === x.e, yEmpty = y.s === y.e;
  if (xEmpty && yEmpty) return x.s === y.s;          /* both insert at the same point */
  if (xEmpty) return x.s > y.s && x.s < y.e;          /* insertion strictly inside */
  if (yEmpty) return y.s > x.s && y.s < x.e;
  return x.s < y.e && y.s < x.e;                      /* ranges intersect */
}

function applyHunks(base, hunks, s, e) {
  var out = [], i = s;
  hunks.forEach(function (h) {
    while (i < h.s) out.push(base[i++]);
    h.rep.forEach(function (l) { out.push(l); });
    i = h.e;
  });
  while (i < e) out.push(base[i++]);
  return out;
}

function threeWayMerge(base, ours, theirs) {
  var oh = editHunks(base, ours);
  var th = editHunks(base, theirs);
  var all = oh.map(function (h) { return { h: h, side: "o" }; })
    .concat(th.map(function (h) { return { h: h, side: "t" }; }))
    .sort(function (x, y) { return x.h.s - y.h.s || x.h.e - y.h.e; });

  var regions = [], i = 0, k = 0;
  while (k < all.length) {
    /* grow a zone over every hunk that overlaps or is contained in it */
    var zoneS = all[k].h.s, zoneE = all[k].h.e;
    var members = [all[k]];
    var grew = true;
    var idx = k + 1;
    while (grew) {
      grew = false;
      for (var j = idx; j < all.length; j++) {
        var cand = all[j].h;
        var touches = members.some(function (m) { return hunksOverlap(m.h, cand); });
        if (touches || (cand.s < zoneE && cand.e > zoneS)) {
          if (members.indexOf(all[j]) === -1) {
            members.push(all[j]);
            zoneS = Math.min(zoneS, cand.s);
            zoneE = Math.max(zoneE, cand.e);
            grew = true;
          }
        }
      }
    }
    /* everything before the zone is untouched base */
    while (i < zoneS) { regions.push({ type: "same", lines: [base[i]] }); i++; }

    var mineH = members.filter(function (m) { return m.side === "o"; }).map(function (m) { return m.h; });
    var theirsH = members.filter(function (m) { return m.side === "t"; }).map(function (m) { return m.h; });
    var mine = applyHunks(base, mineH, zoneS, zoneE);
    var yours = applyHunks(base, theirsH, zoneS, zoneE);
    var baseSeg = base.slice(zoneS, zoneE);

    if (!mineH.length) regions.push({ type: "theirs", lines: yours });
    else if (!theirsH.length) regions.push({ type: "ours", lines: mine });
    else if (mine.join("\n") === yours.join("\n")) regions.push({ type: "both-same", lines: mine });
    else regions.push({ type: "conflict", ours: mine, theirs: yours, base: baseSeg });

    i = zoneE;
    /* skip past every member we consumed */
    k = all.indexOf(members[members.length - 1]) + 1;
    for (var q = 0; q < all.length; q++) {
      if (members.indexOf(all[q]) !== -1 && q >= k) k = q + 1;
    }
  }
  while (i < base.length) { regions.push({ type: "same", lines: [base[i]] }); i++; }

  var lines = [], conflicts = 0;
  regions.forEach(function (r) {
    if (r.type === "conflict") { conflicts++; lines.push({ conflict: r }); }
    else r.lines.forEach(function (l) { lines.push(l); });
  });
  return { regions: regions, conflicts: conflicts, clean: conflicts === 0, lines: lines };
}

/* conflict markers in the three styles Git can produce */
function conflictBlock(region, style, oursLabel, theirsLabel) {
  var ours = region.ours.slice(), theirs = region.theirs.slice();
  var pre = [], post = [];
  if (style === "zdiff3") {
    while (ours.length && theirs.length && ours[0] === theirs[0]) { pre.push(ours.shift()); theirs.shift(); }
    while (ours.length && theirs.length && ours[ours.length - 1] === theirs[theirs.length - 1]) {
      post.unshift(ours.pop()); theirs.pop();
    }
  }
  var out = pre.slice();
  out.push("<<<<<<< " + (oursLabel || "HEAD"));
  ours.forEach(function (l) { out.push(l); });
  if (style === "diff3" || style === "zdiff3") {
    out.push("||||||| base");
    region.base.forEach(function (l) { out.push(l); });
  }
  out.push("=======");
  theirs.forEach(function (l) { out.push(l); });
  out.push(">>>>>>> " + (theirsLabel || "feature"));
  post.forEach(function (l) { out.push(l); });
  return out;
}

function mergedFile(result, style, oursLabel, theirsLabel) {
  var out = [];
  result.regions.forEach(function (r) {
    if (r.type === "conflict") conflictBlock(r, style, oursLabel, theirsLabel).forEach(function (l) { out.push(l); });
    else r.lines.forEach(function (l) { out.push(l); });
  });
  return out;
}

/* ------------------------------------------------------------------
   Code painting — the page ships plain escaped text and we tokenise
   it here, so no hand-written highlight markup can break the DOM.
   ------------------------------------------------------------------ */
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
