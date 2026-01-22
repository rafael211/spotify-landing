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

/* =========================
   BACKGROUND WAVES ANIMATION
========================= */

class BackgroundWaves {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    
    this.ctx = this.canvas.getContext('2d');
    this.points = [];
    this.time = 0;
    this.isMuted = false;
    this.init();
    this.animate();
  }

  init() {
    this.resize();
    window.addEventListener('resize', () => this.resize());
    
    // Criar pontos para as ondas
    const numPoints = 200;
    for (let i = 0; i < numPoints; i++) {
      this.points.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        baseX: Math.random() * this.canvas.width,
        baseY: Math.random() * this.canvas.height,
        radius: Math.random() * 2 + 1,
        speed: Math.random() * 0.02 + 0.01,
        amplitude: Math.random() * 50 + 20,
        frequency: Math.random() * 0.01 + 0.005
      });
    }
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  updatePoints(frequencyData) {
    const bass = frequencyData ? this.getAverageVolume(frequencyData, 0, 10) / 255 : 0;
    const mid = frequencyData ? this.getAverageVolume(frequencyData, 10, 50) / 255 : 0;
    const treble = frequencyData ? this.getAverageVolume(frequencyData, 50, 128) / 255 : 0;

    this.points.forEach((point, index) => {
      if (this.isMuted) {
        // Movimento sutil quando mutado
        point.x = point.baseX + Math.sin(this.time * point.speed + index) * 10;
        point.y = point.baseY + Math.cos(this.time * point.speed + index) * 10;
      } else {
        // Movimento sincronizado com música
        const wave1 = Math.sin(this.time * point.frequency + index * 0.1) * point.amplitude * (1 + bass);
        const wave2 = Math.cos(this.time * point.frequency * 0.7 + index * 0.15) * point.amplitude * 0.5 * (1 + mid);
        const wave3 = Math.sin(this.time * point.frequency * 1.3 + index * 0.05) * point.amplitude * 0.3 * (1 + treble);
        
        point.x = point.baseX + wave1 + wave2 + wave3;
        point.y = point.baseY + wave1 * 0.5 + wave2 * 0.8 + wave3 * 0.6;
      }
    });
  }

  getAverageVolume(array, start, end) {
    let sum = 0;
    for (let i = start; i < end; i++) {
      sum += array[i];
    }
    return sum / (end - start);
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Desenhar conexões entre pontos próximos para criar ondas
    this.ctx.strokeStyle = 'rgba(4, 63, 153, 0.1)';
    this.ctx.lineWidth = 1;
    
    for (let i = 0; i < this.points.length; i++) {
      for (let j = i + 1; j < this.points.length; j++) {
        const dx = this.points[i].x - this.points[j].x;
        const dy = this.points[i].y - this.points[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 100) {
          this.ctx.beginPath();
          this.ctx.moveTo(this.points[i].x, this.points[i].y);
          this.ctx.lineTo(this.points[j].x, this.points[j].y);
          this.ctx.stroke();
        }
      }
    }
    
    // Desenhar pontos
    this.points.forEach(point => {
      this.ctx.beginPath();
      this.ctx.arc(point.x, point.y, point.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = this.isMuted ? 'rgba(4, 63, 153, 0.3)' : 'rgba(4, 63, 153, 0.6)';
      this.ctx.fill();
    });
  }

  animate() {
    this.time += 0.05;
    
    // Obter dados de frequência se música estiver tocando
    let frequencyData = null;
    if (typeof musicGenerator !== 'undefined' && musicGenerator.audioContext && musicGenerator.isPlaying) {
      frequencyData = musicGenerator.getFrequencyData();
      this.isMuted = false;
    } else if (typeof currentAudio !== 'undefined' && currentAudio && !currentAudio.paused) {
      frequencyData = typeof getRealAudioFrequencyData !== 'undefined' ? getRealAudioFrequencyData() : null;
      this.isMuted = false;
    } else {
      this.isMuted = true;
    }
    
    this.updatePoints(frequencyData);
    this.draw();
    
    requestAnimationFrame(() => this.animate());
  }
}

// Inicializar quando DOM carregar
document.addEventListener('DOMContentLoaded', () => {
  // Aguardar music.js carregar
  const initWaves = () => {
    if (typeof musicGenerator !== 'undefined') {
      new BackgroundWaves('background-waves');
    } else {
      setTimeout(initWaves, 100);
    }
  };
  initWaves();
});
