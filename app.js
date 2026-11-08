const pages = {
  1: document.getElementById("page-1"),
  2: document.getElementById("page-2"),
  3: document.getElementById("page-3"),
  4: document.getElementById("page-4"),
};

const yesBtn = document.getElementById("yes");
const noBtn = document.getElementById("no");
const canvas = document.getElementById("confetti");
const ctx = canvas.getContext("2d");

let noClicks = 0;
let confettiOn = false;
let pieces = [];

function show(n) {
  Object.values(pages).forEach((page) => page.classList.remove("active"));
  pages[n].classList.add("active");
  document.body.classList.toggle("playing", n === 3);
  if (n === 4) startConfetti();
}

document.querySelectorAll("[data-next]").forEach((button) => {
  button.addEventListener("click", () => show(Number(button.dataset.next)));
});

noBtn.addEventListener("click", () => {
  noClicks += 1;
  const rect = noBtn.getBoundingClientRect();
  const width = rect.width;
  const height = rect.height;
  const pad = 8;
  const x = pad + Math.random() * Math.max(0, window.innerWidth - width - pad * 2);
  const y = pad + Math.random() * Math.max(0, window.innerHeight - height - pad * 2);

  noBtn.style.position = "fixed";
  noBtn.style.left = `${rect.left}px`;
  noBtn.style.top = `${rect.top}px`;
  noBtn.style.margin = "0";
  noBtn.style.zIndex = "30";

  requestAnimationFrame(() => {
    noBtn.style.left = `${x}px`;
    noBtn.style.top = `${y}px`;
  });

  const scale = Math.pow(1.38, noClicks);
  yesBtn.style.transform = `scale(${scale})`;
});

yesBtn.addEventListener("click", () => show(4));

function spawnKitties() {
  const sky = document.getElementById("sky");
  const count = 16;
  for (let i = 0; i < count; i += 1) {
    const kitty = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    kitty.setAttribute("class", "kitty-float");
    kitty.setAttribute("viewBox", "0 0 64 64");
    kitty.setAttribute("aria-hidden", "true");
    const size = 28 + Math.random() * 26;
    kitty.style.width = `${size}px`;
    kitty.style.height = `${size}px`;
    kitty.style.left = `${Math.random() * 100}%`;
    kitty.style.animationDuration = `${11 + Math.random() * 14}s`;
    kitty.style.animationDelay = `${-Math.random() * 18}s`;
    kitty.style.setProperty("--sway", `${-40 + Math.random() * 80}px`);
    const use = document.createElementNS("http://www.w3.org/2000/svg", "use");
    use.setAttribute("href", "#kitty");
    kitty.appendChild(use);
    sky.appendChild(kitty);
  }
}

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

function burst() {
  const colors = ["#ff4d88", "#ff8ab6", "#fff", "#ffd166", "#fb7185", "#fda4af", "#e11d48"];
  const amount = 140;
  for (let i = 0; i < amount; i += 1) {
    pieces.push({
      x: window.innerWidth / 2 + (Math.random() - 0.5) * 120,
      y: window.innerHeight / 2,
      vx: (Math.random() - 0.5) * 16,
      vy: -8 - Math.random() * 12,
      g: 0.18 + Math.random() * 0.12,
      size: 6 + Math.random() * 8,
      rot: Math.random() * Math.PI,
      spin: (Math.random() - 0.5) * 0.2,
      color: colors[i % colors.length],
      heart: Math.random() > 0.45,
      life: 220 + Math.random() * 80,
    });
  }
}

function drawHeart(x, y, size, color, rot) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rot);
  ctx.scale(size / 12, size / 12);
  ctx.beginPath();
  ctx.moveTo(0, 4);
  ctx.bezierCurveTo(-8, -2, -4, -10, 0, -5);
  ctx.bezierCurveTo(4, -10, 8, -2, 0, 4);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.restore();
}

function tick() {
  if (!confettiOn) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  pieces = pieces.filter((p) => p.life > 0 && p.y < canvas.height + 40);
  for (const p of pieces) {
    p.vy += p.g;
    p.x += p.vx;
    p.y += p.vy;
    p.vx *= 0.992;
    p.rot += p.spin;
    p.life -= 1;
    if (p.heart) drawHeart(p.x, p.y, p.size, p.color, p.rot);
    else {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.size / 2, -p.size / 3, p.size, p.size * 0.55);
      ctx.restore();
    }
  }
  if (pieces.length < 40 && Math.random() < 0.35) {
    const colors = ["#ff4d88", "#fff", "#ffd166", "#fb7185"];
    pieces.push({
      x: Math.random() * canvas.width,
      y: -20,
      vx: (Math.random() - 0.5) * 1.4,
      vy: 1.5 + Math.random() * 2.2,
      g: 0.01,
      size: 7 + Math.random() * 8,
      rot: Math.random() * Math.PI,
      spin: (Math.random() - 0.5) * 0.08,
      color: colors[Math.floor(Math.random() * colors.length)],
      heart: Math.random() > 0.4,
      life: 400,
    });
  }
  requestAnimationFrame(tick);
}

function startConfetti() {
  resizeCanvas();
  if (!confettiOn) {
    confettiOn = true;
    burst();
    tick();
  } else {
    burst();
  }
}

window.addEventListener("resize", () => {
  if (confettiOn) resizeCanvas();
});

spawnKitties();
