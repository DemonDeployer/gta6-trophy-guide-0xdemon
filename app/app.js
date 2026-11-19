// Leonida Legend — GTA VI trophy tracker.
// Loads app/data/trophies.json, renders every trophy with its guide and sources,
// and keeps the checklist in localStorage. Export/import move the checklist as a file.
// Spoiler mode (on by default) masks hidden trophies until they are earned or the
// setting is switched off. No network use: the only fetch is the local data file.
const KEY = 'leonida-legend-progress-v1';
const listEl = document.getElementById('trophy-list');
const emptyEl = document.getElementById('empty');
const countEl = document.getElementById('count-line');
const searchEl = document.getElementById('search');
const gradeEl = document.getElementById('grade');
const earnedFilterEl = document.getElementById('earned-filter');
const spoilersEl = document.getElementById('spoilers');
const chipsEl = document.getElementById('chips');

let earned = new Set();
try {
  earned = new Set(JSON.parse(localStorage.getItem(KEY) ?? '[]'));
} catch {
  earned = new Set();
}
let activeFilter = 'all';

const doc = await (await fetch('data/trophies.json')).json();
const trophies = doc.trophies.filter((t) => t && typeof t.name === 'string');

function save() {
  localStorage.setItem(KEY, JSON.stringify([...earned].sort()));
}

function gradeLabel(t) {
  return t.grade.charAt(0).toUpperCase() + t.grade.slice(1);
}

function kindLabel(t) {
  return { platinum: 'Platinum', completion: '100% completion', story: 'Story', activities: 'Activities', collectibles: 'Collectibles', crime: 'Crime', world: 'World' }[t.kind] ?? t.kind;
}

function matches(t) {
  const q = searchEl.value.trim().toLowerCase();
  if (q) {
    const hay = `${t.name} ${t.description} ${t.guide} ${t.tip ?? ''} ${t.kind}`.toLowerCase();
    if (!hay.includes(q)) return false;
  }
  if (gradeEl.value !== 'all' && t.grade !== gradeEl.value) return false;
  if (earnedFilterEl.value === 'earned' && !earned.has(t.name)) return false;
  if (earnedFilterEl.value === 'missing' && earned.has(t.name)) return false;
  if (activeFilter === 'story' && !t.tags.includes('story')) return false;
  if (activeFilter === 'missable' && !t.missable) return false;
  if (activeFilter === 'collectibles' && !t.tags.includes('collectibles')) return false;
  if (activeFilter === 'activities' && !t.tags.includes('activities')) return false;
  if (activeFilter === 'online') return false; // all 55 are single-player; none is online
  return true;
}

