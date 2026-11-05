/* Elite Edge outreach demo. Static: no backend, no real AI, no real email. State lives in localStorage. */
'use strict';
var KEY = 'ee_demo_v1';
var ICONS = (function () {
  var C = 'M128 24a104 104 0 1 0 0 208a104 104 0 1 0 0-208Z';
  return {
    house: ['M40 216V112L128 40l88 72v104H152v-64h-48v64Z'], approve: ['M56 40h144a16 16 0 0 1 16 16v144a16 16 0 0 1-16 16H56a16 16 0 0 1-16-16V56a16 16 0 0 1 16-16Z', 'M88 132l28 28 56-64'],
    chat: ['M48 48h160a16 16 0 0 1 16 16v112a16 16 0 0 1-16 16H104l-48 40v-40h-8a16 16 0 0 1-16-16V64a16 16 0 0 1 16-16Z'],
    users: ['M96 120a40 40 0 1 0 0-80a40 40 0 1 0 0 80Z', 'M24 208c10-40 40-64 72-64s62 24 72 64Z', 'M168 44a38 38 0 0 1 0 76', 'M192 148c24 8 38 30 44 60'],
    pipeline: ['M48 48h40v160H48Z', 'M108 48h40v112h-40Z', 'M168 48h40v72h-40Z'],
    gear: ['M128 88a40 40 0 1 0 0 80a40 40 0 1 0 0-80Z', 'M128 24v28M128 204v28M24 128h28M204 128h28', 'M54 54l20 20M182 182l20 20M54 202l20-20M182 74l20-20'],
    signout: ['M112 40H56a16 16 0 0 0-16 16v144a16 16 0 0 0 16 16h56', 'M104 128h112', 'M176 88l40 40-40 40'],
    sidebar: ['M48 48h160a8 8 0 0 1 8 8v144a8 8 0 0 1-8 8H48a8 8 0 0 1-8-8V56a8 8 0 0 1 8-8Z', 'M96 48v160'],
    search: ['M112 40a72 72 0 1 0 0 144a72 72 0 1 0 0-144Z', 'M163 163l53 53'], plus: ['M40 128h176', 'M128 40v176'], x: ['M200 56 56 200', 'M56 56l144 144'],
    caretDown: ['M208 96l-80 80-80-80'], caretLeft: ['M160 208l-80-80 80-80'], check: ['M40 144l56 56L216 72'], checkCircle: [C, 'M88 136l28 28 56-64'],
    warningCircle: [C, 'M128 80v56', 'M128 172v2'], info: [C, 'M128 120v56', 'M128 84v2'], external: ['M216 104V40h-64', 'M216 40l-88 88', 'M184 144v56a8 8 0 0 1-8 8H56a8 8 0 0 1-8-8V80a8 8 0 0 1 8-8h56'],
    sparkle: ['M128 32l20 76 76 20-76 20-20 76-20-76-76-20 76-20Z'], pause: [C, 'M104 96v64', 'M152 96v64'], play: [C, 'M108 88l60 40-60 40Z'],
    trash: ['M216 56H40', 'M104 104v64M152 104v64', 'M200 56v144a8 8 0 0 1-8 8H64a8 8 0 0 1-8-8V56', 'M168 56V40a16 16 0 0 0-16-16h-48a16 16 0 0 0-16 16v16'],
    send: ['M224 32 32 104l80 32 32 80Z', 'M112 136l112-104'], pencil: ['M160 48l48 48-120 120H40v-48Z', 'M136 72l48 48'],
    eye: ['M24 128s40-72 104-72 104 72 104 72-40 72-104 72S24 128 24 128Z', 'M128 96a32 32 0 1 0 0 64a32 32 0 1 0 0-64Z'], upload: ['M128 160V40', 'M80 88l48-48 48 48', 'M40 168v40h176v-40'],
    userPlus: ['M104 120a40 40 0 1 0 0-80a40 40 0 1 0 0 80Z', 'M32 208c10-40 40-64 72-64s62 24 72 64', 'M200 96v64', 'M168 128h64'], spinner: ['M128 32a96 96 0 1 0 96 96'],
    refresh: ['M200 72a88 88 0 1 0 16 72', 'M208 32v48h-48'], compass: [C, 'M168 88l-24 56-56 24 24-56Z']
  };
})();
var FILL = { house: [0], chat: [0], users: [0, 1], pipeline: [0, 1, 2], gear: [0], approve: [0], compass: [] };

function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
function icon(name, size, fill) {
  var s = size || 16, paths = ICONS[name] || [], f = fill && FILL[name] || [];
  return '<svg width="' + s + '" height="' + s + '" viewBox="0 0 256 256" fill="none" stroke="currentColor" stroke-width="16" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false" style="display:block;flex:none"' + (name === 'spinner' ? ' class="spin"' : '') + '>' +
    paths.map(function (d, i) {
      var filled = f.indexOf(i) >= 0;
      var knock = fill && name === 'approve' && i === 1;
      return '<path d="' + d + '" fill="' + (filled ? 'currentColor' : 'none') + '"' + (knock ? ' style="stroke:var(--color-accent-soft)"' : '') + '></path>';
    }).join('') + '</svg>';
}
function fmt(n) { return Number(n).toLocaleString('en-US'); }
function ini(n) { return String(n || '?').split(' ').filter(Boolean).map(function (w) { return w[0]; }).join('').slice(0, 2).toUpperCase(); }
function av(n) { var s = 0; n = String(n); for (var i = 0; i < n.length; i++) s += n.charCodeAt(i); return 'av-' + (s % 6 + 1); }
function plural(n, one, many) { return n + ' ' + (n === 1 ? one : (many || one + 's')); }
function clone(o) { return JSON.parse(JSON.stringify(o)); }
function emailOk(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v).trim()); }

/* ---------- State ---------- */
function freshState() {
  return { patches: {}, deleted: {}, added: [], batchApproved: false, pulled: {}, decisions: {}, extraFlag: [], mailEdits: {}, heldDone: {}, replyDone: {}, replyType: {}, stopped: false, side: true, signedOut: false, role: 'Admin',
    rules: { days: { Mon: true, Tue: true, Wed: true, Thu: true, Fri: false, Sat: false, Sun: false }, naFrom: '09:03', naTo: '17:00', oFrom: '09:03', oTo: '11:00', tz: 'ct', fu: '3', gapA: 25, gapB: 60, c1: 80, c2: 100, c3: 150, footer: FOOTER, auto: false },
    spend: { checks: 25, ai: 10, find: '' }, optExtra: [], team: [], log: [], templates: clone(TEMPLATES), imported: false };
}
var S;
try { S = JSON.parse(localStorage.getItem(KEY)) || freshState(); } catch (e) { S = freshState(); }
var fresh = freshState();
Object.keys(fresh).forEach(function (k) { if (S[k] === undefined) S[k] = fresh[k]; });
function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { /* private mode: the demo still runs for this visit */ } }

var LEADS = buildLeads(), BY = {};
LEADS.forEach(function (l) { BY[l.id] = l; });
S.added.forEach(function (l) { BY[l.id] = l; LEADS.unshift(l); });
Object.keys(S.patches).forEach(function (id) { if (BY[id]) Object.assign(BY[id], S.patches[id]); });
var STAGE0 = {};
function alive(l) { return !S.deleted[l.id]; }
function updateLead(id, p) {
  var l = BY[id]; if (!l) return;
  Object.assign(l, p);
  var a = S.added.filter(function (x) { return x.id === id; })[0];
  if (a) Object.assign(a, p); else S.patches[id] = Object.assign(S.patches[id] || {}, p);
  save();
}
function addLead(l) { S.added.unshift(l); BY[l.id] = l; LEADS.unshift(l); save(); }
function logIt(what, who) { S.log.unshift({ when: 'Today ' + nowText(), who: who || 'Kamal', what: what }); save(); }
function nowText() { return new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }); }
function isMember() { return S.role === 'Member'; }

var ui = { page: {}, filters: { q: '', status: '', niche: '', sort: 'new' }, sel: {}, modal: null, openSel: null, activeOpt: 0, menu: null, idx: 0, approveQ: '', approveInbox: 'all', seed: 0, aiNote: '', aiPrev: null,
  repQ: '', repType: '', repNeeds: false, pipeWho: 'Everyone', pipeSel: 'Replied', pipeQ: '', profTab: 'emails', looking: false, find: { kind: 'brand', niche: '', loading: false, results: null, picked: {}, showHave: false }, showAll: false, tpl: { kind: 'brand', step: 0, err: '' }, optQ: '', sendCheck: 'Chicago', imp: 1, signin: { step: 1, email: 'kamal@eliteedge.example', code: '', tried: false }, rulesErr: '', animKey: '' };

/* ---------- Handlers ---------- */
var H = [], T = [];
function on(fn) { H.push(fn); return H.length - 1; }
function act(fn) { return 'data-on="' + on(fn) + '"'; }
function change(fn) { return 'data-change="' + on(fn) + '"'; }
function input(fn) { return 'data-input="' + on(fn) + '"'; }
function submit(fn) { return 'data-submit="' + on(fn) + '"'; }

var toastTimer;
function toast(msg, kind, undo) {
  kind = kind || 'good';
  T = [];
  var el = document.getElementById('toast-root');
  el.innerHTML = '<div class="toast toast-' + kind + '" role="status"><span class="ico">' + icon(kind === 'bad' ? 'warningCircle' : kind === 'info' ? 'info' : 'checkCircle', 20) + '</span><span style="flex:1">' + esc(msg) + '</span>' +
    (undo ? '<button class="btn btn-link" type="button" data-toast="undo">Undo</button>' : '') +
    '<button class="icon-btn" type="button" aria-label="Close" data-toast="close">' + icon('x') + '</button></div>';
  T.undo = undo;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(function () { el.innerHTML = ''; }, undo ? 9000 : 5000);
}
function clearToast() { document.getElementById('toast-root').innerHTML = ''; }
function sampleNote(msg) { toast(msg, 'info'); }

/* ---------- Shared pieces ---------- */
function btn(label, opt) {
  opt = opt || {};
  var cls = 'btn ' + (opt.cls || 'btn-secondary') + (opt.sm ? ' btn-sm' : '');
  var ic = opt.icon ? icon(opt.icon, 16) : '';
  if (opt.href) return '<a class="' + cls + '" href="' + esc(opt.href) + '">' + ic + esc(label) + '</a>';
  return '<button class="' + cls + '" type="' + (opt.type || 'button') + '"' + (opt.on ? ' ' + act(opt.on) : '') + (opt.disabled ? ' disabled' : '') + (opt.id ? ' id="' + opt.id + '"' : '') + (opt.autofocus ? ' data-autofocus' : '') + '>' + ic + esc(label) + (opt.kbd ? ' <span class="kbd">' + opt.kbd + '</span>' : '') + '</button>';
}
function primary(label, opt) { return btn(label, Object.assign({ cls: 'btn-primary' }, opt)); }
function link(label, opt) { return btn(label, Object.assign({ cls: 'btn-link' }, opt)); }
function badge(word, cls) { return '<span class="badge ' + cls + '">' + esc(word) + '</span>'; }
function avatar(name, lg) { return '<span class="avatar ' + (lg ? 'avatar-lg ' : '') + av(name) + '" aria-hidden="true">' + esc(ini(name)) + '</span>'; }
function select(o) {
  var id = o.id, open = ui.openSel === id, cur = (o.options || []).filter(function (x) { return x.value === o.value; })[0];
  var listId = id + '-list';
  var h = '<div class="sel' + (o.compact ? ' sel-compact' : '') + '" style="width:' + (o.width || '180px') + '">' +
    '<button class="input sel-btn" id="' + id + '" type="button" aria-haspopup="listbox" aria-expanded="' + open + '" aria-label="' + esc(o.label) + (cur ? ': ' + esc(cur.label) : '') + '"' + (o.disabled ? ' disabled' : ' ' + act(function () { ui.openSel = open ? null : id; ui.activeOpt = Math.max(0, (o.options || []).indexOf(cur)); render(); })) + ' data-sel="' + id + '">' +
    '<span class="val' + (cur ? '' : ' placeholder') + '">' + esc(cur ? cur.label : (o.placeholder || 'Choose')) + '</span><span class="caret">' + icon('caretDown') + '</span></button>';
  if (o.clearable && cur && !o.disabled) h += '<button class="sel-clear" type="button" aria-label="Clear ' + esc(o.label) + '" ' + act(function () { ui.openSel = null; o.pick(''); }) + '>' + icon('x', 14) + '</button>';
  if (open) {
    h += '<ul class="sel-list" id="' + listId + '" role="listbox" aria-label="' + esc(o.label) + '" data-anchor="' + id + '">' + o.options.map(function (x, i) {
      return '<li role="presentation"><button class="sel-opt' + (i === ui.activeOpt ? ' active' : '') + '" type="button" role="option" aria-selected="' + (x.value === o.value) + '" ' + act(function () { ui.openSel = null; o.pick(x.value); }) + '>' + esc(x.label) + (x.value === o.value ? icon('check', 16) : '') + '</button></li>';
    }).join('') + '</ul>';
  }
  return h + '</div>';
}
function tabs(list, label) {
  return '<div class="tabs" role="tablist" aria-label="' + esc(label) + '">' + list.map(function (t) {
    return '<button class="tab" role="tab" type="button" aria-selected="' + !!t.sel + '" ' + (t.href ? act(function () { go(t.href); }) : act(t.pick)) + '>' + esc(t.label) + (t.count != null && t.count !== '' ? ' <span class="tab-count">' + esc(t.count) + '</span>' : '') + '</button>';
  }).join('') + '</div>';
}
function seg(list, label) {
  return '<div class="seg" role="group" aria-label="' + esc(label) + '">' + list.map(function (s) { return '<button type="button" aria-pressed="' + !!s.sel + '" ' + act(s.pick) + '>' + esc(s.label) + '</button>'; }).join('') + '</div>';
}
function search(id, value, ph, fn) {
  return '<label class="search"><span class="ico">' + icon('search') + '</span><input class="input" id="' + id + '" type="search" aria-label="' + esc(ph) + '" placeholder="' + esc(ph) + '" value="' + esc(value) + '" ' + input(fn) + ' autocomplete="off"></label>';
}
function field(label, id, body, opt) {
  opt = opt || {};
  return '<div class="field"><label class="label" for="' + id + '">' + esc(label) + (opt.req ? ' <span class="req" aria-hidden="true">*</span>' : '') + '</label>' + body + (opt.err ? '<span class="error-msg" role="alert">' + esc(opt.err) + '</span>' : '') + (opt.hint ? '<span class="hint">' + esc(opt.hint) + '</span>' : '') + '</div>';
}
function inp(id, value, fn, opt) {
  opt = opt || {};
  return '<input class="input' + (opt.err ? ' invalid' : '') + '" id="' + id + '" value="' + esc(value) + '" ' + input(fn) + (opt.type ? ' type="' + opt.type + '"' : '') + (opt.ph ? ' placeholder="' + esc(opt.ph) + '"' : '') + (opt.list ? ' list="' + opt.list + '"' : '') + (opt.err ? ' aria-invalid="true"' : '') + (opt.disabled ? ' disabled' : '') + (opt.autofocus ? ' data-autofocus' : '') + ' autocomplete="off">';
}
function area(id, value, fn, rows, opt) {
  opt = opt || {};
  return '<textarea class="input' + (opt.err ? ' invalid' : '') + '" id="' + id + '" rows="' + rows + '" ' + input(fn) + (opt.disabled ? ' disabled' : '') + '>' + esc(value) + '</textarea>';
}
function paged(key, list, size) {
  size = size || 15;
  var pages = Math.max(1, Math.ceil(list.length / size)), p = Math.min(ui.page[key] || 0, pages - 1);
  return { rows: list.slice(p * size, (p + 1) * size), html: '<div class="pager"><span class="small muted">' + (list.length ? fmt(p * size + 1) + '–' + fmt(Math.min(list.length, (p + 1) * size)) + ' of ' + fmt(list.length) : '0 results') + '</span><div class="row">' +
    btn('Previous', { sm: 1, disabled: p === 0, on: function () { ui.page[key] = p - 1; render(); } }) + btn('Next', { sm: 1, disabled: p >= pages - 1, on: function () { ui.page[key] = p + 1; render(); } }) + '</div></div>' };
}
function mailFoot(creator) { return '<div class="mail-foot">' + esc(creator ? SIG_CREATOR : SIG_BRAND) + '<br>' + esc(S.rules.footer).replace(/\n/g, '<br>') + '</div>'; }
function overlay(key, html) {
  var still = ui.animKey === key; ui.animKey = key;
  return '<div class="overlay' + (still ? ' still' : '') + '" ' + act(function (e) { if (e.target.classList.contains('overlay')) closeModal(); }) + ' data-overlay>' + html + '</div>';
}
function dlgHead(title, sub, id) {
  return '<div class="dlg-head"><div><h2 class="dlg-title" id="' + id + '">' + esc(title) + '</h2>' + (sub ? '<p class="dlg-sub">' + esc(sub) + '</p>' : '') + '</div><button class="icon-btn" type="button" aria-label="Close" ' + act(closeModal) + '>' + icon('x') + '</button></div>';
}
function openModal(m) { ui.lastFocus = document.activeElement && document.activeElement.getAttribute('data-on'); ui.lastFocusId = document.activeElement && document.activeElement.id; ui.modal = m; ui.openSel = null; ui.menu = null; render(); }
function closeModal() { ui.modal = null; ui.animKey = ''; ui.openSel = null; ui.menu = null; render(); var el = ui.lastFocusId && document.getElementById(ui.lastFocusId); if (!el && ui.lastFocus != null) el = document.querySelector('[data-on="' + ui.lastFocus + '"]'); if (el) el.focus(); }
function confirmBox(title, text, label, fn, danger) {
  openModal({ type: 'confirm', title: title, text: text, label: label, fn: fn, danger: danger !== false });
}

