
const STAR_COUNT      = 130;
const PETAL_COLORS    = ['#f9a8d4', '#f472b6', '#fce7f3', '#fda4c8', '#ec4899', '#fdf2f8'];
const BURST_COLORS    = ['#f9a8d4', '#f472b6', '#ec4899', '#fce7f3', '#fde68a', '#ffffff', '#db2777'];
const AMBIENT_INTERVAL_MS = 3500;
export function initStars() {
  const container = document.getElementById('stars');
  if (!container) return;
 
  for (let i = 0; i < STAR_COUNT; i++) {
    const star = document.createElement('div');
    star.className = 'star';
 
    const size = Math.random() * 2.2 + 0.5;
 
    star.style.cssText = [
      `width:${size}px`,
      `height:${size}px`,
      `left:${Math.random() * 100}%`,
      `top:${Math.random() * 100}%`,
      `--d:${(Math.random() * 3 + 1.5).toFixed(1)}s`,
      `--o:${(Math.random() * 0.55 + 0.15).toFixed(2)}`,
      `animation-delay:${(Math.random() * 5).toFixed(1)}s`,
    ].join(';');
 
    container.appendChild(star);
  }
}
export function spawnBurst(x, y, count) {
  for (let i = 0; i < count; i++) {
    const dot   = document.createElement('div');
    dot.className = 'burst-dot';
 
    const angle = Math.random() * Math.PI * 2;
    const dist  = 50 + Math.random() * 100;
    const size  = 5 + Math.random() * 10;
    const dur   = (0.5 + Math.random() * 0.6).toFixed(2) + 's';
    const color = BURST_COLORS[Math.floor(Math.random() * BURST_COLORS.length)];
 
    dot.style.cssText = [
      `left:${x}px`,
      `top:${y}px`,
      `width:${size}px`,
      `height:${size}px`,
      `background:${color}`,
      `--tx:${Math.cos(angle) * dist}px`,
      `--ty:${Math.sin(angle) * dist}px`,
      `--dur:${dur}`,
    ].join(';');
 
    document.body.appendChild(dot);
    dot.addEventListener('animationend', () => dot.remove());
  }
}
export function spawnFallingPetals(count) {
  for (let i = 0; i < count; i++) {
    setTimeout(() => {
      const petal = document.createElement('div');
      petal.className = 'fall-petal';
 
      const w     = 10 + Math.random() * 16;
      const color = PETAL_COLORS[Math.floor(Math.random() * PETAL_COLORS.length)];
      const dur   = (3 + Math.random() * 4).toFixed(1) + 's';
 
      petal.style.cssText = [
        `left:${5 + Math.random() * 88}vw`,
        `top:-20px`,
        `width:${w}px`,
        `height:${(w * 0.65).toFixed(1)}px`,
        `background:${color}`,
        `animation-duration:${dur}`,
        `opacity:0.75`,
        `transform:rotate(${Math.floor(Math.random() * 360)}deg)`,
      ].join(';');
 
      document.body.appendChild(petal);
      petal.addEventListener('animationend', () => petal.remove());
    }, i * 120);
  }
}
export function startAmbientPetals() {
  setInterval(() => spawnFallingPetals(2), AMBIENT_INTERVAL_MS);
}
 
initStars();
startAmbientPetals();
 