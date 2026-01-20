// Gerador de música procedural
class ProceduralMusicGenerator {
  constructor() {
    this.audioContext = null;
    this.isPlaying = false;
    this.currentSequence = [];
    this.bpm = 120;
    this.currentStep = 0;
    this.intervalId = null;
  }

  init() {
    this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }

  // Escalas musicais
  scales = {
    major: [0, 2, 4, 5, 7, 9, 11, 12],
    minor: [0, 2, 3, 5, 7, 8, 10, 12],
    pentatonic: [0, 2, 4, 7, 9, 12]
  };

  // Gera uma melodia procedural
  generateMelody(trackName) {
    const scale = this.scales.major;
    const baseNote = 220; // A3
    const melody = [];

    // Criar padrão baseado no nome da música (hash simples)
    let hash = 0;
    for (let i = 0; i < trackName.length; i++) {
      hash = ((hash << 5) - hash) + trackName.charCodeAt(i);
      hash = hash & hash; // Converte para 32 bits
    }

    // Gerar 16 notas
    for (let i = 0; i < 16; i++) {
      const noteIndex = Math.abs(hash + i * 7) % scale.length;
      const octave = Math.floor(i / 4) - 1; // Variação de oitava
      const frequency = baseNote * Math.pow(2, (scale[noteIndex] / 12) + octave);

      // Duração baseada no hash
      const duration = [0.25, 0.5, 0.5, 1][Math.abs(hash + i) % 4];

      melody.push({
        frequency: frequency,
        duration: duration,
        delay: i * 0.25 // Ritmo constante
      });
    }

    return melody;
  }

  // Toca uma nota
  playNote(frequency, duration, startTime = 0) {
    if (!this.audioContext) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    // Envelope ADSR simples
    const now = this.audioContext.currentTime + startTime;
    oscillator.frequency.setValueAtTime(frequency, now);

    // Ataque suave
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.3, now + 0.01);

    // Decay/Release
    gainNode.gain.setValueAtTime(0.3, now + duration * 0.8);
    gainNode.gain.linearRampToValueAtTime(0, now + duration);

    oscillator.type = 'sine';
    oscillator.start(now);
    oscillator.stop(now + duration);
  }

  // Toca uma melodia completa
  playMelody(melody) {
    if (!this.audioContext) return;

    melody.forEach(note => {
      this.playNote(note.frequency, note.duration, note.delay);
    });
  }

  // Inicia playback procedural
  startPlayback(trackName) {
    if (this.isPlaying) return;

    this.currentSequence = this.generateMelody(trackName);
    this.isPlaying = true;
    this.currentStep = 0;

    // Tocar a melodia em loop
    this.playMelody(this.currentSequence);

    // Continuar tocando em loop
    this.intervalId = setInterval(() => {
      this.playMelody(this.currentSequence);
    }, (this.currentSequence.length * 0.25) * 1000); // Tempo baseado na melodia
  }

  // Para o playback
  stopPlayback() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.isPlaying = false;
  }
}

// Instância global do gerador
const musicGenerator = new ProceduralMusicGenerator();

// Inicializar no primeiro clique
document.addEventListener('click', () => {
  if (!musicGenerator.audioContext) {
    musicGenerator.init();
  }
}, { once: true });

// Player de áudio global
let currentAudio = null;
let currentTrackElement = null;
let currentTracks = [];
let mockAudioContext = null;
let mockOscillator = null;
let isPlayingMock = false;

// Carregar tracks reais no carregamento da página
document.addEventListener("DOMContentLoaded", async () => {
  if (window.location.pathname.includes('index.html') || window.location.pathname.endsWith('/') || window.location.pathname === '') {
    await loadPopularTracks();
  }
});

// Carregar tracks populares para "Músicas em alta"
async function loadPopularTracks() {
  console.log('🎵 Usando dados mockados (API SoundCloud não disponível)');

  // Dados mockados para demonstração
  const mockTracks = [
    {
      title: "Stolen Dance",
      user: { username: "Milky Chance" },
      artwork_url: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop",
      stream_url: "mock-url-1",
      duration: 300000
    },
    {
      title: "Sugar",
      user: { username: "Robin Schulz" },
      artwork_url: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&h=300&fit=crop",
      stream_url: "mock-url-2",
      duration: 215000
    },
    {
      title: "Wake Me Up",
      user: { username: "Avicii" },
      artwork_url: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop",
      stream_url: "mock-url-3",
      duration: 247000
    },
    {
      title: "Seve",
      user: { username: "Tez Cadey" },
      artwork_url: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&h=300&fit=crop",
      stream_url: "mock-url-4",
      duration: 208000
    },
    {
      title: "Rather Be",
      user: { username: "Clean Bandit" },
      artwork_url: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop",
      stream_url: "mock-url-5",
      duration: 228000
    }
  ];

  currentTracks = mockTracks;

  const tracksList = document.querySelector('.tracks-list');
  if (tracksList) {
    tracksList.innerHTML = '';
    mockTracks.forEach((track, index) => {
      const item = document.createElement('div');
      item.className = 'track-item';
      item.innerHTML = `
        <div class="track-number">${index + 1}</div>
        <img src="${track.artwork_url || 'https://via.placeholder.com/40'}" alt="Track" />
        <div class="track-info">
          <h4>${track.title}</h4>
          <p>${track.user.username}</p>
        </div>
        <div class="track-duration">${formatDuration(track.duration)}</div>
        <button class="play-btn" onclick="playTrack(${index}, this)">▶</button>
      `;
      tracksList.appendChild(item);
    });
  }
}

