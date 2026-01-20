/* =========================
   GLOW SEGUIDOR DE MOUSE (CORRETO)
========================= */

const glowMain = document.querySelector(".glow-main");
const glowEcho = document.querySelector(".glow-echo");

let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;

// posição atual do glow
let currentX = mouseX;
let currentY = mouseY;

// força do atraso (quanto MENOR, mais rápido segue)
const FOLLOW_SPEED = 0.5;

document.addEventListener("mousemove", (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

function animateGlow() {
  // aproxima rápido do mouse (sem lag exagerado)
  currentX += (mouseX - currentX) * FOLLOW_SPEED;
  currentY += (mouseY - currentY) * FOLLOW_SPEED;

  if (glowMain) {
    glowMain.style.transform = `
      translate(${currentX}px, ${currentY}px)
      translate(-50%, -50%)
    `;
  }

  if (glowEcho) {
    glowEcho.style.transform = `
      translate(${currentX}px, ${currentY}px)
      translate(-50%, -50%)
    `;
  }

  requestAnimationFrame(animateGlow);
}

animateGlow();
