/* fac16 consent
   Storage and access technologies. Nothing non-exempt is set until the visitor
   turns it on. Built to the ICO guidance on storage and access technologies
   (finalised 29 April 2026) and PECR reg 6 as amended by the DUA Act 2025.
   Published by Closing Foundry Ltd. */
(function () {
  "use strict";

  var VERSION = "2.0";
  var KEY = "cc_consent";
  var MAX_AGE_DAYS = 180;            /* ICO: six months is a suitable interval */
  var CLARITY_ID = "y3e5xpqs63";
  var GA_ID = "G-ZZZ07MC1P4";
  var SIG_KEY = "fac16sig";          /* home page animation, appearance exception */
  var PRIVACY = "/privacy/";
  var CONTACT = "/contact/";

  /* ---------- storage ---------- */

  function read() {
    try {
      var rec = JSON.parse(window.localStorage.getItem(KEY));
      if (!rec || rec.v !== VERSION) return null;
      if (!rec.ts || Date.now() - rec.ts > MAX_AGE_DAYS * 864e5) return null;
      return rec;
    } catch (e) { return null; }
  }

  function write(prefs, method) {
    var rec = {
      v: VERSION, ts: Date.now(), method: method, necessary: true,
      clarity: !!prefs.clarity, ga: !!prefs.ga,
      appearance: prefs.appearance !== false
    };
    try { window.localStorage.setItem(KEY, JSON.stringify(rec)); } catch (e) {}
    return rec;
  }

  /* ---------- tags ---------- */

  var clarityOn = false, gaOn = false;

  function inject(src) {
    var t = document.createElement("script");
    t.async = true;
    t.src = src;
    var first = document.getElementsByTagName("script")[0];
    if (first && first.parentNode) first.parentNode.insertBefore(t, first);
    else (document.head || document.documentElement).appendChild(t);
  }

  function loadClarity() {
    if (clarityOn) return;
    clarityOn = true;
    window.clarity = window.clarity || function () {
      (window.clarity.q = window.clarity.q || []).push(arguments);
    };
    inject("https://www.clarity.ms/tag/" + CLARITY_ID);
  }

  function loadGA() {
    if (gaOn) return;
    gaOn = true;
    inject("https://www.googletagmanager.com/gtag/js?id=" + GA_ID);
    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
    window.gtag("js", new Date());
    window.gtag("config", GA_ID);
  }

  function drop(names) {
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
    var reload = false;

    if (rec.clarity) loadClarity();
    else {
      drop(["_clck", "_clsk", "CLID", "MUID", "ANONCHK", "SM", "MR"]);
      if (viaChoice && window.clarity) reload = true;
    }

    if (rec.ga) loadGA();
    else {
      drop(["_ga", "_ga_" + GA_ID.replace("G-", ""), "_gid", "_gat"]);
      if (viaChoice && window.dataLayer) reload = true;
    }

    if (!rec.appearance) {
      try { window.sessionStorage.removeItem(SIG_KEY); } catch (e) {}
    }

    if (reload) location.reload();
  }

  /* ---------- styles ---------- */

  var CSS = [
    '#cc-bar,#cc-ov{font-family:var(--body,system-ui,sans-serif)}',
    '#cc-bar{position:fixed;left:20px;bottom:20px;z-index:80;width:min(440px,calc(100vw - 40px));',
    'background:var(--paper,#fff);color:var(--ink,#0E1B2C);border:1px solid var(--ink,#0E1B2C);border-radius:3px}',
    '#cc-bar[hidden],#cc-ov[hidden],#cc-foot-btn[hidden]{display:none}',
    '.cc-pad{padding:18px 20px 16px}',
    '.cc-k{font-family:var(--mono,ui-monospace,monospace);font-size:11px;letter-spacing:.13em;text-transform:uppercase;color:var(--mid,#5F6C85);margin:0 0 8px}',
    '.cc-p{margin:0;font-size:14px;line-height:1.6;color:var(--ink-soft,#33415C)}',
    '.cc-p a{color:var(--mark,#0B4ED6)}',
    '.cc-row{display:flex;border-top:1px solid var(--rule,#E2E7F0)}',
    '.cc-b{flex:1;padding:12px 8px;background:var(--paper,#fff);color:var(--ink,#0E1B2C);border:0;',
    'border-right:1px solid var(--rule,#E2E7F0);font-family:inherit;font-size:13px;font-weight:600;line-height:1.4;cursor:pointer;border-radius:0}',
    '.cc-b:last-child{border-right:0}',
    '.cc-b:hover{background:var(--paper-alt,#F4F6FA)}',
    '#cc-ov{position:fixed;inset:0;z-index:90;background:rgba(14,27,44,.55);display:flex;align-items:center;justify-content:center;padding:16px}',
    '#cc-modal{background:var(--paper,#fff);color:var(--ink,#0E1B2C);border:1px solid var(--rule,#E2E7F0);border-radius:3px;',
    'width:100%;max-width:640px;max-height:88vh;display:flex;flex-direction:column}',
    '.cc-head{display:flex;align-items:center;justify-content:space-between;gap:16px;padding:18px 22px;border-bottom:1px solid var(--rule,#E2E7F0)}',
    '.cc-h{margin:0;font-family:var(--display,system-ui,sans-serif);font-size:20px;font-weight:700;letter-spacing:-.022em}',
    '.cc-x{background:none;border:0;color:var(--mid,#5F6C85);font-size:18px;line-height:1;cursor:pointer;padding:4px 6px;border-radius:3px}',
    '.cc-x:hover{color:var(--ink,#0E1B2C)}',
    '.cc-body{padding:18px 22px;overflow-y:auto;flex:1}',
    '.cc-lead{margin:0 0 4px;font-size:13px;line-height:1.6;color:var(--ink-soft,#33415C)}',
    '.cc-lead a{color:var(--mark,#0B4ED6)}',
    '.cc-cat{border-top:1px solid var(--rule,#E2E7F0);padding:14px 0}',
    '.cc-cat:last-of-type{border-bottom:1px solid var(--rule,#E2E7F0)}',
    '.cc-cn{font-size:15px;font-weight:600;margin:0 0 2px}',
    '.cc-note{margin:0;font-size:12px;line-height:1.6;color:var(--mid,#5F6C85)}',
    '.cc-item{display:flex;align-items:flex-start;justify-content:space-between;gap:16px;padding:12px 0 0}',
    '.cc-item + .cc-item{border-top:1px solid var(--rule,#E2E7F0);margin-top:12px}',
    '.cc-who{font-size:14px;font-weight:600;margin:0 0 4px}',
    '.cc-what{margin:0;font-size:13px;line-height:1.6;color:var(--ink-soft,#33415C)}',
    '.cc-tech{margin:6px 0 0;font-family:var(--mono,ui-monospace,monospace);font-size:11px;line-height:1.7;color:var(--mid,#5F6C85)}',
    '.cc-sw{display:inline-flex;align-items:center;gap:8px;cursor:pointer;flex-shrink:0;padding-top:2px;',
    'font-family:var(--mono,ui-monospace,monospace);font-size:11px;letter-spacing:.13em;text-transform:uppercase;color:var(--mid,#5F6C85);white-space:nowrap}',
    '.cc-sw input{width:16px;height:16px;margin:0;accent-color:var(--mark,#0B4ED6)}',
    '.cc-fixed{font-family:var(--mono,ui-monospace,monospace);font-size:11px;letter-spacing:.13em;text-transform:uppercase;color:var(--mid,#5F6C85);white-space:nowrap;flex-shrink:0;padding-top:2px}',
    '.cc-rec{margin-top:16px;padding:11px 13px;background:var(--paper-alt,#F4F6FA);border:1px solid var(--rule,#E2E7F0);border-radius:3px;',
    'font-family:var(--mono,ui-monospace,monospace);font-size:11px;line-height:1.7;color:var(--mid,#5F6C85);white-space:pre-line}',
    '#cc-foot-btn{background:none;border:0;padding:0;color:inherit;font:inherit;text-decoration:underline;text-underline-offset:2px;cursor:pointer}',
    '@media(max-width:640px){#cc-bar{left:12px;right:12px;bottom:12px;width:auto}',
    '.cc-row{flex-wrap:wrap}.cc-b{flex:1 0 100%;border-right:0;border-bottom:1px solid var(--rule,#E2E7F0)}.cc-b:last-child{border-bottom:0}',
    '.cc-item{flex-direction:column;gap:8px}}'
  ].join("");

  /* ---------- markup ---------- */

  var BAR =
    '<div class="cc-pad">' +
      '<p class="cc-k">Cookies</p>' +
      '<p class="cc-p">Two third parties measure how this site is used. Microsoft Clarity records mouse movement and clicks. Google Analytics counts visits and pages. Neither runs unless you turn it on, and you can turn on one without the other. <a href="' + PRIVACY + '">Privacy</a>.</p>' +
    '</div>' +
    '<div class="cc-row">' +
      '<button type="button" class="cc-b" data-cc="reject">Reject all</button>' +
      '<button type="button" class="cc-b" data-cc="open">Choose</button>' +
      '<button type="button" class="cc-b" data-cc="accept">Accept all</button>' +
    '</div>';

  var MODAL =
    '<div id="cc-modal" role="dialog" aria-modal="true" aria-labelledby="cc-title">' +
      '<div class="cc-head">' +
        '<h2 class="cc-h" id="cc-title">Cookie settings</h2>' +
        '<button type="button" class="cc-x" data-cc="close" aria-label="Close">&#10005;</button>' +
      '</div>' +
      '<div class="cc-body">' +
        '<p class="cc-lead">Measurement is off until you turn it on. Turning something off stops it and clears what this site can clear. We ask again after six months. <a href="' + PRIVACY + '">Privacy</a>.</p>' +

        '<div class="cc-cat">' +
          '<p class="cc-cn">Measurement</p>' +
          '<p class="cc-note">Both send data to companies outside the UK. Neither receives assessment answers, scores or results.</p>' +
          '<div class="cc-item">' +
            '<div>' +
              '<p class="cc-who">Microsoft Clarity</p>' +
              '<p class="cc-what">Records mouse movement, clicks and scrolling so we can see where the site is confusing. Text typed into form fields is masked before it leaves your browser. Microsoft Corporation is the recipient.</p>' +
              '<p class="cc-tech">_clck, 1 year &middot; _clsk, 1 day &middot; CLID and related, set by Microsoft on clarity.ms</p>' +
            '</div>' +
            '<label class="cc-sw"><input type="checkbox" id="cc-clarity"> On</label>' +
          '</div>' +
          '<div class="cc-item">' +
            '<div>' +
              '<p class="cc-who">Google Analytics</p>' +
              '<p class="cc-what">Counts visits, tells a returning visit from a new one, and shows which pages are read and where people arrive from. Google LLC is the recipient.</p>' +
              '<p class="cc-tech">_ga, 2 years &middot; _ga_ZZZ07MC1P4, 2 years &middot; _gid, 1 day</p>' +
            '</div>' +
            '<label class="cc-sw"><input type="checkbox" id="cc-ga"> On</label>' +
          '</div>' +
        '</div>' +

        '<div class="cc-cat">' +
          '<div class="cc-item" style="padding-top:0">' +
            '<div>' +
              '<p class="cc-cn">Appearance</p>' +
              '<p class="cc-what">Records that the home page animation has already played so it does not repeat. Nothing leaves your browser and it is cleared when you close the tab. This does not need consent under PECR, so it is on by default. Turn it off to object, and the animation will play each time.</p>' +
              '<p class="cc-tech">fac16sig, session storage, this tab only</p>' +
            '</div>' +
            '<label class="cc-sw"><input type="checkbox" id="cc-appearance" checked> On</label>' +
          '</div>' +
        '</div>' +

        '<div class="cc-cat">' +
          '<div class="cc-item" style="padding-top:0">' +
            '<div>' +
              '<p class="cc-cn">Necessary</p>' +
              '<p class="cc-what">Stores the choice you make here, so we do not ask again and so your choice is honoured on every page. Without it we cannot act on a refusal.</p>' +
              '<p class="cc-tech">cc_consent, local storage, 6 months</p>' +
            '</div>' +
            '<span class="cc-fixed">Always on</span>' +
          '</div>' +
        '</div>' +

        '<p class="cc-lead" style="margin-top:16px">Turning something off stops further collection. To ask Microsoft or Google to delete what they already hold, <a href="' + CONTACT + '">contact us</a> and we will pass the request on.</p>' +
        '<div class="cc-rec" id="cc-rec" hidden></div>' +
      '</div>' +
      '<div class="cc-row">' +
        '<button type="button" class="cc-b" data-cc="reject">Reject all</button>' +
        '<button type="button" class="cc-b" data-cc="save">Save</button>' +
        '<button type="button" class="cc-b" data-cc="accept">Accept all</button>' +
      '</div>' +
    '</div>';

  /* ---------- ui ---------- */

  var bar, ov, cbClarity, cbGA, cbAppearance, lastFocus;

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
    cbClarity = document.getElementById("cc-clarity");
    cbGA = document.getElementById("cc-ga");
    cbAppearance = document.getElementById("cc-appearance");

    document.addEventListener("click", onClick);
    document.addEventListener("keydown", onKey);
    ov.addEventListener("click", function (e) { if (e.target === ov) closeModal(); });

    addFooterLink();
  }

  function addFooterLink() {
    var host = document.querySelector("footer .foot-bottom") ||
               document.querySelector("footer .wrap") ||
               document.querySelector("footer");
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
    else if (act === "close") closeModal();
    else if (act === "accept") choose({ clarity: true, ga: true, appearance: true }, "accept_all");
    else if (act === "reject") choose({ clarity: false, ga: false, appearance: false }, "reject_all");
    else if (act === "save") choose({
      clarity: !!(cbClarity && cbClarity.checked),
      ga: !!(cbGA && cbGA.checked),
      appearance: !cbAppearance || cbAppearance.checked
    }, "granular");
  }

  function onKey(e) {
    if (ov.hidden) return;
    if (e.key === "Escape") { closeModal(); return; }
    if (e.key !== "Tab") return;
    var f = ov.querySelectorAll("button, input, a[href]");
    if (!f.length) return;
    var first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }

  function setToggles(rec) {
    if (cbClarity) cbClarity.checked = !!rec.clarity;
    if (cbGA) cbGA.checked = !!rec.ga;
    if (cbAppearance) cbAppearance.checked = rec.appearance !== false;
  }

  function choose(prefs, method) {
    var rec = write(prefs, method);
    setToggles(rec);
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
    var until = new Date(rec.ts + MAX_AGE_DAYS * 864e5).toLocaleDateString("en-GB", {
      day: "2-digit", month: "short", year: "numeric"
    });
    el.textContent =
      "Your choice, recorded " + d + "\n" +
      "Policy v" + rec.v + " \u00b7 " + rec.method.replace("_", " ") + "\n" +
      "Clarity " + (rec.clarity ? "on" : "off") +
      " \u00b7 Analytics " + (rec.ga ? "on" : "off") +
      " \u00b7 Appearance " + (rec.appearance ? "on" : "off") + "\n" +
      "We ask again after " + until;
    el.hidden = false;
  }

  /* ---------- start ---------- */

  function start() {
    mount();
    var rec = read();
    if (!rec) { bar.hidden = false; return; }
    setToggles(rec);
    showRecord(rec);
    apply(rec, false);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
})();
