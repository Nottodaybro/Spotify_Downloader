document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("searchInput");
  const searchButton = document.getElementById("searchButton");
  const resultsContainer = document.getElementById("results");

  searchButton.addEventListener("click", async () => {
    const query = searchInput.value.trim();
    if (!query) {
      alert("Please enter a song name!");
      return;
    }

    resultsContainer.innerHTML = "<p>Searching...</p>";

    try {
      // Free Spotify search proxy API (returns tracks in JSON)
      const searchURL = `https://spotify-scraper.vercel.app/api/search?q=${encodeURIComponent(query)}&type=track&limit=10`;
      const res = await fetch(searchURL);
      if (!res.ok) throw new Error("Search API failed");

      const data = await res.json();

      if (!data.tracks || data.tracks.length === 0) {
        resultsContainer.innerHTML = "<p>No results found.</p>";
        return;
      }

      resultsContainer.innerHTML = "";

      data.tracks.forEach(track => {
        const div = document.createElement("div");
        div.className = "track";

        // Extract track info and Spotify ID for download
        const spotifyTrackId = track.id || getSpotifyIdFromUrl(track.url);
        const downloadApiUrl = `https://api.siputzx.my.id/api/d/spotify?url=https://open.spotify.com/track/${spotifyTrackId}`;

        div.innerHTML = `
          <img src="${track.album.images[0]?.url || ''}" alt="${track.name}" />
          <div>
            <p><strong>${track.name}</strong> - ${track.artists.map(a => a.name).join(", ")}</p>
            <a href="${track.url}" target="_blank" rel="noopener">Open on Spotify</a>
            <br />
            <button class="download-btn" data-url="${downloadApiUrl}">Download</button>
          </div>
        `;

        resultsContainer.appendChild(div);
      });

      // Attach event listeners to download buttons
      document.querySelectorAll(".download-btn").forEach(button => {
        button.addEventListener("click", async () => {
          const apiUrl = button.getAttribute("data-url");
          button.textContent = "Preparing download...";
          button.disabled = true;

          try {
            const res = await fetch(apiUrl);
            if (!res.ok) throw new Error("Download API error");

            const json = await res.json();

            if (json.status === true && json.download) {
              // Start download by navigating browser
              window.open(json.download, "_blank");
              button.textContent = "Download Started";
            } else {
              alert("Download not available for this track.");
              button.textContent = "Download";
              button.disabled = false;
            }
          } catch (err) {
            alert("Error preparing download.");
            button.textContent = "Download";
            button.disabled = false;
          }
        });
      });

    } catch (error) {
      resultsContainer.innerHTML = "<p>Error fetching search results.</p>";
      console.error(error);
    }
  });

  // Helper to extract Spotify track ID from URL
  function getSpotifyIdFromUrl(url) {
    const match = url.match(/track\/([a-zA-Z0-9]+)/);
    return match ? match[1] : "";
  }
});