function render() {
  listEl.replaceChildren();
  let shown = 0;
  for (const t of trophies) {
    if (!matches(t)) continue;
    shown += 1;
    const isEarned = earned.has(t.name);
    const hideSpoiler = spoilersEl.checked && t.hidden && !isEarned;
    const card = document.createElement('article');
    card.className = `trophy grade-${t.grade}${isEarned ? ' earned' : ''}${t.missable ? ' missable' : ''}`;

    const top = document.createElement('div');
    top.className = 'trophy-top';
    const box = document.createElement('input');
    box.type = 'checkbox';
    box.checked = isEarned;
    box.setAttribute('aria-label', `Mark ${t.name} as earned`);
    box.addEventListener('change', () => {
      if (box.checked) earned.add(t.name);
      else earned.delete(t.name);
      save();
      render();
    });
    const name = document.createElement('h3');
    name.className = 'trophy-name';
    name.textContent = hideSpoiler ? 'Hidden trophy' : t.name;
    const num = document.createElement('span');
    num.className = 'num';
    num.textContent = ` #${t.id}`;
    name.append(num);
    top.append(box, name);
    card.append(top);

    const badges = document.createElement('div');
    badges.className = 'badge-row';
    const gradeBadge = document.createElement('span');
    gradeBadge.className = `badge ${t.grade}`;
    gradeBadge.textContent = gradeLabel(t);
    badges.append(gradeBadge);
    const kindBadge = document.createElement('span');
    kindBadge.className = 'badge kind-badge';
    kindBadge.textContent = kindLabel(t);
    badges.append(kindBadge);
    if (t.hidden && !hideSpoiler) {
      const b = document.createElement('span');
      b.className = 'badge hidden-badge';
      b.textContent = 'Hidden';
      badges.append(b);
    }
    if (t.missable) {
      const b = document.createElement('span');
      b.className = 'badge missable-badge';
      b.textContent = 'Possibly missable';
      badges.append(b);
    }
    if (isEarned) {
      const b = document.createElement('span');
      b.className = 'badge';
      b.textContent = 'Earned ✓';
      badges.append(b);
    }
    card.append(badges);

    if (hideSpoiler) {
      const mask = document.createElement('p');
      mask.className = 'spoiler-mask';
      mask.textContent = 'Hidden trophy — its name and guide stay hidden until you earn it or switch Hide spoilers off. It is one of the 28 hidden trophies, most of them story missions and chapters.';
      card.append(mask);
    } else {
      const offLabel = document.createElement('span');
      offLabel.className = 'official-label';
      offLabel.textContent = 'Official description';
      const off = document.createElement('p');
      off.className = 'official';
      off.textContent = `“${t.description}”`;
      const gLabel = document.createElement('span');
      gLabel.className = 'guide-label';
      gLabel.textContent = 'Guide';
      const guide = document.createElement('p');
      guide.className = 'guide-text';
      guide.textContent = t.guide;
      const tip = document.createElement('p');
      tip.className = 'tip';
      tip.innerHTML = '';
      const tipStrong = document.createElement('strong');
      tipStrong.textContent = 'Tip: ';
      tip.append(tipStrong, document.createTextNode(t.tip ?? ''));
      card.append(offLabel, off, gLabel, guide, tip);
      if (t.missable && t.missable_note) {
        const miss = document.createElement('p');
        miss.className = 'tip';
        const missStrong = document.createElement('strong');
        missStrong.textContent = 'Missable? ';
        miss.append(missStrong, document.createTextNode(t.missable_note));
        card.append(miss);
      }
      const sources = document.createElement('p');
      sources.className = 'sources';
      sources.textContent = 'Sources: ';
      (t.sources ?? []).forEach((s, i) => {
        if (i > 0) sources.append(document.createTextNode(' · '));
        const a = document.createElement('a');
        a.href = s.url;
        a.textContent = s.label;
        a.target = '_blank';
        a.rel = 'noopener';
        sources.append(a);
      });
      card.append(sources);
    }
    listEl.append(card);
  }
  countEl.textContent = `Showing ${shown} of ${trophies.length} trophies`;
  emptyEl.hidden = shown !== 0;
  document.getElementById('stat-earned').textContent = String(earned.size);
  document.getElementById('progress-fill').style.width = `${Math.round((earned.size / trophies.length) * 100)}%`;
  document.getElementById('progress-text').textContent =
    `${earned.size} of ${trophies.length} earned · ${Math.round((earned.size / trophies.length) * 100)}%` +
    (earned.size === trophies.length ? ' · Platinum! Congratulations, Leonida Legend.' : '');
}

document.getElementById('export').addEventListener('click', () => {
  const payload = { game: 'Grand Theft Auto VI', exported_at: new Date().toISOString(), earned: [...earned].sort() };
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' }));
  a.download = 'gta6-trophy-progress.json';
  a.click();
  URL.revokeObjectURL(a.href);
});

document.getElementById('import').addEventListener('change', async (e) => {
  const file = e.target.files?.[0];
  if (!file) return;
  try {
    const data = JSON.parse(await file.text());
    const names = Array.isArray(data) ? data : data.earned;
    if (!Array.isArray(names)) throw new Error('no earned list');
    const known = new Set(trophies.map((t) => t.name));
    earned = new Set(names.filter((n) => known.has(n)));
    save();
    render();
    document.getElementById('save-note').textContent = `Imported ${earned.size} earned trophies from ${file.name}. Progress saved in this browser.`;
  } catch {
    document.getElementById('save-note').textContent = `Could not import ${file.name}: not a trophy-progress file from this guide. Nothing was changed.`;
  }
  e.target.value = '';
});

document.getElementById('reset').addEventListener('click', () => {
  if (!window.confirm('Clear the whole checklist? This cannot be undone — export a backup first if you want one.')) return;
  earned = new Set();
  save();
  render();
});

chipsEl.addEventListener('click', (e) => {
  const btn = e.target.closest('.chip');
  if (!btn) return;
  activeFilter = btn.dataset.filter;
  chipsEl.querySelectorAll('.chip').forEach((c) => c.classList.toggle('active', c === btn));
  render();
});

for (const el of [searchEl, gradeEl, earnedFilterEl, spoilersEl]) {
  el.addEventListener('input', render);
  el.addEventListener('change', render);
}

render();
