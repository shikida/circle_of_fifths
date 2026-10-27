const MAJOR = ['C', 'G', 'D', 'A', 'E', 'B', 'F♯', 'D♭', 'A♭', 'E♭', 'B♭', 'F'];
const MINOR = ['Am', 'Em', 'Bm', 'F♯m', 'C♯m', 'G♯m', 'E♭m', 'B♭m', 'Fm', 'Cm', 'Gm', 'Dm'];
const ACCIDENTALS = [0, 1, 2, 3, 4, 5, '6♯/6♭', 5, 4, 3, 2, 1];
const SVG_NS = 'http://www.w3.org/2000/svg';

function polar(r, deg) {
  const a = (deg - 90) * Math.PI / 180;
  return [r * Math.cos(a), r * Math.sin(a)];
}

function wedge(rIn, rOut, start, end) {
  const [x1, y1] = polar(rOut, start), [x2, y2] = polar(rOut, end);
  const [x3, y3] = polar(rIn, end), [x4, y4] = polar(rIn, start);
  return `M${x1} ${y1}A${rOut} ${rOut} 0 0 1 ${x2} ${y2}L${x3} ${y3}A${rIn} ${rIn} 0 0 0 ${x4} ${y4}Z`;
}

function describe(i) {
  const n = ACCIDENTALS[i];
  const sig = n === 0 ? 'no sharps or flats' : `${n} ${i < 6 ? 'sharp' : 'flat'}${n === 1 ? '' : 's'}`;
  return `${MAJOR[i]} major / ${MINOR[i]} minor — ${sig}`;
}

function el(name, attrs) {
  const e = document.createElementNS(SVG_NS, name);
  for (const k in attrs) e.setAttribute(k, attrs[k]);
  return e;
}

function build() {
  const svg = document.getElementById('circle');
  const info = document.getElementById('info');
  MAJOR.forEach((maj, i) => {
    const start = i * 30 - 15, end = i * 30 + 15;
    const g = el('g', { class: 'wedge' });
    const rings = [[85, 150, 'major', maj, 118], [35, 85, 'minor', MINOR[i], 60]];
    for (const [rIn, rOut, cls, label, rText] of rings) {
      g.appendChild(el('path', { d: wedge(rIn, rOut, start, end), class: cls }));
      const [x, y] = polar(rText, i * 30);
      const t = el('text', { x, y, class: cls === 'minor' ? 'minor-label' : '' });
      t.textContent = label;
      g.appendChild(t);
    }
    g.addEventListener('click', () => {
      svg.querySelectorAll('.selected').forEach(n => n.classList.remove('selected'));
      g.classList.add('selected');
      info.textContent = describe(i);
    });
    svg.appendChild(g);
  });
}

build();
