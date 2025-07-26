document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("searchInput");
  const searchButton = document.getElementById("searchButton");
  const resultsContainer = document.getElementById("results");

  searchButton.addEventListener("click", async () => {
    const query = searchInput.value.trim();
    if (!query) {
      alert("Please enter a song name to search!");
      return;
    }

    const apiURL = `https://spotify-scraper-api.vercel.app/search?q=${encodeURIComponent(query)}&type=track&limit=10`;

    resultsContainer.innerHTML = "<p>Searching...</p>";

    try {
      const res = await fetch(apiURL);
      if (!res.ok) throw new Error(`API error: ${res.status}`);

      const data = await res.json();

      if (!data.tracks || data.tracks.length === 0) {
        resultsContainer.innerHTML = "<p>No results found.</p>";
        return;
      }

      resultsContainer.innerHTML = "";

      data.tracks.forEach(track => {
        const div = document.createElement("div");
        div.className = "track";
        div.innerHTML = `
          <img src="${track.album.images[0]?.url || ''}" alt="${track.name}" />
          <div>
            <p><strong>${track.name}</strong> - ${track.artists.map(a => a.name).join(", ")}</p>
            <p>Duration: ${msToMinutesAndSeconds(track.duration_ms)}</p>
            <a href="${track.external_urls.spotify}" target="_blank" rel="noopener">Open on Spotify</a>
            ${track.preview_url ? `<audio controls src="${track.preview_url}"></audio>` : `<p>No preview available</p>`}
          </div>
        `;
        resultsContainer.appendChild(div);
      });
    } catch (e) {
      resultsContainer.innerHTML = "<p>Error fetching results.</p>";
      console.error(e);
    }
  });

  function msToMinutesAndSeconds(ms) {
    const minutes = Math.floor(ms / 60000);
    const seconds = ((ms % 60000) / 1000).toFixed(0);
    return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
  }
});