/* ---------- Sequence logic ---------- */
function addSendDays(date, days) {
  var d = new Date(date); d.setDate(d.getDate() + days);
  while ([0, 5, 6].indexOf(d.getDay()) >= 0) d.setDate(d.getDate() + 1);
  return d;
}
function dayText(d) {
  if (d.getTime() === TODAY.getTime()) return 'Today';
  return d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' }).replace(',', '');
}
function fill(t, l) {
  var first = (l.contact || l.name).split(' ')[0];
  return t.replace(/\{first\}/g, first).replace(/\{company\}/g, l.name).replace(/\{niche\}/g, l.niche.toLowerCase());
}
function stepsOf(l) {
  var seq = l.seq || { paused: {}, deleted: {}, edits: {} };
  var tpl = S.templates[l.kind], maxFu = Number(S.rules.fu);
  var start = l.cd == null ? addSendDays(TODAY, 4) : (function () { var d = new Date(TODAY); d.setDate(d.getDate() - l.cd); return d; })();
  var stopped = ['Replied', 'Talking', 'Shortlist sent', 'Won', 'Not now'].indexOf(l.stage) >= 0;
  var date = start;
  return tpl.slice(0, maxFu + 1).map(function (t, i) {
    if (i > 0) date = addSendDays(date, 3);
    var isSent = l.cd != null && date.getTime() < TODAY.getTime();
    var del = !!seq.deleted[i], paused = !isSent && !del && (!!seq.paused[i] || !!l.allPaused);
    var e = seq.edits[i] || {};
    var word, cls;
    if (isSent) { word = 'Sent'; cls = 'b-green'; } else if (del) { word = 'Deleted'; cls = 'b-neutral'; } else if (stopped || l.st === 'never') { word = 'Stopped'; cls = 'b-neutral'; } else if (paused) { word = 'Paused'; cls = 'b-neutral'; } else if (l.cd == null && i === 0) { word = 'Waiting for approval'; cls = 'b-gold'; } else { word = 'Scheduled'; cls = 'b-blue'; }
    return { i: i, label: t.label, subject: e.subject != null ? e.subject : fill(t.subject, l), body: e.body != null ? e.body : fill(t.body, l), when: isSent ? 'Sent ' + dayText(date) : (stopped || l.st === 'never' || del) ? '—' : dayText(date) + ', about 10 AM their time', sent: isSent, del: del, paused: paused, stopped: stopped || l.st === 'never', word: word, cls: cls, short: dayText(date) };
  });
}
function nextStep(l) { return stepsOf(l).filter(function (s) { return !s.sent && !s.del && !s.paused && !s.stopped; })[0]; }
function setSeq(l, fn) { var s = clone(l.seq || { paused: {}, deleted: {}, edits: {} }); fn(s); updateLead(l.id, { seq: s }); }
function statusOf(l) { return STATUS[l.st] || STATUS.new; }

/* ---------- Approve data ---------- */
function flaggedList() { return FLAGGED.concat(S.extraFlag); }
function undecided() { return flaggedList().filter(function (e) { return !S.decisions[e.id]; }); }
function readyCount() { return 236 - Object.keys(S.pulled).length; }
function mailOf(e) { var x = S.mailEdits[e.id] || {}; return { subject: x.subject != null ? x.subject : e.subject, body: x.body != null ? x.body : e.body }; }
function heldDefs() {
  return [
    { id: 'h1', lead: 'shieldpath', who: 'Noah Berg', company: 'Shieldpath', reason: 'noah@shieldpath.example is not a real address.', next: 'We found Sofia Lindqvist, Head of Growth. Her address is real.', fixLabel: 'Use Sofia instead', doneWord: 'Fixed', doneNext: 'Sofia’s email moved to Need a look.', run: useSofia },
    { id: 'h2', lead: 'jonah', who: 'Jonah Reyes', company: 'Creator · Instagram', reason: 'No working email.', next: 'We checked 4 addresses. LinkedIn is the best way to reach him.', fixLabel: 'Message on LinkedIn', doneWord: 'On LinkedIn', doneNext: 'Marked to message on LinkedIn. No email will send.', run: useLinkedIn },
    { id: 'h3', lead: 'fundrail', who: 'Marta Silva', company: 'Fundrail', reason: 'Someone else at Fundrail is already being contacted.', next: 'One person per company at a time. Tom Achterberg goes first.', fixLabel: 'Review Tom’s email', run: function () { openReview('f2'); } },
    { id: 'h4', lead: 'quietnet', who: 'Quietnet', company: 'Opted out on 12 October', reason: 'They opted out.', next: 'They can never be emailed. This can’t be changed here.', fixLabel: 'See opt-out list', never: true, run: function () { go('#/settings/optout'); } }
  ];
}
function heldLeft() { return heldDefs().filter(function (x) { return !S.heldDone[x.id]; }).length; }
function useSofia() {
  if (S.heldDone.h1) return;
  S.heldDone.h1 = true; S.extraFlag.push(SOFIA);
  var l = BY.shieldpath;
  updateLead('shieldpath', { contact: 'Sofia Lindqvist', role: 'Head of Growth', email: 'sofia@shieldpath.example', mail: 'real', next: 'Approve first email', others: [{ name: 'Noah Berg', role: 'Partnerships', email: 'noah@shieldpath.example', mail: 'notreal' }] });
  logIt('Replaced Noah with Sofia Lindqvist at Shieldpath.');
  render(); toast('Sofia added to Need a look');
}
function useLinkedIn() {
  S.heldDone.h2 = true;
  updateLead('jonah', { next: 'Message on LinkedIn. No email will send', linkedin: true });
  logIt('Marked Jonah Reyes to message on LinkedIn.');
  render(); toast('Jonah marked for LinkedIn');
}
function openReview(id) { var i = flaggedList().findIndex(function (e) { return e.id === id; }); ui.idx = Math.max(0, i); go('#/approve/look'); }

