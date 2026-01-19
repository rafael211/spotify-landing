/* =========================
   ANIMAÇÃO DE ENTRADA (HERO)
========================= */
window.addEventListener("DOMContentLoaded", () => {
  const hero = document.querySelector(".hero");
  if (!hero) return;

  // marca estado inicial (invisível)
  hero.setAttribute("data-animate", "");

  // força o browser a renderizar o estado inicial
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      hero.classList.add("animate");
    });
  });
});

/* =========================
   GLOW PRINCIPAL + RASTRO
========================= */
const glowMain = document.querySelector(".glow-main");

let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;
let glowX = mouseX;
let glowY = mouseY;

let lastTraceTime = 0;

document.addEventListener("mousemove", (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;

  const now = performance.now();

  // limita criação de rastro (performance)
  if (now - lastTraceTime > 30) {
    lastTraceTime = now;

    const trace = document.createElement("div");
    trace.className = "glow-trace";
    trace.style.left = `${glowX}px`;
    trace.style.top = `${glowY}px`;

    document.body.appendChild(trace);

    setTimeout(() => {
      trace.remove();
    }, 900);
  }
});

function animateGlow() {
  glowX += (mouseX - glowX) * 0.18;
  glowY += (mouseY - glowY) * 0.18;

  if (glowMain) {
    glowMain.style.left = `${glowX}px`;
    glowMain.style.top = `${glowY}px`;
  }

  requestAnimationFrame(animateGlow);
}

animateGlow();

/* =========================
   INTERAÇÃO SUTIL (UI PULSE)
========================= */
const input = document.querySelector("#search");
const button = document.querySelector("button");

function pulse(intensity) {
  document.documentElement.style.setProperty("--ui-pulse", intensity);
}

if (input) {
  input.addEventListener("focus", () => pulse(1.04));
  input.addEventListener("blur", () => pulse(1));
}

if (button) {
  button.addEventListener("mouseenter", () => pulse(1.06));
  button.addEventListener("mouseleave", () => pulse(1));
}