// Toggle Sidebar
function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  sidebar.classList.toggle('collapsed');
}

// Navegação entre seções
function showSection(section) {
  document.querySelectorAll('.section-container').forEach(el => el.classList.remove('active'));
  document.getElementById(section + '-section').classList.add('active');
  
  document.querySelectorAll('.sidebar-nav a').forEach(el => el.classList.remove('active'));
  event.target.classList.add('active');
}

// Busca
async function searchTracks() {
  const query = document.getElementById('search-input').value;
  if (query.length < 3) return;

  const results = document.getElementById('search-results');
  results.innerHTML = '<p>🔍 Buscando...</p>';

  // Dados mockados para busca
  const mockTracks = [
    {
      title: "Stolen Dance",
      user: { username: "Milky Chance" },
      artwork_url: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop",
      stream_url: "mock-url-1",
      duration: 300000
    },
    {
      title: "Sugar",
      user: { username: "Robin Schulz" },
      artwork_url: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&h=300&fit=crop",
      stream_url: "mock-url-2",
      duration: 215000
    },
    {
      title: "Wake Me Up",
      user: { username: "Avicii" },
      artwork_url: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop",
      stream_url: "mock-url-3",
      duration: 247000
    },
    {
      title: "Seve",
      user: { username: "Tez Cadey" },
      artwork_url: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&h=300&fit=crop",
      stream_url: "mock-url-4",
      duration: 208000
    },
    {
      title: "Rather Be",
      user: { username: "Clean Bandit" },
      artwork_url: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop",
      stream_url: "mock-url-5",
      duration: 228000
    },
    {
      title: "Summer",
      user: { username: "Calvin Harris" },
      artwork_url: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&h=300&fit=crop",
      stream_url: "mock-url-6",
      duration: 223000
    }
  ];

  // Simular delay de busca
  setTimeout(() => {
    const filteredTracks = mockTracks.filter(track =>
      track.title.toLowerCase().includes(query.toLowerCase()) ||
      track.user.username.toLowerCase().includes(query.toLowerCase())
    );

    currentTracks = filteredTracks;

    results.innerHTML = '';
    if (filteredTracks.length === 0) {
      results.innerHTML = '<p>❌ Nenhuma música encontrada para "' + query + '"</p>';
      return;
    }

    filteredTracks.forEach((track, index) => {
      const item = document.createElement('div');
      item.className = 'track-item';
      item.innerHTML = `
        <img src="${track.artwork_url || 'https://via.placeholder.com/40'}" alt="Track" />
        <div class="track-info">
          <h4>${track.title}</h4>
          <p>${track.user.username}</p>
        </div>
        <div class="track-duration">${formatDuration(track.duration)}</div>
        <button class="play-btn" onclick="playTrack(${index}, this)">▶</button>
      `;
      results.appendChild(item);
    });
  }, 500);
}

