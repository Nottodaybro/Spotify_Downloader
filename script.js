document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("searchInput");
  const searchButton = document.getElementById("searchButton");
  const resultsContainer = document.getElementById("results");

  function getSpotifyTrackId(url) {
    const match = url.match(/track\/([a-zA-Z0-9]+)/);
    return match ? match[1] : "";
  }

  async function fetchTracks(query) {
    // Use a free public Spotify search API endpoint here
    // Example: https://spotify-search-api-example.vercel.app/search?query=...

    // Replace with a real working public API or your own backend URL.
    // For demo, using a free API for searching Spotify tracks:
    const apiUrl = `https://spotify-search-api-example.vercel.app/search?query=${encodeURIComponent(query)}`;

    const response = await fetch(apiUrl);
    if (!response.ok) throw new Error("Search API request failed.");
    const data = await response.json();
    return data.tracks || [];
  }

  async function downloadTrack(url, button) {
    if (!url) {
      alert("Song URL not found.");
      return;
    }

    const downloadApi = `https://api.siputzx.my.id/api/d/spotify?url=${encodeURIComponent(url)}`;

    button.disabled = true;
    button.textContent = "Downloading...";

    try {
      const response = await fetch(downloadApi);
      if (!response.ok) throw new Error(`Download API error ${response.status}`);
      const data = await response.json();
      if (data.status === true && data.download) {
        // Initiate download
        window.open(data.download, "_blank");
      } else {
        alert("Download failed, please try again later.");
      }
    } catch (err) {
      alert("An error occurred while downloading the song.");
      console.error(err);
    } finally {
      button.disabled = false;
      button.textContent = "Download";
    }
  }

  function playSong(songUrl) {
    const trackId = getSpotifyTrackId(songUrl);
    const playerContainer = document.getElementById(`spotify_player_${trackId}`);

    if (!playerContainer) return;

    // Clear any other players
    document.querySelectorAll("[id^='spotify_player_']").forEach(el => (el.innerHTML = ""));

    playerContainer.innerHTML = `
      <iframe src="https://open.spotify.com/embed/track/${trackId}" 
      width="300" height="80" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>
    `;
  }

  searchButton.addEventListener("click", async () => {
    const query = searchInput.value.trim();
    resultsContainer.innerHTML = "";

    if (!query) {
      alert("Please enter a song name or Spotify track URL.");
      return;
    }

    resultsContainer.innerHTML = "<p>Searching for songs...</p>";

    try {
      // If the input looks like a Spotify track URL, search by that track only
      const trackId = getSpotifyTrackId(query);
      let tracks;

      if (trackId) {
        // Search by track id
        tracks = await fetchTracks(trackId);
      } else {
        // Search by song name query
        tracks = await fetchTracks(query);
      }

      if (tracks.length === 0) {
        resultsContainer.innerHTML = "<p>No results found.</p>";
        return;
      }

      resultsContainer.innerHTML = "";
      tracks.forEach(track => {
        const trackElement = document.createElement("div");
        trackElement.className = "track";
        trackElement.innerHTML = `
          <img src="${track.image}" alt="${track.name}" />
          <div>
            <p><strong>${track.name}</strong> - ${track.artists}</p>
            <p>Duration: ${track.duration}</p>
            <b><a href="${track.link}" target="_blank" rel="noopener">Open in Spotify</a></b>
            <div class="buttons">
              <button class="play-button">Play</button>
              <button class="download-button">Download</button>
            </div>
            <div id="spotify_player_${getSpotifyTrackId(track.link)}" style="margin-top:10px;"></div>
          </div>
        `;

        // Add button handlers
        const playBtn = trackElement.querySelector(".play-button");
        const downloadBtn = trackElement.querySelector(".download-button");

        playBtn.addEventListener("click", () => playSong(track.link));
        downloadBtn.addEventListener("click", () => downloadTrack(track.link, downloadBtn));

        resultsContainer.appendChild(trackElement);
      });
    } catch (error) {
      console.error(error);
      resultsContainer.innerHTML = "<p>An error occurred while searching for songs.</p>";
    }
  });
});
