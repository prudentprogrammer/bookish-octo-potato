const form = document.querySelector('#piece-form');
const list = document.querySelector('#piece-list');
const setlist = document.querySelector('#setlist');
const clearButton = document.querySelector('#clear');
const generateButton = document.querySelector('#generate');

const repertoire = [];

const summarizePiece = (piece) => {
  const categoryLabel = piece.category.replace('-', ' ');
  return {
    title: piece.name,
    subtitle: `${categoryLabel} · ${piece.weight} · ${piece.style}`,
    notes: piece.notes?.trim(),
  };
};

const renderList = () => {
  list.innerHTML = '';

  if (repertoire.length === 0) {
    list.innerHTML = '<p class="hint">No pieces yet. Add your first raga or song.</p>';
    return;
  }

  repertoire.forEach((piece) => {
    const card = document.createElement('div');
    card.className = 'card';
    const summary = summarizePiece(piece);

    card.innerHTML = `
      <strong>${summary.title}</strong>
      <span>${summary.subtitle}</span>
      ${summary.notes ? `<span>Notes: ${summary.notes}</span>` : ''}
    `;

    list.appendChild(card);
  });
};

const pickRandom = (items) =>
  items.length ? items[Math.floor(Math.random() * items.length)] : null;

const buildSetlist = () => {
  setlist.innerHTML = '';

  if (repertoire.length === 0) {
    setlist.innerHTML =
      '<li>Add a few pieces to generate a balanced concert flow.</li>';
    return;
  }

  const light = repertoire.filter((piece) => piece.weight === 'light');
  const heavy = repertoire.filter((piece) => piece.weight === 'heavy');
  const semiClassical = repertoire.filter(
    (piece) => piece.category === 'semi-classical'
  );
  const folkDevotional = repertoire.filter((piece) =>
    ['folk', 'devotional'].includes(piece.category)
  );
  const vocal = repertoire.filter((piece) =>
    ['vocal (gayaki)', 'both'].includes(piece.style)
  );
  const instrumental = repertoire.filter((piece) =>
    ['instrumental', 'both'].includes(piece.style)
  );

  const balanced = [];

  if (light.length || heavy.length) {
    balanced.push(pickRandom(light) || pickRandom(repertoire));
    balanced.push(pickRandom(heavy) || pickRandom(repertoire));
  }

  const vocalPick = pickRandom(vocal);
  if (vocalPick && !balanced.includes(vocalPick)) {
    balanced.push(vocalPick);
  }

  const instrumentalPick = pickRandom(instrumental);
  if (instrumentalPick && !balanced.includes(instrumentalPick)) {
    balanced.push(instrumentalPick);
  }

  const semiPick = pickRandom(semiClassical) || pickRandom(folkDevotional);
  if (semiPick && !balanced.includes(semiPick)) {
    balanced.push(semiPick);
  }

  if (balanced.length === 0) {
    balanced.push(pickRandom(repertoire));
  }

  balanced.forEach((piece, index) => {
    const item = document.createElement('li');
    const summary = summarizePiece(piece);
    item.innerHTML = `
      <strong>${index + 1}. ${summary.title}</strong><br />
      <span>${summary.subtitle}</span>
      ${summary.notes ? `<br /><em>${summary.notes}</em>` : ''}
    `;
    setlist.appendChild(item);
  });
};

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const data = new FormData(form);
  const piece = {
    name: data.get('name').toString().trim(),
    category: data.get('category').toString(),
    weight: data.get('weight').toString(),
    style: data.get('style').toString(),
    notes: data.get('notes').toString(),
  };

  if (!piece.name) {
    return;
  }

  repertoire.push(piece);
  form.reset();
  renderList();
  buildSetlist();
});

clearButton.addEventListener('click', () => {
  repertoire.length = 0;
  renderList();
  buildSetlist();
});

generateButton.addEventListener('click', buildSetlist);

renderList();
