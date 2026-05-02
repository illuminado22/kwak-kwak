import { spawnBurst, spawnFallingPetals } from './effects.js';
 
const BLOOM_DURATION_MS = 900;   // total animation duration
const MSG_DELAY_MS      = 600;   // delay before message appears
const BURST_COUNT       = 48;    // particles on bloom
const PETAL_COUNT       = 24;
 
const ORIGIN_X = 100;
const ORIGIN_Y = 160;
 
const BLOOMED_ROTATION = {
  'petal-left':   -38,   // rotates outward to the left
  'petal-right':   38,   // rotates outward to the right
  'petal-center':   0,   // stays upright, just scales up slightly
};
 
// Closed rotation (degrees) for each petal
const CLOSED_ROTATION = {
  'petal-left':    0,
  'petal-right':   0,
  'petal-center':  0,
};

const hintText = document.getElementById('hint');
const stamen   = document.getElementById('stamen');
const bloomRing = document.getElementById('bloom-ring');
 
const petalLeft   = document.getElementById('petal-left');
const petalRight  = document.getElementById('petal-right');
const petalCenter = document.getElementById('petal-center');
 
// All 3 petals as an array for easy iteration
const allPetals = [petalLeft, petalRight, petalCenter];

let isBloomed   = false;
let animating   = false;
function buildTransform(deg, ox, oy, scale = 1) {
  const rad = (deg * Math.PI) / 180;
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);
 
  // matrix(a, b, c, d, e, f)
  const a = scale * cos;
  const b = scale * sin;
  const c = -scale * sin;
  const d = scale * cos;
  const e = ox - ox * a - oy * c;
  const f = oy - ox * b - oy * d;
 
  return `matrix(${a},${b},${c},${d},${e},${f})`;
}
 
function setPetalTransform(id, deg, scale = 1) {
  const el = document.getElementById(id);
  if (el) el.setAttribute('transform', buildTransform(deg, ORIGIN_X, ORIGIN_Y, scale));
}
 
function animatePetals(direction, onComplete) {
  const startTime = performance.now();
 
  // Define start and end rotations + scale for each petal
  const petals = [
    { id: 'petal-left',   from: direction === 'open' ? 0 : -38, to: direction === 'open' ? -38 : 0 },
    { id: 'petal-right',  from: direction === 'open' ? 0 :  38, to: direction === 'open' ?  38 : 0 },
    { id: 'petal-center', from: direction === 'open' ? 1 : 1.08, to: direction === 'open' ? 1.08 : 1, isScale: true },
  ];
 
  function easeInOut(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }
 
  function frame(now) {
    const elapsed  = now - startTime;
    const progress = Math.min(elapsed / BLOOM_DURATION_MS, 1);
    const eased    = easeInOut(progress);
 
    petals.forEach(p => {
      const value = p.from + (p.to - p.from) * eased;
      if (p.isScale) {
        // Center petal just scales, no rotation
        setPetalTransform(p.id, 0, value);
      } else {
        setPetalTransform(p.id, value);
      }
    });
 
    if (progress < 1) {
      requestAnimationFrame(frame);
    } else {
      animating = false;
      if (onComplete) onComplete();
    }
  }
 
  requestAnimationFrame(frame);
}
 
function bloom() {
  if (isBloomed || animating) return;
  isBloomed = true;
  animating = true;
 
  hintText.style.opacity = '0';
 
  bloomRing.style.transition = 'opacity 0.6s';
  bloomRing.setAttribute('opacity', '0.18');
 
  tulipSVG.classList.add('bloomed');

  animatePetals('open', () => {
    stamen.style.transition = 'opacity 0.8s';
    stamen.setAttribute('opacity', '1');

    setTimeout(() => {
      msgWrap.classList.add('visible');
      resetBtn.classList.add('visible');
    }, MSG_DELAY_MS);
  });

  const rect = tulipSVG.getBoundingClientRect();
  spawnBurst(
    rect.left + rect.width  * 0.5,
    rect.top  + rect.height * 0.42,
    BURST_COUNT
  );
  spawnFallingPetals(PETAL_COUNT);
}
 
function reset() {
  if (!isBloomed || animating) return;
  isBloomed = false;
  animating = true;
 
  msgWrap.classList.remove('visible');
  resetBtn.classList.remove('visible');
 
  stamen.style.transition = 'opacity 0.4s';
  stamen.setAttribute('opacity', '0');
 
  bloomRing.style.transition = 'opacity 0.4s';
  bloomRing.setAttribute('opacity', '0');

  animatePetals('close', () => {
    tulipSVG.classList.remove('bloomed');
    hintText.style.opacity = '1';
  });
}
 
allPetals.forEach(petal => {
  petal.addEventListener('click', bloom);
  petal.style.cursor = 'pointer';
});
 
tulipSVG.addEventListener('click', bloom);
 
resetBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  reset();
});
 