document.addEventListener("DOMContentLoaded", () => {
  console.log("music.js carregado");

  const API_KEY = "1432207ec6b699441f6555de4af24a2f";
  const BASE_URL = "https://ws.audioscrobbler.com/2.0/";

  const form = document.querySelector("form");
  const searchInput = document.querySelector("#search");

  const musicRow = document.querySelector(".music-row");
  const artistRow = document.querySelector(".artist-row");
  const albumRow = document.querySelector(".album-row");

  if (!form || !searchInput) {
    console.error("Form ou input não encontrado");
    return;
  }

  async function fetchAPI(params) {
    const url = `${BASE_URL}?${params}&api_key=${API_KEY}&format=json`;
    const res = await fetch(url);
    return res.json();
  }

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

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const query = searchInput.value.trim();
    if (!query) return;

    console.log("Buscando por:", query);

    musicRow.innerHTML = "";
    artistRow.innerHTML = "";
    albumRow.innerHTML = "";

    /* ================= MÚSICAS ================= */
    const trackData = await fetchAPI(
      `method=track.search&track=${encodeURIComponent(query)}&limit=10`
    );

    const tracks =
      trackData?.results?.trackmatches?.track || [];

    tracks.forEach((t, i) => {
      musicRow.appendChild(
        createCard(
          {
            image: t.image?.[2]?.["#text"] || "https://via.placeholder.com/300",
            title: t.name,
            subtitle: t.artist
          },
          i * 0.05
        )
      );
    });

    /* ================= ARTISTAS ================= */
    const artistData = await fetchAPI(
      `method=artist.search&artist=${encodeURIComponent(query)}&limit=10`
    );

    const artists =
      artistData?.results?.artistmatches?.artist || [];

    artists.forEach((a, i) => {
      artistRow.appendChild(
        createCard(
          {
            image: a.image?.[2]?.["#text"] || "https://via.placeholder.com/300",
            title: a.name,
            subtitle: "Artista"
          },
          i * 0.05
        )
      );
    });

    /* ================= ÁLBUNS ================= */
    const albumData = await fetchAPI(
      `method=album.search&album=${encodeURIComponent(query)}&limit=10`
    );

    const albums =
      albumData?.results?.albummatches?.album || [];

    albums.forEach((a, i) => {
      albumRow.appendChild(
        createCard(
          {
            image: a.image?.[2]?.["#text"] || "https://via.placeholder.com/300",
            title: a.name,
            subtitle: a.artist
          },
          i * 0.05
        )
      );
    });
  });
});
