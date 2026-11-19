/* Leonida Legend — checklist, spoiler masking, filters, progress,
   export / import / reset. Data comes only from data/trophies.json,
   progress lives only in this browser's local storage. */

(function () {
  'use strict';

  var STORAGE_KEY = 'leonida-legend-earned-v1';
  var DATA_URL = 'data/trophies.json';

  var trophies = [];
  var earned = new Set(loadEarned());
  var spoilersHidden = true;
  var missableOnly = false;
  var onlineOnly = false;
  var unconfirmedOnly = false;

  var listEl = document.getElementById('trophy-list');
  var emptyEl = document.getElementById('empty-state');
  var errorEl = document.getElementById('load-error');
  var countEl = document.getElementById('list-count');
  var searchEl = document.getElementById('search');
  var gradeEl = document.getElementById('grade-filter');
  var earnedEl = document.getElementById('earned-filter');
  var missableBtn = document.getElementById('filter-missable');
  var onlineBtn = document.getElementById('filter-online');
  var unconfirmedBtn = document.getElementById('filter-unconfirmed');
  var spoilerBtn = document.getElementById('spoiler-toggle');

  function loadEarned() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      var parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed.filter(function (x) { return typeof x === 'string'; }) : [];
    } catch (e) {
      return [];
    }
  }

  function saveEarned() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(earned)));
    } catch (e) {
      /* Storage may be unavailable; the checklist still works in memory. */
    }
  }

  function trophyId(t, i) {
    if (t && typeof t.id === 'string' && t.id) return t.id;
    if (t && typeof t.name === 'string' && t.name) return t.name;
    return 'trophy-' + (i + 1);
  }

  function isHidden(t) { return t.hidden === true; }
  function isMissable(t) { return t.missable === true; }
  function isUnconfirmed(t) { return t.unconfirmed === true; }
  function isOnline(t) { return t.online === true; }

  /* The kit's trophy list stores grades lowercase ("bronze"); the UI
     and the filters use the capitalised form ("Bronze"). */
  function gradeName(t) {
    var g = (t && t.grade) || 'Bronze';
    return g.charAt(0).toUpperCase() + g.slice(1).toLowerCase();
  }

  function visibleTrophies() {
    var q = searchEl.value.trim().toLowerCase();
    var grade = gradeEl.value;
    var status = earnedEl.value;
    return trophies.filter(function (t, i) {
      var id = trophyId(t, i);
      if (grade !== 'all' && gradeName(t) !== grade) return false;
      if (status === 'earned' && !earned.has(id)) return false;
      if (status === 'unearned' && earned.has(id)) return false;
      if (missableOnly && !isMissable(t)) return false;
      if (onlineOnly && !isOnline(t)) return false;
      if (unconfirmedOnly && !isUnconfirmed(t)) return false;
      if (q) {
        var hay = ((t.name || '') + ' ' + (t.description || '')).toLowerCase();
        if (hay.indexOf(q) === -1) return false;
      }
      return true;
    });
  }

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text !== undefined && text !== null) n.textContent = text;
    return n;
  }

  function render() {
    var shown = visibleTrophies();
    listEl.innerHTML = '';

    shown.forEach(function (t) {
      var i = trophies.indexOf(t);
      var id = trophyId(t, i);
      var isEarned = earned.has(id);
      var masked = isHidden(t) && spoilersHidden && !isEarned;

      var card = el('article', 'trophy-card' + (isEarned ? ' earned' : '') + (masked ? ' masked' : ''));
      card.dataset.trophyId = id;

      var top = el('div', 'card-top');
      top.appendChild(el('span', 'grade grade-' + gradeName(t), gradeName(t)));
      top.appendChild(el('span', 'earned-mark', isEarned ? 'Earned ✓' : 'Not earned'));
      card.appendChild(top);

      card.appendChild(el('h3', 'trophy-name', masked ? 'Hidden Trophy' : (t.name || 'Untitled trophy')));
      card.appendChild(el('p', 'trophy-desc', masked
        ? 'Hidden — reveal spoilers to see this trophy.'
        : (t.description || '')));

      var flags = el('div', 'flags');
      if (isMissable(t)) flags.appendChild(el('span', 'flag', 'Missable'));
      if (isUnconfirmed(t)) flags.appendChild(el('span', 'flag unconfirmed', 'Unconfirmed'));
      if (isHidden(t)) flags.appendChild(el('span', 'flag hidden-flag', 'Hidden'));
      if (flags.childNodes.length) card.appendChild(flags);

      if (!masked) {
        var guide = el('details', 'guide');
        var summary = el('summary', null, 'How to unlock');
        guide.appendChild(summary);
        guide.appendChild(el('p', null, t.guide || 'No guide note yet for this trophy.'));
        card.appendChild(guide);
        if (t.source) card.appendChild(el('p', 'source', 'Source: ' + t.source));
      } else {
        card.appendChild(el('p', 'source', 'Source: hidden with the trophy.'));
      }

      var toggle = el('button', 'earn-toggle', isEarned ? 'Mark as not earned' : 'Mark as earned');
      toggle.type = 'button';
      toggle.addEventListener('click', function (ev) {
        ev.stopPropagation();
        toggleEarned(id);
      });
      card.appendChild(toggle);

      listEl.appendChild(card);
    });

    if (!shown.length) {
      emptyEl.hidden = false;
      emptyEl.textContent = onlineOnly
        ? 'No online trophies — Grand Theft Auto VI has 0 online trophies. Everything on this list is earned offline, solo.'
        : 'No trophies match these filters. Clear the search or a filter to see the list again.';
    } else {
      emptyEl.hidden = true;
    }

    countEl.textContent = 'Showing ' + shown.length + ' of ' + trophies.length +
      ' trophies · ' + earned.size + ' earned';
    renderProgress();
  }

  function renderProgress() {
    var total = trophies.length || 0;
    var done = earned.size;
    var pct = total ? Math.round((done / total) * 100) : 0;

    var byGrade = { Platinum: [0, 0], Gold: [0, 0], Silver: [0, 0], Bronze: [0, 0] };
    trophies.forEach(function (t, i) {
      var g = byGrade[gradeName(t)];
      if (!g) return;
      g[1] += 1;
      if (earned.has(trophyId(t, i))) g[0] += 1;
    });

    document.getElementById('stat-earned').textContent = done + ' / ' + total;
    document.getElementById('stat-percent').textContent = pct + '%';
    document.getElementById('stat-platinum').textContent = byGrade.Platinum[0] + ' / ' + byGrade.Platinum[1];
    document.getElementById('stat-gold').textContent = byGrade.Gold[0] + ' / ' + byGrade.Gold[1];
    document.getElementById('stat-silver').textContent = byGrade.Silver[0] + ' / ' + byGrade.Silver[1];
    document.getElementById('stat-bronze').textContent = byGrade.Bronze[0] + ' / ' + byGrade.Bronze[1];
    document.getElementById('progress-fill').style.width = pct + '%';
    document.getElementById('progress-note').textContent =
      total && done === total
        ? 'Platinum complete — Leonida Legend is yours.'
        : done === 0
          ? 'Tick a trophy below to start your run.'
          : done + ' down, ' + (total - done) + ' to go. The missable trophy sits in Chapter 1 — get it first.';
  }

  function toggleEarned(id) {
    if (earned.has(id)) earned.delete(id);
    else earned.add(id);
    saveEarned();
    render();
  }

  function setPressed(btn, on) {
    btn.setAttribute('aria-pressed', on ? 'true' : 'false');
  }

  function bindToggle(btn, get, set) {
    btn.addEventListener('click', function () {
      set(!get());
      setPressed(btn, get());
      render();
    });
  }

  bindToggle(missableBtn, function () { return missableOnly; }, function (v) { missableOnly = v; });
  bindToggle(onlineBtn, function () { return onlineOnly; }, function (v) { onlineOnly = v; });
  bindToggle(unconfirmedBtn, function () { return unconfirmedOnly; }, function (v) { unconfirmedOnly = v; });

  spoilerBtn.addEventListener('click', function () {
    spoilersHidden = !spoilersHidden;
    setPressed(spoilerBtn, spoilersHidden);
    spoilerBtn.textContent = spoilersHidden ? 'Spoilers hidden' : 'Spoilers shown';
    render();
  });

  searchEl.addEventListener('input', render);
  gradeEl.addEventListener('change', render);
  earnedEl.addEventListener('change', render);

  document.getElementById('export-btn').addEventListener('click', function () {
    var payload = {
      game: 'Grand Theft Auto VI',
      platform: 'PlayStation 5',
      earned: Array.from(earned),
      exportedAt: new Date().toISOString()
    };
    var blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'leonida-legend-earned.json';
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
    countEl.textContent = 'Exported ' + earned.size + ' earned trophies to leonida-legend-earned.json.';
  });

  document.getElementById('import-btn').addEventListener('click', function () {
    document.getElementById('import-file').click();
  });

  document.getElementById('import-file').addEventListener('change', function (ev) {
    var file = ev.target.files && ev.target.files[0];
    if (!file) return;
    var reader = new FileReader();
    reader.onload = function () {
      try {
        var parsed = JSON.parse(String(reader.result));
        var ids = Array.isArray(parsed) ? parsed : parsed.earned;
        if (!Array.isArray(ids)) throw new Error('no earned list');
        var known = new Set(trophies.map(function (t, i) { return trophyId(t, i); }));
        var next = new Set();
        ids.forEach(function (id) { if (known.has(id)) next.add(id); });
        earned = next;
        saveEarned();
        render();
        countEl.textContent = 'Imported ' + earned.size + ' earned trophies from ' + file.name + '.';
      } catch (e) {
        countEl.textContent = 'Could not import ' + file.name + ': not a Leonida Legend export file.';
      }
      ev.target.value = '';
    };
    reader.readAsText(file);
  });

  document.getElementById('reset-btn').addEventListener('click', function () {
    if (!window.confirm('Reset all progress? Every trophy goes back to unearned.')) return;
    earned = new Set();
    saveEarned();
    render();
    countEl.textContent = 'Progress reset — 0 trophies earned.';
  });

  fetch(DATA_URL)
    .then(function (res) {
      if (!res.ok) throw new Error('trophy list not found');
      return res.json();
    })
    .then(function (data) {
      trophies = Array.isArray(data) ? data : (data.trophies || []);
      if (!trophies.length) throw new Error('empty trophy list');
      render();
    })
    .catch(function () {
      errorEl.hidden = false;
      countEl.textContent = '';
    });
})();