function formatDuration(ms) {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

// Biblioteca
function showLibraryTab(tab) {
  const content = document.getElementById('library-content');
  content.innerHTML = `<p>Conteúdo de ${tab}</p>`;
  // Aqui você pode carregar dados reais
}

// Login
function showLogin() {
  document.getElementById('login-modal').style.display = 'block';
}

function closeModal() {
  document.querySelectorAll('.modal').forEach(modal => modal.style.display = 'none');
}

function login(event) {
  event.preventDefault();
  alert('Login simulado');
  closeModal();
}

function loginWithSoundCloud() {
  // Redirecionar para OAuth do SoundCloud
  window.location.href = `https://soundcloud.com/connect?client_id=${SOUNDCLOUD_CLIENT_ID}&redirect_uri=YOUR_REDIRECT_URI&response_type=code`;
}

// Criar Playlist
function showCreatePlaylist() {
  document.getElementById('create-playlist-modal').style.display = 'block';
}

function createPlaylist(event) {
  event.preventDefault();
  const name = document.getElementById('playlist-name').value;
  const desc = document.getElementById('playlist-description').value;
  alert(`Playlist "${name}" criada!`);
  closeModal();
  // Adicionar à sidebar
}

// Reproduzir track
function playTrack(trackIndex, buttonElement) {
  const track = currentTracks[trackIndex];
  if (!track) return;

  // Para dados mockados, usar música procedural
  if (track.stream_url && track.stream_url.startsWith('mock-url')) {
    console.log('🎵 Tocando música procedural:', track.title);

    // Parar áudio anterior se existir
    if (currentAudio) {
      currentAudio.pause();
      currentAudio = null;
    }
    musicGenerator.stopPlayback();

    // Iniciar música procedural
    musicGenerator.startPlayback(track.title);

    // Simular mudança visual
    if (buttonElement) {
      buttonElement.textContent = '⏸';
      currentTrackElement = buttonElement;
    }

    // Atualizar player UI
    document.getElementById('current-track-title').textContent = track.title;
    document.getElementById('current-track-artist').textContent = track.user.username;
    document.getElementById('current-track-image').src = track.artwork_url || 'https://via.placeholder.com/40';
    document.getElementById('play-pause-btn').textContent = '⏸';
    document.getElementById('duration').textContent = formatDuration(track.duration);

    // Simular progresso
    let progress = 0;
    const progressInterval = setInterval(() => {
      progress += 1;
      if (progress <= 100) {
        document.getElementById('progress-bar').value = progress;
        document.getElementById('current-time').textContent = formatDuration((progress / 100) * track.duration);
      } else {
        clearInterval(progressInterval);
        musicGenerator.stopPlayback();
        if (buttonElement) {
          buttonElement.textContent = '▶';
        }
        document.getElementById('play-pause-btn').textContent = '▶';
        document.getElementById('progress-bar').value = 0;
        document.getElementById('current-time').textContent = '0:00';
        currentTrackElement = null;
      }
    }, track.duration / 100);

    return;
  }

  // Para URLs reais, usar Audio normal
  const streamUrl = `${track.stream_url}?client_id=${SOUNDCLOUD_CLIENT_ID}`;

  if (currentAudio) {
    currentAudio.pause();
    if (currentTrackElement) {
      currentTrackElement.textContent = '▶';
    }
  }

  if (currentAudio && currentTrackElement === buttonElement) {
    // Pausar se for o mesmo
    togglePlayPause();
    return;
  }

  currentAudio = new Audio(streamUrl);
  currentAudio.play();
  if (buttonElement) {
    buttonElement.textContent = '⏸';
    currentTrackElement = buttonElement;
  }

  // Atualizar player UI
  document.getElementById('current-track-title').textContent = track.title;
  document.getElementById('current-track-artist').textContent = track.user.username;
  document.getElementById('current-track-image').src = track.artwork_url || 'https://via.placeholder.com/40';

  document.getElementById('play-pause-btn').textContent = '⏸';

  // Atualizar barra de progresso
  currentAudio.ontimeupdate = updateProgress;
  currentAudio.onloadedmetadata = () => {
    document.getElementById('duration').textContent = formatDuration(currentAudio.duration * 1000);
  };

  currentAudio.onended = () => {
    if (buttonElement) {
      buttonElement.textContent = '▶';
    }
    document.getElementById('play-pause-btn').textContent = '▶';
    currentAudio = null;
    currentTrackElement = null;
  };
}

// Player controls
// Player controls
function togglePlayPause() {
  if (!currentAudio && !currentTrackElement && !musicGenerator.isPlaying) return;

  // Se está tocando música procedural, pausar/retomar
  if (musicGenerator.isPlaying) {
    musicGenerator.stopPlayback();
    document.getElementById('play-pause-btn').textContent = '▶';
    if (currentTrackElement) {
      currentTrackElement.textContent = '▶';
    }
    return;
  }

  // Se há uma música selecionada mas não está tocando, iniciar
  if (currentTrackElement && currentTracks.length > 0) {
    const trackIndex = Array.from(document.querySelectorAll('.play-btn')).indexOf(currentTrackElement);
    if (trackIndex >= 0) {
      playTrack(trackIndex, currentTrackElement);
    }
    return;
  }

  // Se não há áudio real (dados mockados pausados), apenas alternar visual
  if (!currentAudio) {
    const btn = document.getElementById('play-pause-btn');
    if (btn.textContent === '▶') {
      btn.textContent = '⏸';
      if (currentTrackElement) {
        currentTrackElement.textContent = '⏸';
      }
    } else {
      btn.textContent = '▶';
      if (currentTrackElement) {
        currentTrackElement.textContent = '▶';
      }
    }
    return;
  }

  // Para áudio real
  if (currentAudio.paused) {
    currentAudio.play();
    document.getElementById('play-pause-btn').textContent = '⏸';
    if (currentTrackElement) {
      currentTrackElement.textContent = '⏸';
    }
  } else {
    currentAudio.pause();
    document.getElementById('play-pause-btn').textContent = '▶';
    if (currentTrackElement) {
      currentTrackElement.textContent = '▶';
    }
  }
}

function updateProgress() {
  if (!currentAudio) return;
  
  const progress = (currentAudio.currentTime / currentAudio.duration) * 100;
  document.getElementById('progress-bar').value = progress;
  document.getElementById('current-time').textContent = formatDuration(currentAudio.currentTime * 1000);
}

function seekTrack(value) {
  if (!currentAudio) return;
  
  const time = (value / 100) * currentAudio.duration;
  currentAudio.currentTime = time;
}

function previousTrack() {
  // Implementar navegação para track anterior
  console.log('Previous track');
}

function nextTrack() {
  // Implementar navegação para próximo track
  console.log('Next track');
}

// Fechar modais ao clicar fora
window.onclick = function(event) {
  if (event.target.classList.contains('modal')) {
    closeModal();
  }
}
