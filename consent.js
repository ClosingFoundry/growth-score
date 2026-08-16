/* fac16 consent
   Opt-in consent for non-essential storage. Nothing non-essential loads until
   the visitor chooses. Published by Closing Foundry Ltd. */
(function () {
  "use strict";

  var VERSION = "1.1";
  var KEY = "cc_consent";
  var CLARITY_ID = "y3e5xpqs63";
  var GA_ID = "G-ZZZ07MC1P4";
  var PRIVACY = "/privacy/";

  /* ---------- storage ---------- */

  function read() {
    try {
      var raw = window.localStorage.getItem(KEY);
      if (!raw) return null;
      var rec = JSON.parse(raw);
      if (!rec || rec.v !== VERSION) return null;
      return rec;
    } catch (e) { return null; }
  }

  function write(analytics, method) {
    var rec = { v: VERSION, ts: Date.now(), method: method, necessary: true, analytics: !!analytics };
    try { window.localStorage.setItem(KEY, JSON.stringify(rec)); } catch (e) {}
    return rec;
  }

  /* ---------- clarity ---------- */

  var clarityLoaded = false;

  function loadClarity() {
    if (clarityLoaded || window.clarity) return;
    clarityLoaded = true;
    window.clarity = window.clarity || function () {
      (window.clarity.q = window.clarity.q || []).push(arguments);
    };
    var t = document.createElement("script");
    t.async = 1;
    t.src = "https://www.clarity.ms/tag/" + CLARITY_ID;
    var first = document.getElementsByTagName("script")[0];
    if (first && first.parentNode) first.parentNode.insertBefore(t, first);
    else (document.head || document.documentElement).appendChild(t);
  }

  /* ---------- google analytics ---------- */

  var gaLoaded = false;

  function loadGA() {
    if (gaLoaded) return;
    gaLoaded = true;
    var t = document.createElement("script");
    t.async = true;
    t.src = "https://www.googletagmanager.com/gtag/js?id=" + GA_ID;
    (document.head || document.documentElement).appendChild(t);
    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
    window.gtag("js", new Date());
    window.gtag("config", GA_ID);
  }

  /* ---------- withdrawal ---------- */

  function clearAnalyticsCookies() {
    var names = ["_clck", "_clsk", "CLID", "MUID", "ANONCHK", "SM", "MR",
                 "_ga", "_ga_" + GA_ID.replace("G-", ""), "_gid", "_gat"];
    var host = location.hostname;
    var domains = ["", host, "." + host];
    var parts = host.split(".");
    if (parts.length > 2) domains.push("." + parts.slice(-2).join("."));
    for (var i = 0; i < names.length; i++) {
      for (var d = 0; d < domains.length; d++) {
        document.cookie = names[i] + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/" +
          (domains[d] ? "; domain=" + domains[d] : "");
      }
    }
  }

  function apply(rec, viaChoice) {
    if (rec && rec.analytics) {
      loadClarity();
      loadGA();
      return;
    }
    if (viaChoice) {
      clearAnalyticsCookies();
      if (window.clarity || window.dataLayer) location.reload();
    }
  }

  /* ---------- styles ---------- */

  var CSS = [
    '#cc-bar,#cc-ov,#cc-modal,.cc-b{font-family:var(--body,system-ui,sans-serif)}',
    '#cc-bar{position:fixed;left:20px;bottom:20px;z-index:80;width:min(420px,calc(100vw - 40px));',
    'background:var(--paper,#fff);color:var(--ink,#0E1B2C);border:1px solid var(--ink,#0E1B2C);border-radius:3px}',
    '#cc-bar[hidden],#cc-ov[hidden],#cc-foot-btn[hidden]{display:none}',
    '.cc-pad{padding:18px 20px 16px}',
    '.cc-k{font-family:var(--mono,ui-monospace,monospace);font-size:11px;letter-spacing:.13em;text-transform:uppercase;color:var(--mid,#5F6C85);margin:0 0 8px}',
    '.cc-p{margin:0;font-size:14px;line-height:1.6;color:var(--ink-soft,#33415C)}',
    '.cc-p a{color:var(--mark,#0B4ED6)}',
    '.cc-row{display:flex;border-top:1px solid var(--rule,#E2E7F0)}',
    '.cc-b{flex:1;padding:12px 8px;background:var(--paper,#fff);color:var(--ink,#0E1B2C);border:0;',
    'border-right:1px solid var(--rule,#E2E7F0);font-size:13px;font-weight:600;line-height:1.4;cursor:pointer;border-radius:0}',
    '.cc-b:last-child{border-right:0}',
    '.cc-b:hover{background:var(--paper-alt,#F4F6FA)}',
    '.cc-b.cc-quiet{font-weight:400;color:var(--mid,#5F6C85)}',
    '#cc-ov{position:fixed;inset:0;z-index:90;background:rgba(14,27,44,.55);display:flex;align-items:center;justify-content:center;padding:16px}',
    '#cc-modal{background:var(--paper,#fff);color:var(--ink,#0E1B2C);border:1px solid var(--rule,#E2E7F0);border-radius:3px;',
    'width:100%;max-width:620px;max-height:88vh;display:flex;flex-direction:column}',
    '.cc-head{display:flex;align-items:center;justify-content:space-between;gap:16px;padding:18px 22px;border-bottom:1px solid var(--rule,#E2E7F0)}',
    '.cc-h{margin:0;font-family:var(--display,system-ui,sans-serif);font-size:20px;font-weight:700;letter-spacing:-.022em}',
    '.cc-x{background:none;border:0;color:var(--mid,#5F6C85);font-size:18px;line-height:1;cursor:pointer;padding:4px 6px;border-radius:3px}',
    '.cc-x:hover{color:var(--ink,#0E1B2C)}',
    '.cc-body{padding:18px 22px;overflow-y:auto;flex:1}',
    '.cc-cat{border-top:1px solid var(--rule,#E2E7F0);padding:14px 0}',
    '.cc-cat:last-of-type{border-bottom:1px solid var(--rule,#E2E7F0)}',
    '.cc-ch{display:flex;align-items:center;justify-content:space-between;gap:14px}',
    '.cc-cn{font-size:15px;font-weight:600}',
    '.cc-on{font-family:var(--mono,ui-monospace,monospace);font-size:11px;letter-spacing:.13em;text-transform:uppercase;color:var(--mid,#5F6C85);white-space:nowrap}',
    '.cc-sw{display:inline-flex;align-items:center;gap:9px;cursor:pointer;font-family:var(--mono,ui-monospace,monospace);',
    'font-size:11px;letter-spacing:.13em;text-transform:uppercase;color:var(--mid,#5F6C85);white-space:nowrap}',
    '.cc-sw input{width:16px;height:16px;margin:0;accent-color:var(--mark,#0B4ED6)}',
    '.cc-d{margin:8px 0 0;font-size:13px;line-height:1.6;color:var(--ink-soft,#33415C)}',
    '.cc-list{margin:12px 0 0;border-top:1px solid var(--rule,#E2E7F0)}',
    '.cc-i{padding:9px 0;border-bottom:1px solid var(--rule,#E2E7F0);font-size:12px;line-height:1.6;color:var(--mid,#5F6C85)}',
    '.cc-i:last-child{border-bottom:0}',
    '.cc-n{font-family:var(--mono,ui-monospace,monospace);font-size:12px;color:var(--ink,#0E1B2C)}',
    '.cc-rec{margin-top:16px;padding:11px 13px;background:var(--paper-alt,#F4F6FA);border:1px solid var(--rule,#E2E7F0);border-radius:3px;',
    'font-family:var(--mono,ui-monospace,monospace);font-size:11px;line-height:1.7;color:var(--mid,#5F6C85)}',
    '#cc-foot-btn{background:none;border:0;padding:0;color:inherit;font:inherit;text-decoration:underline;text-underline-offset:2px;cursor:pointer}',
    '@media(max-width:640px){#cc-bar{left:12px;right:12px;bottom:12px;width:auto}.cc-row{flex-wrap:wrap}.cc-b{flex:1 0 100%;border-right:0;border-bottom:1px solid var(--rule,#E2E7F0)}.cc-b:last-child{border-bottom:0}}'
  ].join("");

  /* ---------- markup ---------- */

  var BAR =
    '<div class="cc-pad">' +
      '<p class="cc-k">Cookies</p>' +
      '<p class="cc-p">This site needs no cookies to work. With your consent we use Microsoft Clarity and Google Analytics to see how pages are used and where they are unclear. Nothing optional is stored until you choose. <a href="' + PRIVACY + '">Privacy</a>.</p>' +
    '</div>' +
    '<div class="cc-row">' +
      '<button type="button" class="cc-b cc-quiet" data-cc="open">Choose</button>' +
      '<button type="button" class="cc-b" data-cc="reject">Reject</button>' +
      '<button type="button" class="cc-b" data-cc="accept">Accept</button>' +
    '</div>';

  var MODAL =
    '<div id="cc-modal" role="dialog" aria-modal="true" aria-labelledby="cc-title">' +
      '<div class="cc-head">' +
        '<h2 class="cc-h" id="cc-title">Cookie preferences</h2>' +
        '<button type="button" class="cc-x" data-cc="close" aria-label="Close">&#10005;</button>' +
      '</div>' +
      '<div class="cc-body">' +
        '<p class="cc-d">Necessary storage is always on. Everything else is off until you turn it on, and you can change it at any time. The site also loads a web font from Google Fonts, which sends a request to Google but sets no cookie. <a href="' + PRIVACY + '">Privacy</a>.</p>' +

        '<div class="cc-cat">' +
          '<div class="cc-ch"><span class="cc-cn">Necessary</span><span class="cc-on">Always on</span></div>' +
          '<p class="cc-d">Remembers your choice on this page and nothing else. No consent is required for these.</p>' +
          '<div class="cc-list">' +
            '<div class="cc-i"><span class="cc-n">cc_consent</span><br>Stores this choice. First party, local storage, kept until you clear it or the policy version changes.</div>' +
            '<div class="cc-i"><span class="cc-n">fac16sig</span><br>Records that the home page animation has played. First party, session storage, cleared when you close the tab.</div>' +
          '</div>' +
        '</div>' +

        '<div class="cc-cat">' +
          '<div class="cc-ch"><span class="cc-cn">Analytics</span>' +
            '<label class="cc-sw"><input type="checkbox" id="cc-analytics"> On</label>' +
          '</div>' +
          '<p class="cc-d">Microsoft Clarity and Google Analytics. Between them they show which pages are used, where people arrive from, where they stop, and where the wording is unclear. Clarity also records on-page movement and clicks. Text typed into form fields is masked before it leaves your browser. Assessment answers, scores and results are never sent to either.</p>' +
          '<div class="cc-list">' +
            '<div class="cc-i"><span class="cc-n">_clck</span><br>Links this visit to earlier ones. Microsoft, one year.</div>' +
            '<div class="cc-i"><span class="cc-n">_clsk</span><br>Joins the pages of a single visit. Microsoft, one day.</div>' +
            '<div class="cc-i"><span class="cc-n">CLID</span> and related<br>Set by Microsoft on clarity.ms as part of the same service.</div>' +
            '<div class="cc-i"><span class="cc-n">_ga</span> and <span class="cc-n">_ga_ZZZ07MC1P4</span><br>Count visits and tell a returning visit from a new one. Google, two years.</div>' +
            '<div class="cc-i"><span class="cc-n">_gid</span><br>Groups the pages of one day&rsquo;s visiting. Google, one day.</div>' +
            '<div class="cc-i">Turning analytics off stops further collection and clears what this site can clear. Microsoft and Google may hold the rest until it expires.</div>' +
          '</div>' +
        '</div>' +

        '<div class="cc-rec" id="cc-rec" hidden></div>' +
      '</div>' +
      '<div class="cc-row">' +
        '<button type="button" class="cc-b" data-cc="reject">Reject all</button>' +
        '<button type="button" class="cc-b" data-cc="save">Save</button>' +
        '<button type="button" class="cc-b" data-cc="accept">Accept all</button>' +
      '</div>' +
    '</div>';

  /* ---------- ui ---------- */

  var bar, ov, box, lastFocus;

  function mount() {
    var st = document.createElement("style");
    st.id = "cc-css";
    st.textContent = CSS;
    document.head.appendChild(st);

    bar = document.createElement("div");
    bar.id = "cc-bar";
    bar.setAttribute("role", "region");
    bar.setAttribute("aria-label", "Cookie choice");
    bar.innerHTML = BAR;
    bar.hidden = true;

    ov = document.createElement("div");
    ov.id = "cc-ov";
    ov.innerHTML = MODAL;
    ov.hidden = true;

    document.body.appendChild(bar);
    document.body.appendChild(ov);
    box = document.getElementById("cc-analytics");

    document.addEventListener("click", onClick);
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !ov.hidden) closeModal();
    });
    ov.addEventListener("click", function (e) { if (e.target === ov) closeModal(); });

    addFooterLink();
  }

  function addFooterLink() {
    var host = document.querySelector("footer .foot-bottom") || document.querySelector("footer .wrap") || document.querySelector("footer");
    if (!host) return;
    var wrap = document.createElement("span");
    var btn = document.createElement("button");
    btn.type = "button";
    btn.id = "cc-foot-btn";
    btn.setAttribute("data-cc", "open");
    btn.textContent = "Cookie settings";
    wrap.appendChild(btn);
    host.appendChild(wrap);
  }

  function onClick(e) {
    var t = e.target.closest ? e.target.closest("[data-cc]") : null;
    if (!t) return;
    var act = t.getAttribute("data-cc");
    if (act === "open") { e.preventDefault(); openModal(); }
    else if (act === "close") { closeModal(); }
    else if (act === "accept") { choose(true, "accept_all"); }
    else if (act === "reject") { choose(false, "reject_all"); }
    else if (act === "save") { choose(!!(box && box.checked), "granular"); }
  }

  function choose(analytics, method) {
    var rec = write(analytics, method);
    if (box) box.checked = !!analytics;
    bar.hidden = true;
    closeModal();
    showRecord(rec);
    apply(rec, true);
  }

  function openModal() {
    lastFocus = document.activeElement;
    ov.hidden = false;
    var f = ov.querySelector("button, input");
    if (f) f.focus();
  }

  function closeModal() {
    if (ov.hidden) return;
    ov.hidden = true;
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  function showRecord(rec) {
    var el = document.getElementById("cc-rec");
    if (!el || !rec) return;
    var d = new Date(rec.ts).toLocaleDateString("en-GB", {
      day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit"
    });
    el.textContent = "Your choice: " + d + " \u00b7 policy v" + rec.v + " \u00b7 analytics " +
      (rec.analytics ? "on" : "off");
    el.hidden = false;
  }

  /* ---------- start ---------- */

  function start() {
    mount();
    var rec = read();
    if (!rec) { bar.hidden = false; return; }
    if (box) box.checked = !!rec.analytics;
    showRecord(rec);
    apply(rec, false);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
})();