/* ---------- Router ---------- */
function route() { return (location.hash.replace(/^#\//, '') || 'today').split('/'); }
function go(h) { if (location.hash === h) { render(); return; } location.hash = h; }
window.addEventListener('hashchange', function () { ui.openSel = null; ui.menu = null; ui.modal = null; ui.animKey = ''; ui.profTabFor = null; window.scrollTo(0, 0); render(); });

/* ---------- Sidebar ---------- */
function sidebar(cur) {
  var open = S.side, u = undecided().length + (S.batchApproved ? 0 : 1), r = needReplies().length;
  var items = [['today', 'Today', 'house', '#/today', ''], ['approve', 'Approve', 'approve', '#/approve', undecided().length ? undecided().length : ''], ['replies', 'Replies', 'chat', '#/replies', r || ''], ['people', 'People', 'users', '#/people', ''], ['find', 'Find new', 'compass', '#/find', ''], ['pipeline', 'Pipeline', 'pipeline', '#/pipeline', '']];
  function item(d) {
    var on2 = cur === d[0];
    return '<a class="sb-item" href="' + d[3] + '"' + (on2 ? ' aria-current="page"' : '') + ' aria-label="' + esc(d[1] + (d[4] ? ', ' + d[4] + ' waiting' : '')) + '" title="' + esc(d[1]) + '">' + icon(d[2], 20, on2) + '<span class="sb-label">' + esc(d[1]) + '</span>' + (d[4] ? '<span class="sb-count">' + d[4] + '</span>' : '') + '</a>';
  }
  return '<aside class="sb ' + (open ? 'sb-open' : 'sb-closed') + '" aria-label="Main menu"><div class="sb-top"><button class="icon-btn" type="button" style="width:40px;height:40px" aria-expanded="' + open + '" aria-label="' + (open ? 'Close menu' : 'Open menu') + '" title="' + (open ? 'Close menu' : 'Open menu') + '" ' + act(function () { S.side = !S.side; save(); render(); }) + '>' + icon('sidebar', 20) + '</button><div class="sb-brand">' +
    (open ? '<img class="sb-logo" src="assets/logo.webp" alt="Elite Edge Collective">' : '<img class="sb-mark" src="assets/favicon.png" alt="Elite Edge Collective">') + '</div></div>' +
    '<nav class="sb-nav" aria-label="Main">' + items.map(item).join('') + '</nav><div class="sb-bottom">' + item(['settings', 'Settings', 'gear', '#/settings', '']) +
    '<div class="sb-user" title="Kamal · kamal@eliteedge.example"><span class="avatar av-5" aria-hidden="true">K</span><div class="sb-who"><div class="medium">Kamal</div><div class="small muted">kamal@eliteedge.example</div></div></div>' +
    '<button class="sb-item" type="button" aria-label="Sign out" title="Sign out" ' + act(function () { S.signedOut = true; save(); ui.signin = { step: 1, email: 'kamal@eliteedge.example', code: '', tried: false }; go('#/signin'); }) + '>' + icon('signout', 20) + '<span class="sb-label">Sign out</span></button>' +
    '<div class="sb-sample note11">Sample data. Nothing is really sent. <button type="button" ' + act(function () { confirmBox('Reset the demo?', 'Everything you added, deleted or changed goes back to the start.', 'Reset demo', function () { localStorage.removeItem(KEY); location.hash = '#/today'; location.reload(); }); }) + '>Reset demo</button></div></div></aside>';
}
function shell(cur, body) {
  return '<div class="app">' + sidebar(cur) + '<main class="main"><div class="page">' + body + '</div></main>' + modalView() + '</div>';
}

/* ---------- Today ---------- */
function isApproved() { return S.batchApproved || !!S.rules.auto; }
function needReplies() { return REPLIES.filter(function (r) { return r.needs && !S.replyDone[r.id]; }); }
function viewToday() {
  var und = undecided().length, approved = isApproved(), stopped = S.stopped;
  var health = stopped ? { badge: 'b-red', word: 'Stopped', head: 'Creator emails stopped.', detail: 'Gmail signed the partnerships inbox out at 11:20 AM. 61 creator emails are waiting and nothing is lost. Brand emails are still sending.' } :
    { badge: 'b-green', word: 'Working', head: 'Sending normally.', detail: 'Both inboxes are connected and sending. Next email goes out at 2:31 PM. Last checked 1 minute ago.' };
  var sent = stopped ? 151 : 212, pUsed = stopped ? 31 : 92;
  var needs = [];
  if (!approved) needs.push({ title: 'Approve Monday’s emails', sub: fmt(readyCount()) + ' look normal, ' + und + ' need a look, ' + heldLeft() + ' will not send', right: btn('Review', { sm: 1, href: '#/approve' }) });
  else if (und) needs.push({ title: plural(und, 'email') + ' still need a look', sub: 'Monday’s other emails are approved.', right: btn('Review', { sm: 1, href: '#/approve/look' }) });
  needReplies().forEach(function (r) {
    if (r.id === 'codeharbor') needs.push({ title: 'Codeharbor asked for a shortlist', sub: 'Developer creators with pricing. Matches are ready to pick from.', right: btn('Make shortlist', { sm: 1, on: function () { openShortlist('codeharbor'); } }) });
    if (r.id === 'ana') needs.push({ title: 'Ana Ruiz is open to sponsors', sub: 'Productivity creator, 96k subscribers. Follow ups stopped.', right: btn('Read reply', { sm: 1, href: '#/replies' }) });
    if (r.id === 'fundrail') needs.push({ title: 'Fundrail named a new contact', sub: 'Lena moved teams. Tom Achterberg’s first email waits for your approval.', right: btn('Read reply', { sm: 1, href: '#/replies' }) });
  });
  if (!S.heldDone.h1) needs.push({ title: 'Shieldpath: noah@ is not a real address', sub: 'We found sofia@shieldpath.example, Head of Growth. Her address is real.', right: btn('Use Sofia', { sm: 1, on: useSofia }) });
  var since = ui.showAll ? SINCE : SINCE.slice(0, 3);
  var inboxes = [
    { name: 'kamal@eliteedge.example', role: 'Brand outreach', used: 120, cap: Math.min(150, S.rules.c3), badge: 'b-green', word: 'Working', cls: '', note: 'daily limit 150' },
    { name: 'partnerships@eliteedge.example', role: 'Creator outreach', used: pUsed, cap: Number(S.rules.c2), badge: stopped ? 'b-red' : pUsed >= 90 ? 'b-gold' : 'b-green', word: stopped ? 'Stopped' : pUsed >= 90 ? 'Near limit' : 'Working', cls: stopped ? 'stop' : pUsed >= 90 ? 'near' : '', note: stopped ? 'Gmail signed it out' : 'daily limit rises next week' }
  ];
  return shell('today', '<div class="head"><div><h1 class="title">Today</h1><p class="subtitle">Thursday 5 November · a send day</p></div><div class="actions">' +
    (stopped ? primary('Sign in again', { on: signBackIn }) : !approved ? primary('Approve Monday’s emails', { href: '#/approve', icon: 'approve' }) : '') + '</div></div>' +
    '<section class="card card-body" aria-label="Is it working"><div class="between" style="align-items:flex-start;gap:24px"><div style="flex:1 1 420px;min-width:0">' + badge(health.word, health.badge) + '<p class="hero-line">' + esc(health.head) + '</p><p class="muted" style="margin:4px 0 0">' + esc(health.detail) + '</p></div>' +
    '<div class="figs figs-side"><div><div class="fig-n">' + sent + '</div><div class="fig-l">sent today, of 250</div></div><div><div class="fig-n">' + needReplies().length + '</div><div class="fig-l">replies need you</div></div><div><div class="fig-n">' + heldLeft() + '</div><div class="fig-l">not sent, each with a reason</div></div></div></div></section>' +
    emailStrip(sent) + '<div class="cols"><div class="col-main"><section class="card" aria-labelledby="needs"><div class="card-head"><h2 class="card-title" id="needs">Needs you</h2><span class="small muted">' + (needs.length ? plural(needs.length, 'thing') : 'All clear') + '</span></div>' +
    (needs.length ? '<ul class="list">' + needs.map(function (n) { return '<li><div class="grow"><div class="medium">' + esc(n.title) + '</div><div class="cell-sub">' + esc(n.sub) + '</div></div>' + n.right + '</li>'; }).join('') + '</ul>' : '<div class="empty">Nothing needs you right now. The app keeps sending.</div>') + '</section>' +
    '<section class="card" aria-labelledby="since"><div class="card-head"><h2 class="card-title" id="since">Since your last visit</h2><span class="small muted">Tuesday 3:40 PM · handled by the app</span></div><div class="card-body"><ol class="tl">' +
    since.map(function (e) { return '<li><div class="row">' + badge(e.word, e.badge) + '<span class="tl-when">' + esc(e.when) + '</span></div><div class="tl-what">' + esc(e.what) + '</div></li>'; }).join('') + '</ol>' +
    '<div style="margin:12px 0 0 -8px">' + link(ui.showAll ? 'Show less' : 'Show all ' + SINCE.length, { on: function () { ui.showAll = !ui.showAll; render(); } }) + '</div></div></section></div>' +
    '<div class="col-side"><section class="card" aria-labelledby="inboxes"><div class="card-head"><h2 class="card-title" id="inboxes">Inboxes</h2>' + link('Sending rules', { href: '#/settings/rules' }) + '</div><ul class="list">' +
    inboxes.map(inboxRow).join('') + '</ul></section></div></div>');
}
function dueFollowUps() { return LEADS.filter(function (l) { if (l.stage !== 'Emailing' || !alive(l) || l.allPaused) return false; var n = nextStep(l); return n && n.short === 'Today' && n.i > 0; }).slice(0, 31); }
function emailStrip(sent) {
  var due = dueFollowUps().length, tiles = [
    { n: sent, label: 'sent today', on: function () { openModal({ type: 'batch', kind: 'sent' }); } },
    { n: Math.max(0, 250 - sent), label: 'still going out today', on: function () { openModal({ type: 'batch', kind: 'going' }); } },
    { n: needReplies().length, label: 'need a reply', on: function () { go('#/replies'); } },
    { n: due, label: 'follow ups due today', on: function () { openModal({ type: 'batch', kind: 'followup' }); } },
    { n: WAITING_TOTAL, label: 'waiting for Monday', on: function () { openModal({ type: 'batch', kind: 'waiting' }); } }
  ];
  return '<section class="card" aria-labelledby="todayMail"><div class="card-head"><h2 class="card-title" id="todayMail">Today\u2019s emails</h2><span class="small muted">Click any number to see who</span></div><div class="stages stages-5">' + tiles.map(function (t) { return '<button class="stage" type="button" ' + act(t.on) + '><span class="fig-n">' + fmt(t.n) + '</span><span class="fig-l">' + esc(t.label) + '</span></button>'; }).join('') + '</div></section>';
}
function genFollowUp(l) {
  var first = (l.contact || l.name).split(' ')[0];
  return l.kind === 'brand' ? 'Hi ' + first + ',\n\nStill happy to send a few ' + l.niche.toLowerCase() + ' creators for ' + l.name + '. Would this week work?\n\nKamal' : 'Hi ' + first + ',\n\nA couple of ' + l.niche.toLowerCase() + ' brands are still looking for creators. Want the names?\n\nKamal';
}
function inboxRow(b) {
  return '<li style="display:block"><div class="between" style="align-items:flex-start"><div style="min-width:0"><div class="medium" style="overflow-wrap:anywhere">' + esc(b.name) + '</div><div class="cell-sub">' + esc(b.role) + '</div></div>' + badge(b.word, b.badge) + '</div>' +
    '<div class="meter ' + b.cls + '" style="margin-top:12px" role="meter" aria-valuemin="0" aria-valuemax="' + b.cap + '" aria-valuenow="' + b.used + '" aria-label="' + esc(b.name) + ' sent today"><span style="width:' + Math.round(b.used / b.cap * 100) + '%"></span></div>' +
    '<div class="cell-sub" style="margin-top:6px">' + b.used + ' of ' + b.cap + ' today · ' + esc(b.note) + '</div>' + (b.extra || '') + '</li>';
}
function signBackIn() { S.stopped = false; save(); logIt('Signed the partnerships inbox back in.'); render(); toast('Partnerships inbox signed in. Waiting emails restart now'); }

/* ---------- Approve ---------- */
function viewApprove(tab) {
  tab = tab || 'normal';
  var ready = readyCount(), und = undecided();
  var head = '<div class="head"><div><h1 class="title">Approve</h1><p class="subtitle">Monday 9 November. Nothing sends Friday to Sunday.</p></div>' + (tab === 'normal' ? '<div class="actions">' +
    (S.rules.auto ? badge('Sends on its own', 'b-green') + link('Change this', { href: '#/settings/rules' }) : S.batchApproved ? badge('Approved', 'b-green') + btn('Undo approval', { on: function () { S.batchApproved = false; save(); logIt('Undid approval of Monday’s emails.'); render(); toast('Approval undone'); } }) :
      btn('Send me a test', { icon: 'send', on: function () { toast('Test email sent to kamal@eliteedge.example (sample)'); } }) + primary('Approve ' + ready + ' emails', { icon: 'check', on: function () { openModal({ type: 'approve' }); } })) + '</div>' : '') + '</div>';
  var t = tabs([{ label: 'Look normal', count: ready, sel: tab === 'normal', href: '#/approve' }, { label: 'Need a look', count: und.length, sel: tab === 'look', href: '#/approve/look' }, { label: 'Will not send', count: heldLeft(), sel: tab === 'held', href: '#/approve/held' }], 'Monday’s emails');
  var body = tab === 'look' ? approveLook() : tab === 'held' ? approveHeld() : approveNormal();
  return shell('approve', head + t + body);
}
function approveNormal() {
  var q = ui.approveQ.trim().toLowerCase();
  var rows = POOL.map(function (r, i) { return Object.assign({}, r, { when: 'Mon ' + TIMES[i] }); }).filter(function (r) {
    if (S.pulled[r.name]) return false;
    if (ui.approveInbox !== 'all' && r.inbox !== ui.approveInbox) return false;
    return !q || (r.name + ' ' + r.company).toLowerCase().indexOf(q) >= 0;
  });
  return '<section class="card"><div class="card-head"><div><h2 class="card-title">Look normal</h2><p class="muted" style="margin:2px 0 0">Same template, real address, nothing edited, nothing unusual. Read a few, then approve them together.</p></div>' + btn('Read 5 at random', { sm: 1, icon: 'eye', on: function () { openModal({ type: 'sample' }); } }) + '</div>' +
    '<div class="card-toolbar">' + search('approveQ', ui.approveQ, 'Search by name or company', function (e) { ui.approveQ = e.target.value; render(); }) +
    select({ id: 'approveInbox', width: '200px', label: 'Inbox', value: ui.approveInbox, options: [{ value: 'all', label: 'All inboxes' }, { value: 'brand', label: 'Brand inbox' }, { value: 'partner', label: 'Partnerships' }], pick: function (v) { ui.approveInbox = v || 'all'; render(); } }) +
    '<span class="count">' + (q || ui.approveInbox !== 'all' ? rows.length + ' match' : readyCount() + ' emails') + '</span></div>' +
    (rows.length ? '<div class="table-wrap"><table class="tbl"><thead><tr><th>To</th><th>Inbox</th><th>Subject</th><th>Sends</th><th class="r"><span class="sr">Action</span></th></tr></thead><tbody>' + rows.map(function (r) {
      return '<tr><td><div class="person">' + avatar(r.name) + '<div><a class="name-link" href="#/p/' + r.lead + '">' + esc(r.name) + '</a><div class="cell-sub">' + esc(r.company) + '</div></div></div></td><td class="nowrap">' + (r.inbox === 'brand' ? 'Brand inbox' : 'Partnerships') + '</td><td>' + esc(r.subject) + '</td><td class="nowrap">' + esc(r.when) + '</td><td class="r">' + link('Pull out', { on: function () { pullOut(r); } }) + '</td></tr>';
    }).join('') + '</tbody></table></div><div class="pager"><span class="small muted">Showing a sample of ' + rows.length + '. The real app lists them all.</span></div>' : '<div class="empty">No results. ' + link('Clear search and filters', { on: function () { ui.approveQ = ''; ui.approveInbox = 'all'; render(); } }) + '</div>') + '</section>';
}
function pullOut(s) {
  if (S.pulled[s.name]) return;
  S.pulled[s.name] = true;
  S.extraFlag.push({ id: 'p-' + s.name, lead: s.lead, name: s.name, company: s.company, why: 'Pulled out by you', first: s.name.split(' ')[0], to: s.name + ' · ' + s.company, from: s.inbox === 'brand' ? 'Kamal, brand inbox' : 'Kamal, partnerships inbox', when: 'Mon 9 Nov', creator: s.inbox !== 'brand', flag: 'you pulled this one out of the batch.', subject: s.subject, body: s.body });
  save(); render(); toast('Email moved to Need a look');
}
function curReview() { var l = flaggedList(); if (ui.idx >= l.length) ui.idx = 0; return l[ui.idx]; }
function nextUndecided() { var L2 = flaggedList(); for (var k = 1; k <= L2.length; k++) { var i = (ui.idx + k) % L2.length; if (!S.decisions[L2[i].id]) return i; } return -1; }
function decide(word) {
  var e = curReview(); if (!e || S.decisions[e.id]) { var n0 = nextUndecided(); if (n0 >= 0) ui.idx = n0; render(); return; }
  S.decisions[e.id] = word;
  if (word === 'approved') updateLead(e.lead, { next: 'First email approved for Monday', st: BY[e.lead] && BY[e.lead].st === 'needs' ? 'new' : (BY[e.lead] || {}).st });
  save();
  var n = nextUndecided(); if (n >= 0) ui.idx = n;
  ui.aiNote = ''; ui.menu = null; ui.modal = null; ui.animKey = '';
  render();
  toast((word === 'approved' ? 'Email to ' : 'Deleted email to ') + e.first + (word === 'approved' ? ' approved' : ''), 'good', function () { delete S.decisions[e.id]; save(); render(); });
}
function skip() { var n = nextUndecided(); if (n >= 0) ui.idx = n; ui.aiNote = ''; ui.menu = null; render(); }
function aiRewrite(e, label, fn) {
  var prev = S.mailEdits[e.id] ? clone(S.mailEdits[e.id]) : null, m = mailOf(e);
  S.mailEdits[e.id] = Object.assign({}, S.mailEdits[e.id], { body: fn(m.body) });
  ui.aiPrev = { id: e.id, val: prev }; ui.aiNote = 'Rewritten with AI: ' + label.toLowerCase() + '. Read it, then approve.'; ui.menu = null; save(); render();
}
function shorter(b) { var p = b.split('\n\n'); return p.length > 2 ? [p[0], p[p.length - 2], p[p.length - 1]].join('\n\n') : b; }
function warmer(b) { var p = b.split('\n\n'); if (b.indexOf('Hope your week') >= 0) return b; p.splice(1, 0, 'Hope your week is going well.'); return p.join('\n\n'); }
function personal(b, n) { var p = b.split('\n\n'); var line = 'I spent some time on ' + n + ' this week, and this made me think of you.'; if (b.indexOf(line) >= 0) return b; p.splice(1, 0, line); return p.join('\n\n'); }
function aiMenu(e, items) {
  var open = ui.menu === 'ai';
  return '<div class="menu-wrap"><button class="btn btn-secondary' + (e.sm ? ' btn-sm' : '') + '" id="aiBtn" type="button" aria-expanded="' + open + '" aria-haspopup="menu" ' + act(function () { ui.menu = open ? null : 'ai'; render(); }) + '>' + icon('sparkle') + 'Rewrite with AI' + (e.kbd ? ' <span class="kbd">W</span>' : '') + '</button>' +
    (open ? '<div class="menu" role="menu" data-anchor="aiBtn"><div class="menu-label">Rewrite this email to be</div>' + items.map(function (x) { return '<button type="button" role="menuitem" ' + act(x.run) + '>' + esc(x.label) + '</button>'; }).join('') + '</div>' : '') + '</div>';
}
function approveLook() {
  var list = flaggedList(), und = undecided();
  if (!und.length) {
    var a = list.filter(function (e) { return S.decisions[e.id] === 'approved'; }).length, d = list.filter(function (e) { return S.decisions[e.id] === 'deleted'; }).length;
    return '<section class="card"><div class="empty">All ' + list.length + ' are done: ' + a + ' approved, ' + d + ' deleted. Approved ones send with the rest on Monday.</div></section>';
  }
  if (S.decisions[(curReview() || {}).id]) { var n = nextUndecided(); if (n >= 0) ui.idx = n; }
  var e = curReview(), m = mailOf(e);
  var items = [{ label: 'Shorter', run: function () { aiRewrite(e, 'Shorter', shorter); } }, { label: 'Warmer', run: function () { aiRewrite(e, 'Warmer', warmer); } }, { label: 'More personal', run: function () { aiRewrite(e, 'More personal', function (b) { return personal(b, e.company.indexOf('Creator') === 0 ? 'your channel' : e.company); }); } }];
  return '<div class="cols"><section class="card col-main" aria-label="Email under review"><div class="card-head"><div class="row"><span class="strong">' + esc(e.name) + '</span>' + badge('Needs you', 'b-gold') + '</div><span class="small muted">' + (ui.idx + 1) + ' of ' + list.length + '</span></div>' +
    '<div class="card-body stack"><div class="notice notice-warn"><span class="ico">' + icon('eye') + '</span><span><span class="medium" style="color:inherit">Why you’re seeing this: </span>' + esc(e.flag) + '</span></div>' +
    '<div class="mail"><dl class="mail-meta"><dt>To</dt><dd>' + esc(e.to) + '</dd><dt>From</dt><dd>' + esc(e.from) + '</dd><dt>Sends</dt><dd>' + esc(e.when) + '</dd></dl><div class="mail-subject">' + esc(m.subject) + '</div><div class="mail-body">' + esc(m.body) + '</div>' + mailFoot(e.creator) + '</div>' +
    (ui.aiNote ? '<div class="row"><span class="muted">' + esc(ui.aiNote) + '</span>' + link('Undo', { on: function () { if (ui.aiPrev) { if (ui.aiPrev.val) S.mailEdits[ui.aiPrev.id] = ui.aiPrev.val; else delete S.mailEdits[ui.aiPrev.id]; } ui.aiNote = ''; ui.aiPrev = null; save(); render(); } }) + '</div>' : '') +
    '<div class="between"><div class="row">' + primary('Approve', { kbd: 'A', on: function () { decide('approved'); } }) + btn('Edit', { icon: 'pencil', kbd: 'E', on: function () { openEdit(e); } }) + aiMenu({ kbd: 1 }, items) + '</div><div class="row">' + link('Skip', { kbd: 'J', on: skip }) + btn('Delete', { cls: 'btn-danger-link', icon: 'trash', kbd: 'D', on: function () { askDeleteMail(e); } }) + '</div></div>' +
    '<p class="small muted" style="margin:0">Keyboard: A approve, E edit, W rewrite, J skip, D delete.</p></div></section>' +
    '<section class="card col-side" aria-labelledby="queueTitle"><div class="card-head"><h2 class="card-title" id="queueTitle">Need a look</h2><span class="small muted">' + und.length + ' left</span></div><ul class="list">' + list.map(function (qe, i) {
      var d = S.decisions[qe.id], w = d === 'approved' ? ['Approved', 'b-green'] : d === 'deleted' ? ['Deleted', 'b-neutral'] : ['Needs you', 'b-gold'];
      return '<li class="q-li"><button class="q-item" type="button" aria-current="' + (i === ui.idx) + '" ' + act(function () { ui.idx = i; ui.aiNote = ''; ui.menu = null; render(); }) + '><span><span class="medium" style="display:block">' + esc(qe.name) + '</span><span class="cell-sub">' + esc(qe.why) + '</span></span>' + badge(w[0], w[1]) + '</button></li>';
    }).join('') + '</ul></section></div>';
}
function askDeleteMail(e) { confirmBox('Delete the email to ' + e.first + '?', 'It won’t send on Monday. Their follow ups stay scheduled unless you pause them.', 'Delete email', function () { decide('deleted'); }); }
function openEdit(e) { var m = mailOf(e); openModal({ type: 'edit', e: e, subject: m.subject, body: m.body, tried: false }); }
function approveHeld() {
  return '<section class="card"><div class="card-head"><div><h2 class="card-title">Will not send</h2><p class="muted" style="margin:2px 0 0">Each one shows one reason and one fix.</p></div></div><div class="table-wrap"><table class="tbl"><thead><tr><th>Person</th><th>Why it won’t send</th><th>Status</th><th class="r">Fix</th></tr></thead><tbody>' +
    heldDefs().map(function (x) {
      var done = !!S.heldDone[x.id];
      return '<tr><td><a class="name-link" href="#/p/' + x.lead + '">' + esc(x.who) + '</a><div class="cell-sub">' + esc(x.company) + '</div></td><td><div class="medium">' + esc(done ? x.doneNext : x.reason) + '</div><div class="cell-sub">' + esc(done ? '' : x.next) + '</div></td><td>' + badge(done ? x.doneWord : x.never ? 'Never email' : 'Not sent', done ? 'b-green' : 'b-red') + '</td><td class="r">' + (done ? '<span class="small muted">—</span>' : btn(x.fixLabel, { sm: 1, on: x.run })) + '</td></tr>';
    }).join('') + '</tbody></table></div></section>';
}

/* ---------- Replies ---------- */
function replyType(r) { return S.replyType[r.id] || r.type; }
function viewReplies() {
  var q = ui.repQ.trim().toLowerCase();
  var list = REPLIES.filter(function (r) {
    if (ui.repNeeds && !(r.needs && !S.replyDone[r.id])) return false;
    if (ui.repType && replyType(r) !== ui.repType) return false;
    return !q || (r.from + ' ' + r.company).toLowerCase().indexOf(q) >= 0;
  });
  var filtered = q || ui.repType || ui.repNeeds;
  return shell('replies', '<div class="head"><div><h1 class="title">Replies</h1><p class="subtitle">You answer in Gmail. The app stops follow ups and sorts each reply. Sorting is a best guess, so change any that’s wrong.</p></div><div class="actions">' + btn('Open Gmail', { icon: 'external', on: function () { sampleNote('In the real app this opens Gmail'); } }) + '</div></div>' +
    '<section class="card"><div class="card-toolbar">' + search('repQ', ui.repQ, 'Search by name or company', function (e) { ui.repQ = e.target.value; render(); }) +
    select({ id: 'repType', width: '200px', label: 'Reply type', placeholder: 'All types', clearable: true, value: ui.repType, options: REPLY_TYPES.map(function (t) { return { value: t, label: t }; }), pick: function (v) { ui.repType = v; render(); } }) +
    '<button class="chip" type="button" aria-pressed="' + ui.repNeeds + '" ' + act(function () { ui.repNeeds = !ui.repNeeds; render(); }) + '>Needs you only</button><span class="count">' + (filtered ? list.length + ' of ' + REPLIES.length + ' replies' : REPLIES.length + ' replies') + '</span></div>' +
    (list.length ? '<div class="table-wrap"><table class="tbl"><thead><tr><th>From</th><th>Their reply and what the app did</th><th>Type</th><th class="r"><span class="sr">Actions</span></th></tr></thead><tbody>' + list.map(replyRow).join('') + '</tbody></table></div>' :
      '<div class="empty">No results. ' + link('Clear filters', { on: function () { ui.repQ = ''; ui.repType = ''; ui.repNeeds = false; render(); } }) + '</div>') + '</section>');
}
function replyRow(r) {
  var done = !!S.replyDone[r.id], t = replyType(r), acts = '';
  if (!done) {
    if (r.id === 'promptloom') acts += link('Restart Monday', { on: function () { S.replyDone[r.id] = true; save(); updateLead('promptloom', { next: 'Follow ups restart Monday' }); logIt('Moved Promptloom follow ups to Monday.'); render(); toast('Follow ups to Ines moved to Monday'); } });
    else if (t === 'Send shortlist') acts += link('Make shortlist', { on: function () { openShortlist(r.lead); } });
    else if (t === 'Interested' && BY[r.lead].kind === 'creator') acts += link('See brands that fit', { on: function () { openModal({ type: 'brands', leadId: r.lead }); } });
    else if (r.id === 'fundrail') acts += link('Review Tom’s email', { on: function () { S.replyDone.fundrail = true; save(); openReview('f2'); } });
    if (r.needs) acts += link('Mark done', { on: function () { S.replyDone[r.id] = true; save(); render(); toast('Marked done'); } });
  }
  if (!done) acts += link('Write reply with AI', { on: function () { openReplyAi(r); } });
  acts += btn('Open in Gmail', { sm: 1, icon: 'external', on: function () { sampleNote('In the real app this opens the thread in Gmail'); } });
  return '<tr><td style="min-width:200px"><div class="person">' + avatar(r.from) + '<div><a class="name-link" href="#/p/' + r.lead + '">' + esc(r.from) + '</a><div class="cell-sub">' + esc(r.company) + '</div><div class="cell-sub">' + esc(r.when) + '</div></div></div></td><td style="min-width:280px"><div style="color:var(--color-text)">“' + esc(r.quote) + '”</div><div class="cell-sub" style="margin-top:4px">' + esc(done ? r.did + ' Done.' : r.did) + '</div></td>' +
    '<td>' + select({ id: 'type-' + r.id, compact: true, width: '170px', label: 'Reply type for ' + r.from, value: t, options: REPLY_TYPES.map(function (x) { return { value: x, label: x }; }), pick: function (v) { if (!v) return; S.replyType[r.id] = v; save(); render(); toast('Reply type changed to ' + v); } }) + '</td><td class="r nowrap"><div class="stack-actions">' + acts + '</div></td></tr>';
}

function replyDraft(r) {
  var first = r.from.split(' ')[0], t = replyType(r);
  var body = { 'Send shortlist': 'Thanks for the quick reply. I\u2019ll send a few names with rough pricing today.', Interested: 'Great to hear. I\u2019ll look through your rate card and come back with brands that fit.', 'Wrong person': 'Thanks for letting me know, and all the best in the new team.', 'Out of office': 'No rush. I\u2019ll follow up when you\u2019re back.', 'Not now': 'Thanks for the honest answer. I\u2019ll check back in spring.', 'Not interested': 'Understood, and thanks for replying. I won\u2019t write again.' }[t];
  return 'Hi ' + first + ',\n\n' + body + '\n\nKamal';
}
function openReplyAi(r) {
  var m = { type: 'replyAi', r: r, loading: true, text: '', tried: false };
  openModal(m);
  setTimeout(function () { if (ui.modal === m) { m.loading = false; m.text = replyDraft(r); render(); } }, 900);
}

/* ---------- Matching and shortlist ---------- */
function matchesFor(l) {
  var other = l.kind === 'brand' ? 'creator' : 'brand', near = NEAR[l.niche] || [], same = [], close = [];
  for (var i = 0; i < LEADS.length; i++) {
    var c = LEADS[i];
    if (c.kind !== other || !alive(c) || c.optedOut || c.st === 'never') continue;
    if (c.niche === l.niche) same.push(c); else if (near.indexOf(c.niche) >= 0) close.push(c);
  }
  same.sort(function (a, b) { return (b.rate ? 1 : 0) - (a.rate ? 1 : 0); });
  return same.slice(0, 5).map(function (c) { return { lead: c, word: 'Same niche' }; }).concat(close.slice(0, 2).map(function (c) { return { lead: c, word: 'Close niche' }; })).slice(0, 6);
}
function openShortlist(id) {
  var m = matchesFor(BY[id]), p = {}; m.slice(0, 2).forEach(function (x) { p[x.lead.id] = true; });
  openModal({ type: 'shortlist', leadId: id, picks: p, text: null, tried: false });
}
function shortlistDraft(l, m, picks) {
  var chosen = m.filter(function (x) { return picks[x.lead.id]; });
  if (!chosen.length) return '';
  var lines = chosen.map(function (x) { var c = x.lead; return '• ' + c.name + ', ' + c.role + ' · ' + (c.followers || '') + '. ' + (c.note ? c.note + ' ' : '') + (c.rate ? 'About ' + c.rate + '.' : 'Rate to confirm.'); });
  return 'Hi ' + (l.contact || l.name).split(' ')[0] + ',\n\nThanks for coming back so quickly. Here are ' + chosen.length + ' creators who would fit ' + l.name + ':\n\n' + lines.join('\n') + '\n\nPrices are rough. Happy to set up a short call with any of them.\n\nKamal';
}

/* ---------- People ---------- */
function viewPeople(tab) {
  tab = tab || 'brand';
  var f = ui.filters, q = f.q.trim().toLowerCase();
  var base = LEADS.filter(function (l) { return alive(l) && (tab === 'opted' ? l.optedOut : l.kind === tab && !l.optedOut); });
  var counts = { brand: 0, creator: 0, opted: 0 };
  LEADS.forEach(function (l) { if (alive(l)) { if (l.optedOut) counts.opted++; else counts[l.kind]++; } });
  var rows = base.filter(function (r) {
    if (f.status && r.st !== f.status) return false;
    if (f.niche && r.niche !== f.niche) return false;
    return !q || (r.name + ' ' + r.contact + ' ' + r.niche + ' ' + r.email).toLowerCase().indexOf(q) >= 0;
  });
  rows.sort(function (a, b) { return f.sort === 'name' ? a.name.localeCompare(b.name) : f.sort === 'contacted' ? (a.cd == null ? 9999 : a.cd) - (b.cd == null ? 9999 : b.cd) : a.added - b.added; });
  var pg = paged('people-' + tab, rows), selIds = Object.keys(ui.sel).filter(function (id) { return ui.sel[id]; });
  var filtered = q || f.status || f.niche;
  var allSel = pg.rows.length > 0 && pg.rows.every(function (r) { return ui.sel[r.id]; });
  var addLabel = tab === 'creator' ? 'Add creator' : 'Add brand';
  return shell('people', '<div class="head"><div><h1 class="title">People</h1><p class="subtitle">Every brand and creator, whether you’ve contacted them, and what happens next.</p></div><div class="actions">' + btn('Find new', { icon: 'compass', href: '#/find' }) + primary(addLabel, { icon: 'plus', on: function () { openModal({ type: 'add', kind: tab === 'creator' ? 'creator' : 'brand', name: '', site: '', email: '', niche: '', tried: false }); } }) + '</div></div>' +
    tabs([{ label: 'Brands', count: fmt(counts.brand), sel: tab === 'brand', href: '#/people/brand' }, { label: 'Creators', count: fmt(counts.creator), sel: tab === 'creator', href: '#/people/creator' }, { label: 'Opted out', count: fmt(counts.opted), sel: tab === 'opted', href: '#/people/opted' }], 'Lists') +
    '<section class="card"><div class="card-toolbar">' + search('peopleQ', f.q, 'Search by name, niche or email', function (e) { f.q = e.target.value; ui.page['people-' + tab] = 0; render(); }) +
    select({ id: 'fStatus', width: '170px', label: 'Status', placeholder: 'Any status', clearable: true, value: f.status, options: ['needs', 'new', 'checking', 'emailing', 'replied', 'talking', 'shortlist', 'paused', 'notnow', 'won'].map(function (k) { return { value: k, label: STATUS[k][0] }; }), pick: function (v) { f.status = v; ui.page['people-' + tab] = 0; render(); } }) +
    select({ id: 'fNiche', width: '170px', label: 'Niche', placeholder: 'Any niche', clearable: true, value: f.niche, options: allNiches().map(function (n) { return { value: n, label: n }; }), pick: function (v) { f.niche = v; ui.page['people-' + tab] = 0; render(); } }) +
    select({ id: 'fSort', width: '170px', label: 'Sort', value: f.sort, options: [{ value: 'new', label: 'Newest first' }, { value: 'name', label: 'Name, A to Z' }, { value: 'contacted', label: 'Last contacted' }], pick: function (v) { f.sort = v || 'new'; render(); } }) +
    '<span class="count">' + (filtered ? fmt(rows.length) + ' match' : fmt(rows.length) + ' ' + (tab === 'opted' ? 'opted out' : tab + 's')) + '</span></div>' +
    (selIds.length ? '<div class="bulk"><span class="medium">' + selIds.length + ' selected</span>' + btn('Pause their emails', { sm: 1, icon: 'pause', on: function () { selIds.forEach(function (id) { updateLead(id, { allPaused: true, st: 'paused', next: 'Paused by you' }); }); ui.sel = {}; logIt('Paused emails for ' + plural(selIds.length, 'person', 'people') + '.'); render(); toast('Emails paused for ' + selIds.length); } }) +
      (isMember() ? '' : btn('Delete', { cls: 'btn-danger-link', icon: 'trash', on: function () { askDeletePeople(selIds); } })) + link('Clear selection', { on: function () { ui.sel = {}; render(); } }) + '</div>' : '') +
    (rows.length ? '<div class="table-wrap"><table class="tbl"><thead><tr><th class="w-check"><input type="checkbox" class="check" aria-label="Select all on this page"' + (allSel ? ' checked' : '') + ' ' + change(function () { pg.rows.forEach(function (r) { if (allSel) delete ui.sel[r.id]; else ui.sel[r.id] = true; }); render(); }) + '></th><th>Name</th><th>Niche</th><th>Address check</th><th>Last contacted</th><th>Status</th><th>Next step</th></tr></thead><tbody>' +
      pg.rows.map(function (r) {
        var st = statusOf(r), sub = r.kind === 'brand' ? [r.contact, r.role].filter(Boolean).join(', ') : r.role + (r.followers ? ' · ' + r.followers : '');
        return '<tr><td class="w-check"><input type="checkbox" class="check" aria-label="Select ' + esc(r.name) + '"' + (ui.sel[r.id] ? ' checked' : '') + ' ' + change(function () { if (ui.sel[r.id]) delete ui.sel[r.id]; else ui.sel[r.id] = true; render(); }) + '></td><td style="min-width:220px"><div class="person">' + avatar(r.name) + '<div style="min-width:0"><a class="name-link" href="#/p/' + r.id + '">' + esc(r.name) + '</a><div class="cell-sub">' + esc(sub) + '</div></div></div></td><td>' + esc(r.niche) + '</td><td class="nowrap">' + esc(MAIL[r.mail]) + '</td><td class="nowrap">' + esc(contactedText(r)) + '</td><td>' + badge(st[0], st[1]) + '</td><td>' + esc(r.next) + '</td></tr>';
      }).join('') + '</tbody></table></div>' + pg.html :
      '<div class="empty">' + (filtered ? 'No results. ' + link('Clear search and filters', { on: function () { f.q = ''; f.status = ''; f.niche = ''; render(); } }) : 'No one here yet.') + '</div>') + '</section>');
}
function contactedText(l) { if (l.cd == null) return '—'; var d = new Date(TODAY); d.setDate(d.getDate() - l.cd); return dayText(d); }
function allNiches() { var extra = S.added.map(function (l) { return l.niche; }).filter(function (n) { return n && n !== '—' && NICHES.indexOf(n) < 0; }); return NICHES.concat(extra.filter(function (n, i) { return extra.indexOf(n) === i; })).sort(); }
function askDeletePeople(ids) {
  var names = ids.slice(0, 3).map(function (i) { return BY[i].name; }).join(', ') + (ids.length > 3 ? ' and ' + (ids.length - 3) + ' more' : '');
  confirmBox('Delete ' + plural(ids.length, 'person', 'people') + '?', names + '. Their unsent emails stop and their history is removed. Opted-out people stay on the opt-out list.', 'Delete ' + ids.length, function () {
    ids.forEach(function (i) { S.deleted[i] = true; }); ui.sel = {}; save(); logIt('Deleted ' + plural(ids.length, 'person', 'people') + '.');
    closeModal(); toast(plural(ids.length, 'person', 'people') + ' deleted', 'good', function () { ids.forEach(function (i) { delete S.deleted[i]; }); save(); render(); });
  });
}
function finishCheck(id) {
  var l = BY[id]; if (!l || l.st !== 'checking') return;
  var bad = l.email && /^(info|test)@/.test(l.email);
  updateLead(id, { mail: bad ? 'unsure' : 'real', st: 'needs', next: 'First email ready to approve' });
  var name = (l.contact || l.name).split(' ')[0];
  S.extraFlag.push({ id: 'n-' + id, lead: id, name: l.contact || l.name, company: l.name, why: 'New person', first: name, to: (l.contact || l.name) + ' · ' + l.email, from: l.kind === 'brand' ? 'Kamal, brand inbox' : 'Kamal, partnerships inbox', when: 'Mon 9 Nov', creator: l.kind !== 'brand', flag: 'this person is new, so their first email gets a quick look.', subject: fill(S.templates[l.kind][0].subject, l), body: fill(S.templates[l.kind][0].body, l) });
  save(); render();
}
function newLead(o) {
  var id = 'n' + Date.now() + Math.floor(Math.random() * 1000), slug = o.name.toLowerCase().replace(/[^a-z0-9]/g, '') || 'new';
  var l = L(id, o.kind, o.name, o.contact || '', o.role || (o.kind === 'brand' ? '' : 'Creator'), o.niche || '—', -1, 'none', null, 'checking', 'Not contacted', 'Checking the address', { email: o.email || 'hello@' + slug + '.example', site: o.site || slug + '.example' });
  addLead(l);
  setTimeout(function () { finishCheck(id); }, 2500);
  return l;
}

/* ---------- Profile ---------- */
function viewProfile(id, tab) {
  var l = BY[id];
  if (!l || S.deleted[id]) return shell('people', '<a class="back" href="#/people">' + icon('caretLeft') + 'People</a><section class="card"><div class="empty">This person was deleted.</div></section>');
  tab = tab || 'emails';
  var st = statusOf(l), steps = stepsOf(l), sent = steps.filter(function (s) { return s.sent; }).length, nx = nextStep(l), matches = matchesFor(l);
  var first = (l.contact || l.name).split(' ')[0];
  var facts = (l.kind === 'brand' ? ['Brand'] : ['Creator', l.role, l.followers]).concat([l.niche, l.site, l.contact && l.kind === 'brand' ? l.contact + (l.role ? ', ' + l.role : '') : null]).filter(Boolean).join(' · ');
  var problem = l.mail === 'notreal' && !l.linkedin ? (l.others && l.others[0] && l.others[0].mail === 'real' ?
    '<div class="notice notice-warn"><span class="ico">' + icon('warningCircle') + '</span><span style="flex:1"><span class="medium" style="color:inherit">Not sent: </span>' + esc(l.email) + ' is not a real address. ' + esc(l.others[0].name) + ', ' + esc(l.others[0].role) + ', has a real one.</span>' + btn('Use ' + l.others[0].name.split(' ')[0], { sm: 1, on: l.id === 'shieldpath' ? useSofia : function () { swapContact(l, l.others[0]); } }) + '</div>' :
    '<div class="notice notice-warn"><span class="ico">' + icon('warningCircle') + '</span><span style="flex:1"><span class="medium" style="color:inherit">Not sent: </span>No working email. LinkedIn is the best way to reach them.</span>' + btn('Message on LinkedIn', { sm: 1, on: l.id === 'jonah' ? useLinkedIn : function () { updateLead(l.id, { linkedin: true, next: 'Message on LinkedIn. No email will send' }); render(); toast('Marked for LinkedIn'); } }) + '</div>') : '';
  var body = '';
  if (tab === 'emails') body = '<section class="card"><div class="card-head"><div><h2 class="card-title">Emails to ' + esc(first) + '</h2><p class="muted" style="margin:2px 0 0">' + esc(l.allPaused ? 'You paused every email here. Nothing more sends until you restart.' : nx ? (l.cd != null ? 'Contacted ' + contactedText(l) + ', no reply yet. ' : '') + 'Next: ' + nx.label.toLowerCase() + ', ' + nx.when + '.' : 'No more emails will send.') + '</p></div></div><div class="table-wrap"><table class="tbl"><thead><tr><th>Email</th><th>When</th><th>Status</th><th class="r"><span class="sr">Actions</span></th></tr></thead><tbody>' +
    steps.map(function (s) {
      var can = !s.sent && !s.del && !s.stopped;
      return '<tr><td style="min-width:260px"><div class="medium">' + esc(s.label) + '</div><div class="cell-sub">' + esc(s.subject) + '</div></td><td>' + esc(s.when) + '</td><td>' + badge(s.word, s.cls) + '</td><td class="r nowrap"><div class="row" style="justify-content:flex-end;flex-wrap:nowrap">' + link(s.sent || s.stopped ? 'View' : 'Open', { on: function () { openModal({ type: 'step', leadId: l.id, i: s.i, mode: can ? 'edit' : 'preview', subject: s.subject, body: s.body, tried: false, note: '' }); } }) +
        (can ? link(s.paused && !l.allPaused ? 'Restart' : 'Pause', { on: function () { setSeq(l, function (q) { if (q.paused[s.i]) delete q.paused[s.i]; else q.paused[s.i] = true; }); render(); toast(s.label + (s.paused ? ' restarted' : ' paused')); } }) + btn('Delete', { cls: 'btn-danger-link', on: function () { confirmBox('Delete ' + s.label.toLowerCase() + '?', 'It won’t send. The other emails to ' + first + ' stay as they are. You can restore it until its send day.', 'Delete email', function () { setSeq(l, function (q) { q.deleted[s.i] = true; }); closeModal(); toast(s.label + ' deleted'); }); } }) : '') +
        (s.del ? link('Restore', { on: function () { setSeq(l, function (q) { delete q.deleted[s.i]; }); render(); toast(s.label + ' restored'); } }) : '') + '</div></td></tr>';
    }).join('') + '</tbody></table></div><div class="pager"><span class="small muted">Follow ups are 3 days apart, on send days. If ' + esc(first) + ' replies, every email left stops. Out of office only pauses them.</span></div></section>';
  if (tab === 'about') body = '<section class="card"><div class="card-head"><div><h2 class="card-title">Who they are</h2><p class="muted" style="margin:2px 0 0">' + (l.enriched ? 'Found from ' + esc(l.site) + '. It can be wrong, so edit anything.' : 'Add this by hand, or let the app look it up.') + '</p></div><div class="row">' + badge('Add-on', 'b-neutral') + btn(ui.looking ? 'Looking…' : l.enriched ? 'Look again' : 'Find details', { sm: 1, icon: ui.looking ? 'spinner' : 'sparkle', disabled: ui.looking, on: function () { enrich(l); } }) + '</div></div><div class="card-body"><dl class="dl">' +
    [[l.kind === 'brand' ? 'Sells' : 'Covers', l.sells], ['Niche', l.niche], ['Size', l.size], ['Based in', l.city], ['On their website', l.web], ['Your note', l.note], ['Rate', l.rate]].map(function (d) { return '<dt class="muted">' + esc(d[0]) + '</dt><dd>' + esc(d[1] || '—') + '</dd>'; }).join('') + '</dl></div></section>';
  if (tab === 'contacts') {
    var contacts = [{ name: l.contact || l.name, role: l.role, email: l.email, mail: l.mail, main: true }].concat((l.others || []).map(function (o) { return Object.assign({}, o, { main: false }); }));
    body = '<section class="card"><div class="card-head"><h2 class="card-title">Contacts</h2><span class="small muted">We email one person per company at a time.</span></div><div class="table-wrap"><table class="tbl"><thead><tr><th>Name</th><th>Role</th><th>Email</th><th>Address</th><th class="r"><span class="sr">Action</span></th></tr></thead><tbody>' +
      contacts.map(function (c) { return '<tr><td><div class="person">' + avatar(c.name) + '<span class="medium">' + esc(c.name) + '</span></div></td><td>' + esc(c.role || '—') + '</td><td>' + esc(c.email) + '</td><td>' + badge(MAIL[c.mail], c.mail === 'real' ? 'b-green' : c.mail === 'unsure' ? 'b-gold' : c.mail === 'notreal' ? 'b-red' : 'b-neutral') + '</td><td class="r">' + (c.main ? '<span class="small muted">Main contact</span>' : link('Make main contact', { on: function () { swapContact(l, c); } })) + '</td></tr>'; }).join('') + '</tbody></table></div></section>';
  }
  if (tab === 'matches') body = '<section class="card"><div class="card-head"><div><h2 class="card-title">' + (l.kind === 'brand' ? 'Creators who fit' : 'Brands that fit') + '</h2><p class="muted" style="margin:2px 0 0">Matched by niche.</p></div>' + (l.kind === 'brand' && matches.length ? btn('Make shortlist', { sm: 1, on: function () { openShortlist(l.id); } }) : '') + '</div>' +
    (matches.length ? '<ul class="list">' + matches.map(function (m) { return '<li style="display:block"><div class="between"><a class="name-link" href="#/p/' + m.lead.id + '">' + esc(m.lead.name) + '</a><span class="small muted">' + esc(m.word) + '</span></div><div class="cell-sub">' + esc(m.lead.kind === 'creator' ? m.lead.role + ' · ' + (m.lead.followers || '') : m.lead.contact + ', ' + m.lead.role) + '</div><div style="margin-top:6px">' + esc(m.lead.niche) + (m.lead.note ? '. Your note: ' + m.lead.note : '') + '</div></li>'; }).join('') + '</ul>' : '<div class="empty">No one shares this niche yet. ' + link('Find new', { href: '#/find' }) + '</div>') + '</section>';
  if (tab === 'activity') {
    var a = [];
    if (l.cd != null) a.push({ when: contactedText(l), what: 'First email sent.' });
    a.push({ when: l.added <= 0 ? 'Today' : l.added + ' days ago', what: 'Address checked: ' + MAIL[l.mail].toLowerCase() + '.' });
    a.push({ when: l.added <= 0 ? 'Today' : l.added + ' days ago', what: 'Added to People.' });
    body = '<section class="card"><div class="card-head"><h2 class="card-title">Activity</h2><span class="small muted">Newest first</span></div><div class="card-body"><ol class="tl">' + a.map(function (x) { return '<li><div class="tl-when">' + esc(x.when) + '</div><div class="tl-what">' + esc(x.what) + '</div></li>'; }).join('') + '</ol></div></section>';
  }
  return shell('people', '<a class="back" href="#/people/' + (l.optedOut ? 'opted' : l.kind) + '">' + icon('caretLeft') + 'People</a>' + problem +
    '<section class="card card-body" aria-label="' + esc(l.name) + '"><div class="between" style="align-items:flex-start;gap:24px"><div class="person" style="align-items:flex-start;gap:16px;flex:1 1 420px">' + avatar(l.name, true) + '<div style="min-width:0"><div class="row"><h1 class="title" style="overflow-wrap:anywhere">' + esc(l.name) + '</h1>' + badge(st[0], st[1]) + '</div><p class="subtitle">' + esc(facts) + '</p></div></div><div class="actions">' +
    (l.optedOut ? '' : btn(l.allPaused ? 'Restart emails' : 'Pause all emails', { icon: l.allPaused ? 'play' : 'pause', on: function () { var p = !l.allPaused; updateLead(l.id, { allPaused: p, st: p ? 'paused' : (l.cd == null ? 'needs' : 'emailing'), next: p ? 'Paused by you' : 'Emails restarted' }); render(); toast(p ? 'All emails paused' : 'Emails restarted'); } })) +
    btn('Edit', { icon: 'pencil', on: function () { openModal({ type: 'details', leadId: l.id, name: l.name, contact: l.contact, email: l.email, site: l.site, niche: l.niche === '—' ? '' : l.niche, note: l.note, rate: l.rate, tried: false }); } }) +
    (isMember() ? '' : btn('Delete', { cls: 'btn-danger-link', icon: 'trash', on: function () { confirmBox('Delete ' + l.name + '?', 'Their unsent emails stop and their history is removed.', 'Delete ' + l.name.split(' ')[0], function () { S.deleted[l.id] = true; save(); logIt('Deleted ' + l.name + '.'); ui.modal = null; ui.animKey = ''; go('#/people/' + l.kind); toast(l.name + ' deleted', 'good', function () { delete S.deleted[l.id]; save(); render(); }); }); } })) + '</div></div>' +
    '<div class="figs" style="margin-top:24px;padding-top:20px;border-top:1px solid var(--color-border)"><div><div class="fig-n">' + sent + ' of ' + steps.length + '</div><div class="fig-l">emails sent</div></div><div><div class="fig-n">' + esc(nx ? nx.short : '—') + '</div><div class="fig-l">next email</div></div><div><div class="fig-n">' + matches.length + '</div><div class="fig-l">' + (l.kind === 'brand' ? 'creators who fit' : 'brands that fit') + '</div></div></div></section>' +
    tabs([['emails', 'Emails', steps.length], ['about', 'About', ''], ['contacts', 'Contacts', 1 + (l.others || []).length], ['matches', 'Matches', matches.length], ['activity', 'Activity', '']].map(function (t) { return { label: t[1], count: t[2], sel: tab === t[0], href: '#/p/' + l.id + '/' + t[0] }; }), l.name) + body);
}
function swapContact(l, c) {
  var old = { name: l.contact || l.name, role: l.role, email: l.email, mail: l.mail };
  var others = (l.others || []).filter(function (o) { return o.email !== c.email; }).concat([old]);
  updateLead(l.id, { contact: c.name, role: c.role, email: c.email, mail: c.mail, others: others });
  render(); toast(c.name + ' is now the main contact');
}
function enrich(l) {
  ui.looking = true; render();
  setTimeout(function () {
    ui.looking = false;
    var h = 0; for (var i = 0; i < l.name.length; i++) h += l.name.charCodeAt(i);
    var was = l.enriched;
    updateLead(l.id, { enriched: true, sells: l.sells || SELLS[l.niche] || 'Software for small teams', size: l.size || ['About 12 people', 'About 30 people', 'About 80 people', 'About 150 people'][h % 4], city: l.city || CITIES[h % CITIES.length], web: l.web || 'Launched a new plan last quarter' });
    render(); toast(was ? 'Profile checked. Nothing changed' : 'Details found (sample)');
  }, 1300);
}

/* ---------- Find new ---------- */
function makeFinds(kind, niche) {
  var h = 7; for (var i = 0; i < niche.length; i++) h = (h * 31 + niche.charCodeAt(i)) % 9973;
  var X = ['Bel', 'Cor', 'Dun', 'Eld', 'Fyn', 'Gal', 'Hes', 'Ind', 'Jun', 'Kal', 'Lum', 'Mav', 'Nim', 'Opa', 'Pel', 'Rav'], Y = ['vane', 'tora', 'mere', 'lith', 'gard', 'nova', 'quin', 'dell'];
  var out = [];
  for (var k = 0; k < 12; k++) {
    var person = FIRST[(h + k * 3) % FIRST.length] + ' ' + LAST[(h + k * 5) % LAST.length];
    if (kind === 'brand') {
      var nm = X[(h + k) % X.length] + Y[(h + k * 2) % Y.length];
      out.push({ key: nm, name: nm, contact: person, role: ROLES[(h + k) % ROLES.length], site: nm.toLowerCase() + '.example', email: person.split(' ')[0].toLowerCase() + '@' + nm.toLowerCase() + '.example', source: 'Company website', detail: person + ', ' + ROLES[(h + k) % ROLES.length] });
    } else {
      var p = PLATFORM[(h + k) % PLATFORM.length], size = (15 + (h + k * 37) % 300) + 'k ' + p[1];
      out.push({ key: person, name: person, contact: person, role: p[0], followers: size, site: 'youtube.com/@' + person.replace(/\s/g, '').toLowerCase(), email: person.split(' ')[0].toLowerCase() + (h % 90) + '@creator.example', source: p[0], detail: p[0] + ' · ' + size });
    }
  }
  return out;
}
function runFind() {
  var f = ui.find, niche = f.niche.trim();
  if (!niche) { f.err = 'Pick a niche or type one.'; render(); return; }
  f.err = ''; f.loading = true; f.results = null; f.picked = {}; render();
  setTimeout(function () {
    f.loading = false;
    var taken = {}; LEADS.forEach(function (l) { taken[l.name.toLowerCase()] = true; });
    var all = makeFinds(f.kind, niche);
    f.results = all.filter(function (r) { return !taken[r.name.toLowerCase()]; });
    f.have = LEADS.filter(function (l) { return alive(l) && l.kind === f.kind && l.niche.toLowerCase() === niche.toLowerCase() && !l.optedOut; }).length;
    f.searched = niche;
    render();
  }, 1500);
}
function viewFind() {
  var f = ui.find, picks = Object.keys(f.picked).filter(function (k) { return f.picked[k]; });
  var results = '';
  if (f.loading) results = '<section class="card" aria-busy="true" aria-label="Searching"><div class="card-head"><h2 class="card-title">Searching ' + esc(f.niche.trim()) + '…</h2></div>' + [1, 2, 3, 4, 5, 6].map(function () { return '<div style="display:flex;gap:16px;align-items:center;padding:14px 16px;border-bottom:1px solid var(--color-border)"><span class="skel" style="width:32px;height:32px"></span><span class="skel" style="width:24%"></span><span class="skel" style="width:14%"></span><span class="skel" style="width:90px;height:22px;margin-left:auto"></span></div>'; }).join('') + '</section>';
  else if (f.results) {
    var all = f.results.length > 0 && f.results.every(function (r) { return f.picked[r.key]; });
    results = '<section class="card"><div class="card-head"><div><h2 class="card-title">' + f.results.length + ' new ' + (f.kind === 'brand' ? 'brands' : 'creators') + ' in ' + esc(f.searched) + '</h2><p class="muted" style="margin:2px 0 0">' + (f.have ? plural(f.have, 'match', 'matches') + ' you already have ' + (f.have === 1 ? 'is' : 'are') + ' hidden.' : 'None of these are in People yet.') + '</p></div>' + primary(picks.length ? 'Add ' + picks.length + ' to People' : 'Add to People', { icon: 'plus', disabled: !picks.length, on: addFinds }) + '</div>' +
      (f.results.length ? '<div class="table-wrap"><table class="tbl"><thead><tr><th class="w-check"><input type="checkbox" class="check" aria-label="Select all results"' + (all ? ' checked' : '') + ' ' + change(function () { f.results.forEach(function (r) { f.picked[r.key] = !all; }); render(); }) + '></th><th>Name</th><th>Website or channel</th><th>Found on</th></tr></thead><tbody>' +
        f.results.map(function (r) { return '<tr><td class="w-check"><input type="checkbox" class="check" aria-label="Select ' + esc(r.name) + '"' + (f.picked[r.key] ? ' checked' : '') + ' ' + change(function () { f.picked[r.key] = !f.picked[r.key]; render(); }) + '></td><td><div class="person">' + avatar(r.name) + '<div><span class="medium">' + esc(r.name) + '</span><div class="cell-sub">' + esc(r.detail) + '</div></div></div></td><td>' + esc(r.site) + '</td><td>' + esc(r.source) + '</td></tr>'; }).join('') + '</tbody></table></div>' : '<div class="empty">You already have everyone we found.</div>') + '</section>';
  }
  var quick = ['AI tools', 'Security', 'Fintech', 'Developer tools', 'Productivity'];
  return shell('find', '<div class="head"><div><div class="row"><h1 class="title">Find new</h1>' + badge('Add-on', 'b-neutral') + '</div><p class="subtitle">Pick a niche. See who you don’t have yet. Add them in one click.</p></div></div>' +
    '<form class="card" ' + submit(runFind) + ' novalidate><div class="card-body form"><div class="form-2"><div class="field"><span class="label">Looking for</span><div>' + seg([{ label: 'Brands', sel: f.kind === 'brand', pick: function () { f.kind = 'brand'; f.results = null; render(); } }, { label: 'Creators', sel: f.kind === 'creator', pick: function () { f.kind = 'creator'; f.results = null; render(); } }], 'Looking for') + '</div></div>' +
    field('Niche', 'findNiche', inp('findNiche', f.niche, function (e) { f.niche = e.target.value; }, { list: 'nicheList', ph: 'Type any niche', err: f.err }), { err: f.err }) + '</div><datalist id="nicheList">' + allNiches().map(function (n) { return '<option value="' + esc(n) + '">'; }).join('') + '</datalist>' +
    '<div class="chips">' + quick.map(function (n) { return '<button class="chip" type="button" aria-pressed="' + (f.niche === n) + '" ' + act(function () { f.niche = n; f.err = ''; render(); }) + '>' + esc(n) + '</button>'; }).join('') + '</div></div><div class="card-foot" style="justify-content:space-between;align-items:center"><span class="small muted">Sample results. The real search needs a data provider, priced separately.</span>' + primary(f.loading ? 'Searching…' : 'Search', { type: 'submit', icon: f.loading ? 'spinner' : 'search', disabled: f.loading }) + '</div></form>' + results);
}
function addFinds() {
  var f = ui.find, n = 0, niche = f.searched;
  f.results.filter(function (r) { return f.picked[r.key]; }).forEach(function (r) { newLead({ kind: f.kind, name: r.name, contact: r.contact, role: r.role, site: r.site, email: r.email, niche: niche }); if (r.followers) { } n++; });
  f.results = f.results.filter(function (r) { return !f.picked[r.key]; }); f.picked = {};
  logIt('Added ' + plural(n, 'person', 'people') + ' from Find new: ' + niche + '.');
  render(); toast(plural(n, 'person', 'people') + ' added. Addresses are being checked', 'good');
}

/* ---------- Pipeline ---------- */
function viewPipeline() {
  var who = ui.pipeWho, inWho = function (l) { return alive(l) && !l.optedOut && (who === 'Everyone' || (who === 'Brands' ? l.kind === 'brand' : l.kind === 'creator')); };
  var counts = {}; STAGES.forEach(function (s) { counts[s] = 0; });
  var total = 0;
  LEADS.forEach(function (l) { if (inWho(l)) { counts[l.stage]++; total++; } });
  var q = ui.pipeQ.trim().toLowerCase();
  var rows = LEADS.filter(function (l) { return inWho(l) && l.stage === ui.pipeSel && (!q || (l.name + ' ' + l.niche).toLowerCase().indexOf(q) >= 0); });
  var pg = paged('pipe-' + ui.pipeSel + who, rows);
  return shell('pipeline', '<div class="head"><div><h1 class="title">Pipeline</h1><p class="subtitle">Where everyone stands. ' + fmt(total) + ' ' + (who === 'Everyone' ? 'people' : who.toLowerCase()) + '.</p></div></div>' +
    '<section class="card" aria-labelledby="stagesTitle"><div class="card-head"><h2 class="card-title" id="stagesTitle">Stages</h2>' + seg(['Everyone', 'Brands', 'Creators'].map(function (w) { return { label: w, sel: who === w, pick: function () { ui.pipeWho = w; render(); } }; }), 'Show') + '</div><div class="stages">' +
    STAGES.map(function (s) { return '<button class="stage" type="button" aria-pressed="' + (ui.pipeSel === s) + '" ' + act(function () { ui.pipeSel = s; ui.pipeQ = ''; render(); }) + '><span class="fig-n">' + fmt(counts[s]) + '</span><span class="fig-l">' + esc(s) + '</span></button>'; }).join('') + '</div></section>' +
    '<section class="card" aria-labelledby="listTitle"><div class="card-head"><h2 class="card-title" id="listTitle">' + esc(ui.pipeSel) + '</h2><span class="small muted">Moving someone only changes their stage. It never sends or stops an email.</span></div><div class="card-toolbar">' + search('pipeQ', ui.pipeQ, 'Search this stage', function (e) { ui.pipeQ = e.target.value; ui.page['pipe-' + ui.pipeSel + who] = 0; render(); }) + '<span class="count">' + fmt(rows.length) + ' in ' + esc(ui.pipeSel.toLowerCase()) + '</span></div>' +
    (rows.length ? '<div class="table-wrap"><table class="tbl"><thead><tr><th>Name</th><th>Niche</th><th>Last contacted</th><th>Next step</th><th style="width:200px">Move to</th></tr></thead><tbody>' + pg.rows.map(function (l) {
      return '<tr><td><div class="person">' + avatar(l.name) + '<div><a class="name-link" href="#/p/' + l.id + '">' + esc(l.name) + '</a><div class="cell-sub">' + (l.kind === 'brand' ? 'Brand' : 'Creator') + '</div></div></div></td><td>' + esc(l.niche) + '</td><td class="nowrap">' + esc(contactedText(l)) + '</td><td>' + esc(l.next) + '</td><td>' + select({ id: 'move-' + l.id, compact: true, width: '180px', label: 'Move ' + l.name + ' to', value: l.stage, options: STAGES.map(function (s) { return { value: s, label: s }; }), pick: function (v) { if (!v || v === l.stage) return; var old = l.stage, oldSt = l.st; updateLead(l.id, { stage: v, st: ST_BY_STAGE[v] }); render(); toast(l.name + ' moved to ' + v, 'good', function () { updateLead(l.id, { stage: old, st: oldSt }); render(); }); } }) + '</td></tr>';
    }).join('') + '</tbody></table></div>' + pg.html : '<div class="empty">' + (q ? 'No results in this stage.' : 'No one is in this stage.') + '</div>') + '</section>');
}

/* ---------- Settings ---------- */
var S_TABS = [['rules', 'Sending rules'], ['templates', 'Email templates'], ['inboxes', 'Inboxes'], ['spend', 'Spending limits'], ['optout', 'Opt-out list'], ['team', 'Team'], ['log', 'Activity log'], ['import', 'Import']];
function optouts() {
  var fromLeads = LEADS.filter(function (l) { return l.optedOut && alive(l); }).map(function (l) { return { who: l.contact && l.id.charAt(0) !== 'q' ? l.email : l.name + ' (whole company)', why: l.optWhy, when: l.optWhen }; });
  return S.optExtra.concat(EXTRA_OPTOUTS, fromLeads);
}
function viewSettings(tab) {
  tab = tab || 'rules';
  var locked = isMember() && ['rules', 'templates', 'inboxes', 'spend', 'team'].indexOf(tab) >= 0;
  var act2 = tab === 'optout' ? primary('Add to opt-out list', { icon: 'plus', on: function () { openModal({ type: 'opt', who: '', reason: '', tried: false }); } }) : tab === 'team' ? primary('Invite teammate', { icon: 'userPlus', disabled: locked, on: function () { openModal({ type: 'invite', email: '', role: 'member', tried: false }); } }) : '';
  var map = { rules: setRules, templates: setTemplates, inboxes: setInboxes, spend: setSpend, optout: setOpt, team: setTeam, log: setLog, import: setImport };
  return shell('settings', '<div class="head"><div><h1 class="title">Settings</h1><p class="subtitle">The rules the app follows. Signed in as ' + (isMember() ? 'a teammate (Member)' : 'Kamal (Admin)') + '.</p></div><div class="actions">' + act2 + '</div></div>' +
    tabs(S_TABS.map(function (t) { return { label: t[1], sel: tab === t[0], href: '#/settings/' + t[0], count: t[0] === 'optout' ? optouts().length : t[0] === 'team' ? 1 + S.team.length : '' }; }), 'Settings sections') +
    (locked ? '<div class="notice notice-info" role="note"><span class="ico">' + icon('info') + '</span><span>Only an admin can change this. You can read it, and ask Kamal if something needs changing.</span></div>' : '') + map[tab](locked));
}
function regionWindow(city) {
  var R = S.rules, list = { 'New York': [1, 1], Chicago: [0, 1], 'Los Angeles': [-2, 1], London: [6, 0], Berlin: [7, 0], Dubai: [10, 0], Sydney: [17, 0] }, x = list[city];
  var from = x[1] ? R.naFrom : R.oFrom, to = x[1] ? R.naTo : R.oTo;
  function t12(hm, off) { var p = hm.split(':'), h = Number(p[0]) - (off || 0), m = p[1], day = ''; if (h < 0) { h += 24; day = ' the day before'; } return (h % 12 || 12) + ':' + m + (h < 12 ? ' AM' : ' PM') + day; }
  var days = Object.keys(R.days).filter(function (d) { return R.days[d]; });
  return { their: t12(from) + ' to ' + t12(to) + ' their time, ' + (days.length ? days[0] + ' to ' + days[days.length - 1] : 'no days set') + '.', yours: city === 'Chicago' ? '' : 'That’s ' + t12(from, x[0]) + ' to ' + t12(to, x[0]) + ' for you, on Central Time.' };
}
function setRules(locked) {
  var R = S.rules, D = ui.ruleDraft = ui.ruleDraft || clone(R), err = ui.rulesErr, sc = regionWindow(ui.sendCheck);
  return '<form class="card" ' + submit(function () {
    var e = '';
    if (!Object.keys(D.days).some(function (d) { return D.days[d]; })) e = 'Pick at least one send day.';
    else if (D.naFrom >= D.naTo || D.oFrom >= D.oTo) e = 'A send window must end after it starts.';
    else if (Number(D.gapA) >= Number(D.gapB)) e = 'The shortest wait must be less than the longest.';
    else if (!/opt|stop/i.test(D.footer) || !/\d/.test(D.footer)) e = 'The footer needs an opt-out line and a postal address.';
    ui.rulesErr = e;
    if (e) { render(); toast('Rules not saved', 'bad'); return; }
    S.rules = clone(D); save(); logIt('Changed the sending rules.'); render(); toast('Rules saved');
  }) + ' novalidate><div class="card-head"><div><h2 class="card-title">Sending rules</h2><p class="muted" style="margin:2px 0 0">Always in each person’s own time zone. New rules apply from the next email.</p></div></div><div class="card-body form"><fieldset' + (locked ? ' disabled' : '') + '><legend class="label" style="margin-bottom:6px">Send days</legend><div class="row" style="gap:20px">' +
    Object.keys(D.days).map(function (d) { return '<label class="row" style="gap:6px;flex-wrap:nowrap"><input type="checkbox" class="check"' + (D.days[d] ? ' checked' : '') + (locked ? ' disabled' : '') + ' ' + change(function () { D.days[d] = !D.days[d]; }) + '>' + d + '</label>'; }).join('') + '</div><p class="hint" style="margin:6px 0 0">No cold emails on unticked days. Replies still arrive and are sorted.</p></fieldset>' +
    '<label class="row" style="gap:10px;flex-wrap:nowrap;align-items:flex-start"><input type="checkbox" class="check" style="margin-top:1px"' + (D.auto ? ' checked' : '') + (locked ? ' disabled' : '') + ' ' + change(function () { D.auto = !D.auto; }) + '><span><span class="medium">Send normal emails without my approval</span><span class="hint" style="display:block;margin-top:2px">Only unusual emails wait for you, like an unsure address or a new contact.</span></span></label>' +
    '<div class="form-2">' + field('North America, from', 'naFrom', inp('naFrom', D.naFrom, function (e) { D.naFrom = e.target.value; }, { type: 'time', disabled: locked }), { req: 1 }) + field('North America, until', 'naTo', inp('naTo', D.naTo, function (e) { D.naTo = e.target.value; }, { type: 'time', disabled: locked }), { req: 1 }) + field('Other regions, from', 'oFrom', inp('oFrom', D.oFrom, function (e) { D.oFrom = e.target.value; }, { type: 'time', disabled: locked }), { req: 1 }) + field('Other regions, until', 'oTo', inp('oTo', D.oTo, function (e) { D.oTo = e.target.value; }, { type: 'time', disabled: locked }), { req: 1 }) +
    '<div class="field"><span class="label">When we don’t know their time zone</span>' + select({ id: 'tz', width: '100%', label: 'When we don’t know their time zone', value: D.tz, disabled: locked, options: [{ value: 'ct', label: 'Use Central Time' }, { value: 'et', label: 'Use Eastern Time' }, { value: 'pt', label: 'Use Pacific Time' }], pick: function (v) { D.tz = v || 'ct'; render(); } }) + '<span class="hint">An unknown time zone never stops an email.</span></div>' +
    '<div class="field"><span class="label">Follow ups per person, up to</span>' + select({ id: 'fu', width: '100%', label: 'Follow ups per person', value: D.fu, disabled: locked, options: [{ value: '3', label: '3 follow ups' }, { value: '2', label: '2 follow ups' }, { value: '1', label: '1 follow up' }, { value: '0', label: 'No follow ups' }], pick: function (v) { D.fu = v || '3'; render(); } }) + '<span class="hint">3 days apart, on send days. All stop on a reply, bounce or opt-out. Out of office only pauses them.</span></div>' +
    field('Shortest wait between emails, seconds', 'gapA', inp('gapA', D.gapA, function (e) { D.gapA = e.target.value; }, { type: 'number', disabled: locked }), { req: 1 }) + field('Longest wait between emails, seconds', 'gapB', inp('gapB', D.gapB, function (e) { D.gapB = e.target.value; }, { type: 'number', disabled: locked }), { req: 1 }) + '</div>' +
    '<div><h3 class="card-title" style="margin-bottom:4px">Daily limit per inbox</h3><p class="hint" style="margin:0 0 12px">Counted over any 24 hours, follow ups included. Anyone over the limit waits and sends on the next send day, so nobody gets lost.</p><div class="form-3">' + field('Weeks 1 and 2', 'c1', inp('c1', D.c1, function (e) { D.c1 = Number(e.target.value); }, { type: 'number', disabled: locked })) + field('Week 3', 'c2', inp('c2', D.c2, function (e) { D.c2 = Number(e.target.value); }, { type: 'number', disabled: locked })) + field('After that, up to', 'c3', inp('c3', D.c3, function (e) { D.c3 = Number(e.target.value); }, { type: 'number', disabled: locked })) + '</div></div>' +
    field('Footer on every email', 'footer', area('footer', D.footer, function (e) { D.footer = e.target.value; }, 3, { disabled: locked }), { req: 1, hint: 'The opt-out line and postal address can’t be removed.' }) +
    '<div><h3 class="card-title" style="margin-bottom:4px">Check a send time</h3><p class="hint" style="margin:0 0 12px">Pick where someone lives to see when their email goes out, using the saved rules.</p><div class="row">' + select({ id: 'sendCheck', width: '200px', label: 'Where they live', value: ui.sendCheck, options: ['New York', 'Chicago', 'Los Angeles', 'London', 'Berlin', 'Dubai', 'Sydney'].map(function (c) { return { value: c, label: c }; }), pick: function (v) { ui.sendCheck = v || 'Chicago'; render(); } }) + '<div><div class="medium">' + esc(sc.their) + '</div><div class="cell-sub">' + esc(sc.yours) + '</div></div></div></div>' +
    (err ? '<div class="form-error" role="alert">Rules not saved. ' + esc(err) + '</div>' : '') + '</div><div class="card-foot">' + btn('Cancel', { disabled: locked, on: function () { ui.ruleDraft = null; ui.rulesErr = ''; render(); } }) + primary('Save rules', { type: 'submit', disabled: locked }) + '</div></form>';
}
function setTemplates(locked) {
  var t = ui.tpl, list = S.templates[t.kind], cur = list[t.step], d = ui.tplDraft = (ui.tplDraft && ui.tplDraft.k === t.kind + t.step) ? ui.tplDraft : { k: t.kind + t.step, subject: cur.subject, body: cur.body };
  var sample = t.kind === 'brand' ? BY.vaultly : BY.maya;
  sample = Object.assign({}, sample, { contact: t.kind === 'brand' ? 'Mara Quinn' : 'Maya Torres' });
  return '<div class="cols"><section class="card col-main"><div class="card-head"><h2 class="card-title">Email templates</h2>' + seg([{ label: 'To brands', sel: t.kind === 'brand', pick: function () { t.kind = 'brand'; t.step = 0; t.err = ''; render(); } }, { label: 'To creators', sel: t.kind === 'creator', pick: function () { t.kind = 'creator'; t.step = 0; t.err = ''; render(); } }], 'Template set') + '</div><div class="card-body form">' +
    '<div class="chips">' + list.map(function (x, i) { return '<button class="chip" type="button" aria-pressed="' + (t.step === i) + '" ' + act(function () { t.step = i; t.err = ''; render(); }) + '>' + esc(x.label) + '</button>'; }).join('') + '</div>' +
    field('Subject', 'tplSub', inp('tplSub', d.subject, function (e) { d.subject = e.target.value; updateTplPreview(d, sample); }, { disabled: locked }), { req: 1 }) + field('Email', 'tplBody', area('tplBody', d.body, function (e) { d.body = e.target.value; updateTplPreview(d, sample); }, 11, { disabled: locked, err: t.err }), { req: 1, err: t.err, hint: 'Use {first}, {company} and {niche}. Anything else is caught before it can send.' }) + '</div><div class="card-foot">' +
    primary('Save template', { disabled: locked, on: function () {
      var bad = (d.subject + ' ' + d.body).match(/\{[^}]*\}/g) || [], wrong = bad.filter(function (x) { return ['{first}', '{company}', '{niche}'].indexOf(x) < 0; });
      if (!d.subject.trim() || !d.body.trim()) { t.err = 'Add a subject and an email.'; render(); return; }
      if (wrong.length) { t.err = 'We don’t know ' + wrong[0] + '. Use {first}, {company} or {niche}.'; render(); return; }
      t.err = ''; cur.subject = d.subject; cur.body = d.body; save(); logIt('Edited the ' + cur.label.toLowerCase() + ' template.'); render(); toast('Template saved');
    } }) + '</div></section><section class="card col-side"><div class="card-head"><h2 class="card-title">How it reads</h2><span class="small muted">Sample: ' + esc(sample.name) + '</span></div><div class="card-body"><div class="mail"><div class="mail-subject" id="tplPrevS">' + esc(fill(d.subject, sample)) + '</div><div class="mail-body" id="tplPrevB">' + esc(fill(d.body, sample)) + '</div>' + mailFoot(t.kind === 'creator') + '</div></div></section></div>';
}
function updateTplPreview(d, l) { var a = document.getElementById('tplPrevS'), b = document.getElementById('tplPrevB'); if (a) a.textContent = fill(d.subject, l); if (b) b.textContent = fill(d.body, l); }
function setInboxes(locked) {
  var st = S.stopped;
  return '<section class="card"><div class="card-head"><div><h2 class="card-title">Inboxes</h2><p class="muted" style="margin:2px 0 0">Brand emails go from your inbox. Creator emails go from partnerships, with its signature.</p></div>' + btn('Add an inbox', { sm: 1, icon: 'plus', disabled: locked, on: function () { sampleNote('In the real app, Google sign-in opens here'); } }) + '</div><ul class="list">' +
    inboxRow({ name: 'kamal@eliteedge.example', role: 'Brand outreach', used: 120, cap: 150, badge: 'b-green', word: 'Working', cls: '', note: 'room for 30 more today' }) +
    inboxRow({ name: 'partnerships@eliteedge.example', role: 'Creator outreach · daily limit ' + S.rules.c2 + ' now, up to ' + S.rules.c3 + ' by Mon 23 Nov', used: st ? 31 : 92, cap: Number(S.rules.c2), badge: st ? 'b-red' : 'b-gold', word: st ? 'Stopped' : 'Near limit', cls: st ? 'stop' : 'near', note: st ? 'Gmail signed it out' : 'the rest send on Monday', extra: locked ? '' : '<div style="margin-top:12px">' + (st ? primary('Sign in again', { sm: 1, on: signBackIn }) : btn('See what happens if Gmail signs this inbox out', { sm: 1, on: function () { S.stopped = true; save(); go('#/today'); toast('Today now shows the problem, and the fix', 'info'); } })) + '</div>' }) + '</ul></section>';
}
function setSpend(locked) {
  var D = ui.spendDraft = ui.spendDraft || clone(S.spend);
  var rows = [{ k: 'checks', label: 'Address checks', what: 'Checking each email is real', used: 14 }, { k: 'ai', label: 'AI writing', what: 'Rewrites and reply sorting', used: 4 }, { k: 'find', label: 'Find new and details', what: 'Add-on. Price set once the provider is chosen', used: null }];
  return '<form class="card" ' + submit(function () { if (rows.some(function (r) { return D[r.k] !== '' && Number(D[r.k]) < 0; })) { toast('Limits can’t be below zero', 'bad'); return; } S.spend = clone(D); save(); logIt('Changed the spending limits.'); render(); toast('Limits saved'); }) + ' novalidate><div class="card-head"><div><h2 class="card-title">Spending limits</h2><p class="muted" style="margin:2px 0 0">What the app may spend each month. When a limit is reached, that step waits and Today tells you.</p></div></div><div class="table-wrap"><table class="tbl"><thead><tr><th>What</th><th>This month</th><th class="r">Used</th><th style="width:180px">Monthly limit, $</th></tr></thead><tbody>' +
    rows.map(function (r) { var lim = Number(D[r.k]) || 0, pct = r.used != null && lim ? Math.min(100, Math.round(r.used / lim * 100)) : 0; return '<tr><td><div class="medium">' + esc(r.label) + '</div><div class="cell-sub">' + esc(r.what) + '</div></td><td style="min-width:200px"><div class="meter"><span style="width:' + pct + '%"></span></div></td><td class="r">' + (r.used == null ? '—' : '$' + r.used) + '</td><td><input class="input" id="lim-' + r.k + '" type="number" min="0" aria-label="' + esc(r.label) + ' monthly limit in dollars" value="' + esc(D[r.k]) + '" ' + input(function (e) { D[r.k] = e.target.value; }) + (locked ? ' disabled' : '') + '></td></tr>'; }).join('') + '</tbody></table></div><div class="card-foot">' + primary('Save limits', { type: 'submit', disabled: locked }) + '</div></form>';
}
function setOpt() {
  var q = ui.optQ.trim().toLowerCase(), all = optouts(), list = all.filter(function (o) { return !q || o.who.toLowerCase().indexOf(q) >= 0; }), pg = paged('opt', list);
  return '<section class="card"><div class="card-toolbar">' + search('optQ', ui.optQ, 'Search addresses and companies', function (e) { ui.optQ = e.target.value; ui.page.opt = 0; render(); }) + '<span class="count">' + (q ? list.length + ' match' : all.length + ' on the list') + '</span></div>' +
    (list.length ? '<div class="table-wrap"><table class="tbl"><thead><tr><th>Address or company</th><th>Why</th><th>Added</th><th>Status</th></tr></thead><tbody>' + pg.rows.map(function (o) { return '<tr><td class="medium">' + esc(o.who) + '</td><td>' + esc(o.why) + '</td><td>' + esc(o.when) + '</td><td>' + badge('Never email', 'b-red') + '</td></tr>'; }).join('') + '</tbody></table></div>' + pg.html : '<div class="empty">No results. ' + link('Clear search', { on: function () { ui.optQ = ''; render(); } }) + '</div>') + '</section>';
}
function setTeam(locked) {
  return '<section class="card"><div class="table-wrap"><table class="tbl"><thead><tr><th>Name</th><th>Role</th><th>Status</th><th class="r"><span class="sr">Action</span></th></tr></thead><tbody><tr><td><div class="person"><span class="avatar av-5" aria-hidden="true">K</span><div><div class="medium">Kamal</div><div class="cell-sub">kamal@eliteedge.example</div></div></div></td><td>Admin</td><td>' + badge('Active', 'b-green') + '</td><td></td></tr>' +
    S.team.map(function (t, i) { return '<tr><td><div class="person">' + avatar(t.email) + '<div><div class="medium">' + esc(t.email) + '</div><div class="cell-sub">Invited today</div></div></div></td><td>' + esc(t.role) + '</td><td>' + badge('Invited', 'b-blue') + '</td><td class="r">' + (locked ? '' : btn('Remove', { cls: 'btn-danger-link', on: function () { confirmBox('Remove ' + t.email + '?', 'They can no longer sign in.', 'Remove', function () { S.team.splice(i, 1); save(); logIt('Removed ' + t.email + ' from the team.'); closeModal(); toast('Teammate removed'); }); } })) + '</td></tr>'; }).join('') +
    '</tbody></table></div><div class="card-body" style="border-top:1px solid var(--color-border)"><dl class="dl" style="grid-template-columns:96px 1fr;gap:8px 16px"><dt class="medium">Admin</dt><dd>Can do everything.</dd><dt class="medium">Member</dt><dd>Can approve, edit and pause emails and work with people. Can’t delete people or change rules, inboxes or spending.</dd></dl><div style="margin-top:16px">' + btn(isMember() ? 'Back to Admin' : 'See it as a Member', { sm: 1, on: function () { S.role = isMember() ? 'Admin' : 'Member'; save(); render(); toast(isMember() ? 'Now viewing as a Member' : 'Back to Admin', 'info'); } }) + '</div></div></section>';
}
function setLog() {
  var all = S.log.concat(LOG);
  return '<section class="card"><div class="card-head"><h2 class="card-title">Activity log</h2><span class="small muted">Every change by a person or the app, newest first</span></div><div class="card-body"><ol class="tl">' + all.map(function (l) { return '<li><div class="tl-when">' + esc(l.when) + ' · ' + esc(l.who) + '</div><div class="tl-what">' + esc(l.what) + '</div></li>'; }).join('') + '</ol></div></section>';
}
var IMPORT_ROWS = (function () {
  var rows = [], names = ['Tovarix', 'Melqora', 'Brenvale', 'Corvina Labs', 'Sylqen', 'Ardoxa', 'Noxelle', 'Pruvia', 'Velmora', 'Kindora', 'Ostrelia', 'Quarnel', 'Lumbrik', 'Hestiq', 'Yonvale', 'Zephalo', 'Graviq', 'Fernix', 'Dalvora', 'Ebonta'];
  names.forEach(function (n, i) { rows.push({ name: n, niche: NICHES[i * 3 % NICHES.length], email: 'hello@' + n.toLowerCase().replace(/\s/g, '') + '.example', ok: i < 18 }); });
  return rows;
})();
function setImport() {
  if (S.imported && ui.imp !== 3) ui.imp = 3;
  var head = '<div class="card-head"><div><h2 class="card-title">Import from your Sheet</h2><p class="muted" style="margin:2px 0 0">A one-time move. Every row is checked first, and nothing is emailed until you approve it.</p></div><span class="small muted">Step ' + ui.imp + ' of 3</span></div>';
  if (ui.imp === 1) return '<section class="card">' + head + '<div class="card-body form"><p style="margin:0">In Google Sheets, choose File, Download, then Comma Separated Values. Pick that file here. In this demo, try it with a sample file.</p><div class="row">' + primary('Use the sample file', { icon: 'upload', on: function () { ui.imp = 2; render(); } }) + '</div></div></section>';
  if (ui.imp === 2) return '<section class="card">' + head + '<div class="card-body form"><p style="margin:0"><span class="medium">24 rows found</span> <span class="muted">in your file.</span></p><div class="figs"><div><div class="fig-n">18</div><div class="fig-l">ready to add</div></div><div><div class="fig-n">3</div><div class="fig-l">already here, will merge</div></div><div><div class="fig-n">1</div><div class="fig-l">opted out</div></div><div><div class="fig-n">2</div><div class="fig-l">address not real</div></div></div></div><div class="table-wrap" style="border-top:1px solid var(--color-border)"><table class="tbl"><thead><tr><th>Row in your Sheet</th><th>What we found</th><th>What happens</th></tr></thead><tbody><tr><td class="medium">Vaultly · row 14</td><td>' + badge('Duplicate', 'b-blue') + '</td><td>Merged into Vaultly. Its history is kept.</td></tr><tr><td class="medium">Ravi Menon · row 20</td><td>' + badge('Duplicate', 'b-blue') + '</td><td>Merged into Ravi Menon.</td></tr><tr><td class="medium">Quietnet · row 7</td><td>' + badge('Opted out', 'b-red') + '</td><td>Kept on the opt-out list. Never emailed.</td></tr><tr><td class="medium">Ebonta · row 23</td><td>' + badge('Not real', 'b-red') + '</td><td>Added without email. We look for another contact or LinkedIn.</td></tr><tr><td class="medium">Your columns</td><td>' + badge('Matched', 'b-neutral') + '</td><td>Name, email and niche are matched to the app once, before the import.</td></tr></tbody></table></div><div class="card-foot">' + btn('Use a different file', { on: function () { ui.imp = 1; render(); } }) + primary('Import 18 people', { on: function () { confirmBox('Import 18 people?', 'They’re added to People, 3 duplicates are merged, and 1 stays on the opt-out list. Nothing is emailed until you approve it.', 'Import 18 people', doImport, false); } }) + '</div></section>';
  return '<section class="card">' + head + '<div class="empty"><p class="medium" style="margin:0 0 4px">18 people imported</p><p style="margin:0 0 16px">3 merged and 1 kept on the opt-out list. Their first emails appear in Approve once they’re checked. Nothing sends without you.</p>' + btn('See them in People', { href: '#/people/brand' }) + '</div></section>';
}
function doImport() {
  IMPORT_ROWS.slice(0, 18).forEach(function (r) { newLead({ kind: 'brand', name: r.name, contact: 'Hello team', email: r.email, niche: r.niche }); });
  S.imported = true; ui.imp = 3; save(); logIt('Imported 18 people from a CSV file.'); closeModal(); toast('18 people imported');
}

/* ---------- Modals ---------- */
function modalView() {
  var m = ui.modal; if (!m) return '';
  var fn = { confirm: mConfirm, approve: mApprove, sample: mSample, edit: mEdit, shortlist: mShortlist, brands: mBrands, add: mAdd, step: mStep, batch: mBatch, replyAi: mReplyAi, details: mDetails, opt: mOpt, invite: mInvite }[m.type];
  return fn ? fn(m) : '';
}
function mConfirm(m) {
  return overlay('confirm', '<div class="modal" role="dialog" aria-modal="true" aria-labelledby="cfTitle">' + dlgHead(m.title, '', 'cfTitle') + '<div class="dlg-body"><p style="margin:0">' + esc(m.text) + '</p></div><div class="dlg-foot">' + btn('Cancel', { on: closeModal, autofocus: 1 }) + btn(m.label, { cls: m.danger ? 'btn-danger' : 'btn-primary', on: m.fn }) + '</div></div>');
}
function mApprove() {
  var ready = readyCount(), brand = 140, creators = 96 - Object.keys(S.pulled).length;
  return overlay('approve', '<div class="modal modal-md" role="dialog" aria-modal="true" aria-labelledby="apTitle">' + dlgHead('Approve ' + ready + ' emails?', '', 'apTitle') + '<div class="dlg-body"><p style="margin:0">They send on Monday from 9:03 AM in each person’s time zone: ' + brand + ' from your inbox to brands and ' + creators + ' from partnerships to creators. The ' + undecided().length + ' that need a look are not included.</p><p class="muted" style="margin:12px 0 0">You can still pause or edit any of them until it sends.</p></div><div class="dlg-foot">' + btn('Cancel', { on: closeModal, autofocus: 1 }) + btn('Send me a test first', { on: function () { closeModal(); toast('Test email sent to kamal@eliteedge.example (sample)'); } }) + primary('Approve ' + ready + ' emails', { on: function () { S.batchApproved = true; save(); logIt('Approved ' + ready + ' emails for Monday.'); closeModal(); toast(ready + ' emails approved', 'good', function () { S.batchApproved = false; save(); render(); }); } }) + '</div></div>');
}
function mSample() {
  var start = (ui.seed * 5) % POOL.length, list = POOL.concat(POOL).slice(start, start + 5);
  return overlay('sample', '<div class="panel" role="dialog" aria-modal="true" aria-labelledby="smTitle">' + dlgHead('5 at random', 'From the ' + readyCount() + ' that look normal. Pull out any that look wrong.', 'smTitle') + '<div class="dlg-body stack">' + list.map(function (s) {
    var p = !!S.pulled[s.name];
    return '<div class="mail" style="padding:16px 20px"><div class="between" style="align-items:flex-start"><div><div class="medium">' + esc(s.name) + '</div><div class="cell-sub">' + esc(s.company) + ' · ' + (s.inbox === 'brand' ? 'Brand inbox' : 'Partnerships') + '</div></div>' + (p ? badge('Needs you', 'b-gold') : btn('Pull out', { sm: 1, on: function () { pullOut(s); } })) + '</div><div class="mail-subject" style="margin:12px 0 4px">' + esc(s.subject) + '</div><div class="mail-body">' + esc(s.body) + '</div></div>';
  }).join('') + '</div><div class="dlg-foot">' + btn('Read 5 others', { on: function () { ui.seed++; render(); } }) + primary('Done', { on: closeModal, autofocus: 1 }) + '</div></div>');
}
function mEdit(m) {
  var se = m.tried && !m.subject.trim(), be = m.tried && !m.body.trim();
  return overlay('edit', '<form class="panel" role="dialog" aria-modal="true" aria-labelledby="edTitle" ' + submit(function () { if (!m.subject.trim() || !m.body.trim()) { m.tried = true; render(); return; } S.mailEdits[m.e.id] = { subject: m.subject, body: m.body }; save(); closeModal(); toast('Email updated'); }) + ' novalidate>' + dlgHead('Edit email to ' + m.e.first, 'Changes apply to this email only.', 'edTitle') + '<div class="dlg-body form">' +
    field('Subject', 'edSub', inp('edSub', m.subject, function (e) { m.subject = e.target.value; }, { err: se, autofocus: 1 }), { req: 1, err: se ? 'Add a subject. Emails without one look like spam.' : '' }) + field('Email', 'edBody', area('edBody', m.body, function (e) { m.body = e.target.value; }, 14, { err: be }), { req: 1, err: be ? 'Write the email before saving.' : '', hint: 'The signature, opt-out line and postal address are added for you.' }) + '</div><div class="dlg-foot">' + btn('Cancel', { on: closeModal }) + primary('Save changes', { type: 'submit' }) + '</div></form>');
}
function mShortlist(m) {
  var l = BY[m.leadId], matches = matchesFor(l), picked = matches.filter(function (x) { return m.picks[x.lead.id]; }).length;
  var text = m.text != null ? m.text : shortlistDraft(l, matches, m.picks), err = m.tried && !text.trim();
  return overlay('shortlist', '<div class="panel" role="dialog" aria-modal="true" aria-labelledby="slTitle">' + dlgHead('Shortlist for ' + l.name, 'Creators in ' + l.niche + ' and close niches.', 'slTitle') + '<div class="dlg-body form"><fieldset><legend class="label" style="margin-bottom:6px">Creators who fit <span class="muted">· ' + picked + ' picked</span></legend><ul class="list list-boxed">' +
    matches.map(function (x) { var c = x.lead; return '<li><input type="checkbox" class="check" id="pick-' + c.id + '"' + (m.picks[c.id] ? ' checked' : '') + ' ' + change(function () { m.picks[c.id] = !m.picks[c.id]; m.text = null; render(); }) + ' style="margin-top:2px"><label class="grow" for="pick-' + c.id + '" style="cursor:pointer"><div class="between"><span class="medium">' + esc(c.name) + '</span><span class="small muted">' + esc(c.rate || 'No rate yet') + '</span></div><div class="cell-sub">' + esc(c.role + ' · ' + (c.followers || '')) + ' · ' + esc(x.word) + ': ' + esc(c.niche) + '</div>' + (c.note ? '<div style="margin-top:6px">Your note: ' + esc(c.note) + '</div>' : '') + '</label></li>'; }).join('') + '</ul></fieldset>' +
    field('Email to ' + (l.contact || l.name).split(' ')[0], 'slEmail', area('slEmail', text, function (e) { m.text = e.target.value; }, 11, { err: err }), { req: 1, err: err ? 'Pick at least one creator, or write the email yourself.' : '', hint: 'Written from your picks. Rates come from your notes on each creator. It only goes out when you send it from Gmail.' }) + '</div><div class="dlg-foot">' + btn('Rewrite from picks', { on: function () { m.text = null; render(); } }) +
    primary('Open in Gmail with this email', { icon: 'external', on: function () { var t = m.text != null ? m.text : shortlistDraft(l, matches, m.picks); if (!t.trim()) { m.tried = true; render(); return; } updateLead(l.id, { stage: 'Shortlist sent', st: 'shortlist', next: 'Waiting for their pick' }); REPLIES.forEach(function (r) { if (r.lead === l.id) S.replyDone[r.id] = true; }); save(); logIt('Sent a shortlist to ' + l.name + '.'); closeModal(); toast('Shortlist ready in Gmail (sample)'); } }) + '</div></div>');
}
function mBrands(m) {
  var l = BY[m.leadId], list = matchesFor(l);
  return overlay('brands', '<div class="panel" role="dialog" aria-modal="true" aria-labelledby="bfTitle">' + dlgHead('Brands that fit ' + l.name, l.niche + ' creator, ' + (l.followers || '') + '.', 'bfTitle') + '<div class="dlg-body"><ul class="list list-boxed">' + list.map(function (b) { return '<li style="display:block"><div class="between"><a class="name-link" href="#/p/' + b.lead.id + '">' + esc(b.lead.name) + '</a><span class="small muted">' + esc(b.word) + '</span></div><div class="cell-sub">' + esc(b.lead.niche) + '</div></li>'; }).join('') + '</ul></div><div class="dlg-foot">' + btn('Close', { on: closeModal, autofocus: 1 }) + '</div></div>');
}
function mAdd(m) {
  var ne = m.tried && !m.name.trim(), se = m.tried && !m.site.trim(), ee = m.tried && m.email.trim() && !emailOk(m.email), n = [ne, se, ee].filter(Boolean).length, isC = m.kind === 'creator';
  return overlay('add', '<form class="panel" role="dialog" aria-modal="true" aria-labelledby="addTitle" ' + submit(function () {
    if (!m.name.trim() || !m.site.trim() || (m.email.trim() && !emailOk(m.email))) { m.tried = true; render(); return; }
    var name = m.name.trim(), dupe = LEADS.filter(function (l) { return alive(l) && l.name.toLowerCase() === name.toLowerCase(); })[0];
    if (dupe) { ui.modal = null; ui.animKey = ''; go('#/p/' + dupe.id); toast(name + ' is already in People', 'info'); return; }
    var l = newLead({ kind: m.kind, name: name, site: m.site.trim(), email: m.email.trim(), niche: m.niche.trim(), contact: isC ? name : '' });
    logIt('Added ' + name + '.'); ui.filters.sort = 'new'; ui.filters.q = ''; ui.page['people-' + m.kind] = 0; ui.modal = null; ui.animKey = ''; go('#/people/' + m.kind); toast(name + ' added');
  }) + ' novalidate>' + dlgHead(isC ? 'Add creator' : 'Add brand', 'We check the address first. Nothing is emailed until you approve it.', 'addTitle') + '<div class="dlg-body form">' + (n ? '<div class="form-error" role="alert">Fix the marked ' + (n === 1 ? 'field' : n + ' fields') + ', then add again.</div>' : '') +
    field('Name', 'nName', inp('nName', m.name, function (e) { m.name = e.target.value; }, { err: ne, autofocus: 1, ph: isC ? 'Full name' : 'Company name' }), { req: 1, err: ne ? 'Add a name.' : '' }) +
    field(isC ? 'Channel' : 'Website', 'nSite', inp('nSite', m.site, function (e) { m.site = e.target.value; }, { err: se, ph: isC ? 'youtube.com/@channel' : 'company.example' }), { req: 1, err: se ? 'Add a website or channel.' : '' }) +
    '<div class="form-2">' + field('Email', 'nEmail', inp('nEmail', m.email, function (e) { m.email = e.target.value; }, { err: ee, ph: 'name@company.example' }), { err: ee ? 'This doesn’t look like an email address.' : '' }) + field('Niche', 'nNiche', inp('nNiche', m.niche, function (e) { m.niche = e.target.value; }, { list: 'nicheList2', ph: 'Pick or type one' })) + '</div><datalist id="nicheList2">' + allNiches().map(function (x) { return '<option value="' + esc(x) + '">'; }).join('') + '</datalist></div><div class="dlg-foot">' + btn('Cancel', { on: closeModal }) + primary(isC ? 'Add creator' : 'Add brand', { type: 'submit' }) + '</div></form>');
}
function mStep(m) {
  var l = BY[m.leadId], s = stepsOf(l)[m.i], can = !s.sent && !s.stopped && !s.del, first = (l.contact || l.name).split(' ')[0];
  var se = m.tried && !m.subject.trim(), be = m.tried && !m.body.trim();
  var items = [{ label: 'Shorter', run: function () { m.body = shorter(m.body); m.note = 'Rewritten with AI: shorter. Read it, then save.'; ui.menu = null; render(); } }, { label: 'Warmer', run: function () { m.body = warmer(m.body); m.note = 'Rewritten with AI: warmer. Read it, then save.'; ui.menu = null; render(); } }, { label: 'More personal', run: function () { m.body = personal(m.body, l.name); m.note = 'Rewritten with AI: more personal. Read it, then save.'; ui.menu = null; render(); } }, { label: 'Write a new one', run: function () { m.body = genFollowUp(l); m.note = 'Written with AI. Read it, then save.'; ui.menu = null; render(); } }];
  var preview = '<div class="mail"><dl class="mail-meta"><dt>To</dt><dd>' + esc((l.contact || l.name) + ' · ' + l.email) + '</dd><dt>From</dt><dd>' + (l.kind === 'brand' ? 'Kamal · kamal@eliteedge.example' : 'Kamal · partnerships@eliteedge.example') + '</dd></dl><div class="mail-subject">' + esc(m.subject) + '</div><div class="mail-body">' + esc(m.body) + '</div>' + mailFoot(l.kind === 'creator') + '</div>';
  return overlay('step', '<form class="panel" role="dialog" aria-modal="true" aria-labelledby="emTitle" ' + submit(function () { if (!can) { closeModal(); return; } if (!m.subject.trim() || !m.body.trim()) { m.tried = true; m.mode = 'edit'; render(); return; } setSeq(l, function (q) { q.edits[m.i] = { subject: m.subject, body: m.body }; }); closeModal(); toast(s.label + ' updated'); }) + ' novalidate>' + dlgHead(s.label, s.when, 'emTitle') + '<div class="dlg-body form">' +
    (can ? '<div class="between">' + seg([{ label: 'Edit', sel: m.mode === 'edit', pick: function () { m.mode = 'edit'; render(); } }, { label: 'See as ' + first + ' will', sel: m.mode === 'preview', pick: function () { m.mode = 'preview'; ui.menu = null; render(); } }], 'View') + aiMenu({ sm: 1 }, items) + '</div>' : '') +
    (can && m.mode === 'edit' ? field('Subject', 'pSub', inp('pSub', m.subject, function (e) { m.subject = e.target.value; }, { err: se }), { req: 1, err: se ? 'Add a subject.' : '' }) + field('Email', 'pBody', area('pBody', m.body, function (e) { m.body = e.target.value; }, 12, { err: be }), { req: 1, err: be ? 'Write the email before saving.' : '', hint: 'Applies to this email only. Signature and footer are added for you.' }) : preview) +
    (m.note ? '<p class="hint" style="margin:0">' + esc(m.note) + '</p>' : '') + '</div><div class="dlg-foot">' + (can ? btn('Cancel', { on: closeModal }) + primary('Save changes', { type: 'submit' }) : btn('Close', { on: closeModal, autofocus: 1 })) + '</div></form>');
}
function mBatch(m) {
  var def = {
    sent: { title: 'Sent today', sub: 'Every email that went out today, newest first.', list: LEADS.filter(function (l) { return alive(l) && l.stage === 'Emailing'; }), total: S.stopped ? 151 : 212, right: function () { return badge('Sent', 'b-green'); } },
    going: { title: 'Still going out today', sub: 'These send before the window closes. Pause any of them.', list: LEADS.filter(function (l) { return alive(l) && l.stage === 'Emailing' && !l.allPaused; }).slice(20), total: 250 - (S.stopped ? 151 : 212), right: function (l) { return link('Pause', { on: function () { updateLead(l.id, { allPaused: true, st: 'paused', next: 'Paused by you' }); render(); toast('Emails to ' + l.name + ' paused'); } }); } },
    followup: { title: 'Follow ups due today', sub: 'They send on their own. Write a fresh one with AI if you want to.', list: dueFollowUps(), right: function (l) { return link('Write with AI', { on: function () { var n = nextStep(l); openModal({ type: 'step', leadId: l.id, i: n.i, mode: 'edit', subject: n.subject, body: genFollowUp(l), tried: false, note: 'Written with AI. Read it, then save.' }); } }); } },
    waiting: { title: 'Waiting for Monday', sub: 'Over today\u2019s daily limit. They send first on Monday, the next send day, so nobody gets lost.', list: LEADS.filter(function (l) { return alive(l) && l.st === 'new'; }), total: WAITING_TOTAL, right: function () { return badge('Waiting', 'b-neutral'); } }
  }[m.kind];
  var total = def.total != null ? def.total : def.list.length, rows = def.list.slice(0, 12);
  return overlay('batch' + m.kind, '<div class="panel" role="dialog" aria-modal="true" aria-labelledby="baTitle">' + dlgHead(def.title + ' (' + fmt(total) + ')', def.sub, 'baTitle') + '<div class="dlg-body">' + (rows.length ? '<ul class="list list-boxed">' + rows.map(function (l) {
    return '<li style="align-items:center"><div class="grow person">' + avatar(l.name) + '<div style="min-width:0"><a class="name-link" href="#/p/' + l.id + '">' + esc(l.name) + '</a><div class="cell-sub">' + esc(l.niche) + ' \u00b7 ' + esc(l.kind === 'brand' ? 'Brand inbox' : 'Partnerships') + '</div></div></div>' + def.right(l) + '</li>';
  }).join('') + '</ul><p class="hint" style="margin:12px 0 0">Showing ' + rows.length + ' of ' + fmt(total) + '. The real app lists them all.</p>' : '<div class="empty">Nothing here right now.</div>') + '</div><div class="dlg-foot">' + btn('Close', { on: closeModal, autofocus: 1 }) + '</div></div>');
}
function mReplyAi(m) {
  var r = m.r, first = r.from.split(' ')[0], err = m.tried && !m.text.trim();
  return overlay('replyAi', '<div class="panel" role="dialog" aria-modal="true" aria-labelledby="raTitle">' + dlgHead('Reply to ' + first, r.company, 'raTitle') + '<div class="dlg-body form"><div class="mail"><div class="cell-sub" style="margin-bottom:6px">Their reply</div><div class="mail-body">\u201c' + esc(r.quote) + '\u201d</div></div>' +
    (m.loading ? '<div aria-busy="true" aria-label="Writing" class="stack"><span class="skel" style="width:40%"></span><span class="skel"></span><span class="skel" style="width:80%"></span></div>' :
      '<div class="row">' + btn('Shorter', { sm: 1, on: function () { var p = m.text.split('\n\n'); if (p.length > 2) { m.text = p[0] + '\n\n' + p[1].split('. ')[0].replace(/\.$/, '') + '.\n\n' + p[p.length - 1]; } render(); } }) + btn('Warmer', { sm: 1, on: function () { m.text = warmer(m.text); render(); } }) + btn('Write again', { sm: 1, icon: 'sparkle', on: function () { m.text = replyDraft(r); render(); } }) + '</div>' +
      field('Your reply', 'raText', area('raText', m.text, function (e) { m.text = e.target.value; }, 8, { err: err }), { req: 1, err: err ? 'Write a reply before opening Gmail.' : '', hint: 'Sample text in this demo. In the real app, AI writes it. It only goes out when you send it from Gmail.' })) +
    '</div><div class="dlg-foot">' + btn('Cancel', { on: closeModal }) + primary('Open in Gmail with this reply', { icon: 'external', disabled: m.loading, on: function () { if (!m.text.trim()) { m.tried = true; render(); return; } S.replyDone[r.id] = true; save(); logIt('Replied to ' + r.from + '.'); closeModal(); toast('Reply ready in Gmail (sample)'); } }) + '</div></div>');
}
function mDetails(m) {
  var l = BY[m.leadId], ne = m.tried && !m.name.trim(), ee = m.tried && !emailOk(m.email);
  return overlay('details', '<form class="panel" role="dialog" aria-modal="true" aria-labelledby="dtTitle" ' + submit(function () { if (!m.name.trim() || !emailOk(m.email)) { m.tried = true; render(); return; } updateLead(l.id, { name: m.name.trim(), contact: m.contact.trim(), email: m.email.trim(), site: m.site.trim(), niche: m.niche.trim() || '—', note: m.note.trim(), rate: m.rate.trim() }); closeModal(); toast('Details saved'); }) + ' novalidate>' + dlgHead('Edit ' + l.name, 'Changes show everywhere they appear.', 'dtTitle') + '<div class="dlg-body form">' +
    field('Name', 'dName', inp('dName', m.name, function (e) { m.name = e.target.value; }, { err: ne, autofocus: 1 }), { req: 1, err: ne ? 'Add a name.' : '' }) + '<div class="form-2">' + field('Contact', 'dContact', inp('dContact', m.contact, function (e) { m.contact = e.target.value; })) + field('Email', 'dEmail', inp('dEmail', m.email, function (e) { m.email = e.target.value; }, { err: ee }), { req: 1, err: ee ? 'This doesn’t look like an email address.' : '' }) + field('Website or channel', 'dSite', inp('dSite', m.site, function (e) { m.site = e.target.value; })) + field('Niche', 'dNiche', inp('dNiche', m.niche, function (e) { m.niche = e.target.value; }, { list: 'nicheList3', ph: 'Pick or type one' })) + '</div><datalist id="nicheList3">' + allNiches().map(function (x) { return '<option value="' + esc(x) + '">'; }).join('') + '</datalist>' +
    field('Your note', 'dNote', area('dNote', m.note, function (e) { m.note = e.target.value; }, 3), { hint: 'Used in shortlists.' }) + (l.kind === 'creator' ? field('Rate', 'dRate', inp('dRate', m.rate, function (e) { m.rate = e.target.value; }, { ph: '$2,000 a video' })) : '') + '</div><div class="dlg-foot">' + btn('Cancel', { on: closeModal }) + primary('Save changes', { type: 'submit' }) + '</div></form>');
}
function mOpt(m) {
  var err = m.tried && !m.who.trim();
  return overlay('opt', '<form class="panel" role="dialog" aria-modal="true" aria-labelledby="opTitle" ' + submit(function () {
    if (!m.who.trim()) { m.tried = true; render(); return; }
    var w = m.who.trim().toLowerCase(), hit = LEADS.filter(function (l) { return l.email.toLowerCase() === w || l.name.toLowerCase() === w; })[0];
    if (hit) updateLead(hit.id, { optedOut: true, optWhy: m.reason || 'Added by you', optWhen: 'Today', st: 'never', next: 'Opted out today' });
    else S.optExtra.unshift({ who: m.who.trim(), why: m.reason || 'Added by you', when: 'Today' });
    save(); logIt('Added ' + m.who.trim() + ' to the opt-out list.'); closeModal(); toast('Added to the opt-out list');
  }) + ' novalidate>' + dlgHead('Add to opt-out list', 'Any emails waiting for them are cancelled.', 'opTitle') + '<div class="dlg-body form">' + field('Address or company', 'optWho', inp('optWho', m.who, function (e) { m.who = e.target.value; }, { err: err, autofocus: 1, ph: 'name@company.example or company name' }), { req: 1, err: err ? 'Add an address or a company name.' : '' }) +
    '<div class="field"><span class="label">Reason</span>' + select({ id: 'optReason', width: '100%', label: 'Reason', placeholder: 'Choose a reason', clearable: true, value: m.reason, options: ['Asked not to be contacted', 'Competitor', 'Existing client', 'Other'].map(function (x) { return { value: x, label: x }; }), pick: function (v) { m.reason = v; render(); } }) + '</div></div><div class="dlg-foot">' + btn('Cancel', { on: closeModal }) + primary('Add to list', { type: 'submit' }) + '</div></form>');
}
function mInvite(m) {
  var err = m.tried && !emailOk(m.email);
  return overlay('invite', '<form class="panel" role="dialog" aria-modal="true" aria-labelledby="invTitle" ' + submit(function () { if (!emailOk(m.email)) { m.tried = true; render(); return; } S.team.push({ email: m.email.trim(), role: m.role === 'admin' ? 'Admin' : 'Member' }); save(); logIt('Invited ' + m.email.trim() + '.'); closeModal(); toast('Teammate added'); }) + ' novalidate>' + dlgHead('Invite teammate', 'They sign in with a code sent to this email.', 'invTitle') + '<div class="dlg-body form">' + field('Email', 'invEmail', inp('invEmail', m.email, function (e) { m.email = e.target.value; }, { err: err, autofocus: 1, ph: 'name@eliteedge.example' }), { req: 1, err: err ? 'Add a valid email address.' : '' }) +
    '<div class="field"><span class="label">Role <span class="req" aria-hidden="true">*</span></span>' + select({ id: 'invRole', width: '100%', label: 'Role', value: m.role, options: [{ value: 'member', label: 'Member' }, { value: 'admin', label: 'Admin' }], pick: function (v) { m.role = v || 'member'; render(); } }) + '<span class="hint">' + (m.role === 'admin' ? 'Can do everything.' : 'Can approve, edit and pause emails and work with people. Can’t delete people or change rules, inboxes or spending.') + '</span></div></div><div class="dlg-foot">' + btn('Cancel', { on: closeModal }) + primary('Send invite', { type: 'submit' }) + '</div></form>');
}

/* ---------- Sign-in ---------- */
function viewSignin() {
  var s = ui.signin, err = s.tried && (s.step === 1 ? !emailOk(s.email) : !/^\d{6}$/.test(s.code.trim()));
  return '<main class="signin"><div class="signin-box"><img class="signin-logo" src="assets/logo.webp" alt="Elite Edge Collective"><form class="card card-body form" ' + submit(function () {
    if (s.step === 1) { if (!emailOk(s.email)) { s.tried = true; render(); return; } s.step = 2; s.tried = false; s.code = ''; render(); return; }
    if (!/^\d{6}$/.test(s.code.trim())) { s.tried = true; render(); return; }
    S.signedOut = false; save(); go('#/today');
  }) + ' novalidate><div><h1 class="title">Sign in</h1><p class="subtitle">' + (s.step === 1 ? 'We email you a code. No password to remember.' : 'Enter the 6-digit code sent to ' + esc(s.email) + '. In this demo, any 6 digits work.') + '</p></div>' +
    (s.step === 1 ? field('Email', 'siEmail', inp('siEmail', s.email, function (e) { s.email = e.target.value; }, { err: err, autofocus: 1 }), { req: 1, err: err ? 'Add a valid email address.' : '' }) : field('Code', 'siCode', inp('siCode', s.code, function (e) { s.code = e.target.value; }, { err: err, autofocus: 1, ph: '123456' }), { req: 1, err: err ? 'Enter the 6 digits.' : '' })) +
    primary(s.step === 1 ? 'Send code' : 'Sign in', { type: 'submit' }) + '</form></div></main>';
}

/* ---------- Render ---------- */
var root = document.getElementById('root');
function render() {
  var a = document.activeElement, focusId = a && a.id, caret = null, focusOn = a && a.getAttribute && a.getAttribute('data-on');
  try { if (a && a.selectionStart != null) caret = [a.selectionStart, a.selectionEnd]; } catch (e) { caret = null; }
  var bodyScroll = {}; var db = document.querySelector('.dlg-body'); if (db) bodyScroll.top = db.scrollTop;
  H = [];
  var r = route(), v = r[0], html;
  if (S.signedOut && v !== 'signin') { location.hash = '#/signin'; return; }
  document.title = 'Elite Edge · ' + ({ today: 'Today', approve: 'Approve', replies: 'Replies', people: 'People', p: 'Profile', find: 'Find new', pipeline: 'Pipeline', settings: 'Settings', signin: 'Sign in' }[v] || 'Today');
  if (v === 'signin') html = viewSignin();
  else if (v === 'approve') html = viewApprove(r[1]);
  else if (v === 'replies') html = viewReplies();
  else if (v === 'people') html = viewPeople(r[1]);
  else if (v === 'p') html = viewProfile(r[1], r[2]);
  else if (v === 'find') html = viewFind();
  else if (v === 'pipeline') html = viewPipeline();
  else if (v === 'settings') html = viewSettings(r[1]);
  else html = viewToday();
  root.innerHTML = html;
  placePopups();
  var db2 = document.querySelector('.dlg-body'); if (db2 && bodyScroll.top) db2.scrollTop = bodyScroll.top;
  var target = focusId && document.getElementById(focusId);
  if (ui.openSel) target = document.querySelector('.sel-opt.active') || document.querySelector('.sel-opt') || target;
  if (!target && focusOn != null) target = document.querySelector('[data-on="' + focusOn + '"]');
  var box = document.querySelector('[data-overlay]');
  if (box && !(target && box.contains(target))) { target = box.querySelector('[data-autofocus]') || box.querySelector('.icon-btn'); caret = null; }
  if (!box && !target) target = document.querySelector('.signin [data-autofocus]');
  if (target) { target.focus({ preventScroll: true }); if (caret && target.setSelectionRange) { try { target.setSelectionRange(caret[0], caret[1]); } catch (e) { /* not a text field */ } } }
}
function placePopups() {
  document.querySelectorAll('[data-anchor]').forEach(function (p) {
    var a = document.getElementById(p.getAttribute('data-anchor')); if (!a) return;
    var r = a.getBoundingClientRect(), isSel = p.classList.contains('sel-list');
    if (isSel) p.style.width = Math.max(r.width, 180) + 'px';
    var h = p.offsetHeight, w = p.offsetWidth, top = r.bottom + 4;
    if (top + h > innerHeight - 8) top = Math.max(8, r.top - h - 4);
    var left = Math.min(r.left, innerWidth - w - 8);
    p.style.top = top + 'px'; p.style.left = Math.max(8, left) + 'px';
  });
}

/* ---------- Events ---------- */
document.addEventListener('click', function (e) {
  var t = e.target.closest('[data-toast]');
  if (t) { var undo = T.undo; clearToast(); if (t.getAttribute('data-toast') === 'undo' && undo) undo(); return; }
  var el = e.target.closest('[data-on]');
  if (el && !el.disabled) {
    var over = el.hasAttribute('data-overlay');
    if (over && e.target !== el) el = null;
    if (el) { var fn = H[Number(el.getAttribute('data-on'))]; if (fn) { e.stopPropagation(); fn(e); } if (over) return; if (ui.openSel && !e.target.closest('.sel')) { ui.openSel = null; render(); } return; }
  }
  if ((ui.openSel && !e.target.closest('.sel')) || (ui.menu && !e.target.closest('.menu-wrap'))) { ui.openSel = null; ui.menu = null; render(); }
});
document.addEventListener('change', function (e) { var el = e.target.closest('[data-change]'); if (el) { var fn = H[Number(el.getAttribute('data-change'))]; if (fn) fn(e); } });
document.addEventListener('input', function (e) { var el = e.target.closest('[data-input]'); if (el) { var fn = H[Number(el.getAttribute('data-input'))]; if (fn) fn(e); } });
document.addEventListener('submit', function (e) { e.preventDefault(); var el = e.target.closest('[data-submit]'); if (el) { var fn = H[Number(el.getAttribute('data-submit'))]; if (fn) fn(e); } });
document.addEventListener('keydown', function (e) {
  var k = e.key, tag = (e.target.tagName || '').toUpperCase();
  if (k === 'Escape') {
    if (ui.openSel) { var id = ui.openSel; ui.openSel = null; render(); var b = document.getElementById(id); if (b) b.focus(); return; }
    if (ui.menu) { ui.menu = null; render(); return; }
    if (ui.modal) { closeModal(); return; }
  }
  if (ui.openSel && (k === 'ArrowDown' || k === 'ArrowUp')) {
    e.preventDefault();
    var opts = Array.prototype.slice.call(document.querySelectorAll('.sel-opt'));
    var i = opts.indexOf(document.activeElement); i = (i + (k === 'ArrowDown' ? 1 : -1) + opts.length) % opts.length;
    if (opts[i]) opts[i].focus();
    return;
  }
  if (!ui.openSel && (k === 'ArrowDown' || k === 'ArrowUp') && e.target.classList && e.target.classList.contains('sel-btn')) { e.preventDefault(); e.target.click(); return; }
  if (k === 'Tab' && ui.modal) {
    var box = document.querySelector('[data-overlay] .panel, [data-overlay] .modal');
    if (box) {
      var f = box.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled])');
      if (f.length) { var first = f[0], last = f[f.length - 1]; if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); } else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); } else if (!box.contains(document.activeElement)) { e.preventDefault(); first.focus(); } }
    }
    return;
  }
  var r = route();
  if (r[0] === 'approve' && r[1] === 'look' && !ui.modal && ['INPUT', 'TEXTAREA', 'SELECT'].indexOf(tag) < 0 && !e.ctrlKey && !e.metaKey && !e.altKey && undecided().length) {
    var c = k.toLowerCase(), cur = curReview();
    if (c === 'a') { e.preventDefault(); decide('approved'); } else if (c === 'e') { e.preventDefault(); openEdit(cur); } else if (c === 'd') { e.preventDefault(); askDeleteMail(cur); } else if (c === 'j') { e.preventDefault(); skip(); } else if (c === 'w') { e.preventDefault(); ui.menu = ui.menu === 'ai' ? null : 'ai'; render(); }
  }
});
window.addEventListener('resize', placePopups);
window.addEventListener('scroll', function () { if (ui.openSel || ui.menu) { ui.openSel = null; ui.menu = null; render(); } }, { passive: true });

S.added.forEach(function (l) { if (l.st === 'checking') setTimeout(function () { finishCheck(l.id); }, 1500); });
render();
