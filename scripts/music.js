const API_KEY = "1432207ec6b699441f6555de4af24a2f";
const BASE = "https://ws.audioscrobbler.com/2.0/";

const form = document.querySelector("form");
const input = document.querySelector("#search");

const musicRow = document.querySelector(".music-row");
const artistRow = document.querySelector(".artist-row");
const albumRow = document.querySelector(".album-row");

/* =========================
   FETCH HELPERS
========================= */
async function fetchAPI(params) {
  const url = `${BASE}?${params}&api_key=${API_KEY}&format=json`;
  const res = await fetch(url);
  return res.json();
}

/* =========================
   RENDER
========================= */
function createCard({ image, title, subtitle }, delay = 0) {
  const card = document.createElement("div");
  card.className = "card";
  card.style.animationDelay = `${delay}s`;

  card.innerHTML = `
    <img src="${image}">
    <h4>${title}</h4>
    <p>${subtitle}</p>
  `;

  return card;
}

/* =========================
   BUSCA
========================= */
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const query = input.value.trim();
  if (!query) return;

  musicRow.innerHTML = "";
  artistRow.innerHTML = "";
  albumRow.innerHTML = "";

  /* MÚSICAS */
  const tracks = await fetchAPI(`method=track.search&track=${query}&limit=10`);
  tracks.results.trackmatches.track.forEach((t, i) => {
    musicRow.appendChild(
      createCard(
        {
          image: t.image[2]["#text"] || "https://via.placeholder.com/300",
          title: t.name,
          subtitle: t.artist
        },
        i * 0.05
      )
    );
  });

  /* ARTISTAS */
  const artists = await fetchAPI(`method=artist.search&artist=${query}&limit=10`);
  artists.results.artistmatches.artist.forEach((a, i) => {
    artistRow.appendChild(
      createCard(
        {
          image: a.image[2]["#text"] || "https://via.placeholder.com/300",
          title: a.name,
          subtitle: "Artista"
        },
        i * 0.05
      )
    );
  });

  /* ÁLBUNS */
  const albums = await fetchAPI(`method=album.search&album=${query}&limit=10`);
  albums.results.albummatches.album.forEach((a, i) => {
    albumRow.appendChild(
      createCard(
        {
          image: a.image[2]["#text"] || "https://via.placeholder.com/300",
          title: a.name,
          subtitle: a.artist
        },
        i * 0.05
      )
    );
  });
});
