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

    const apiURL = `https://iyaudah-iya.vercel.app/spotify/search?query=${encodeURIComponent(query)}`;

    try {
      resultsContainer.innerHTML = "<p>Searching for songs...</p>";
      const response = await fetch(apiURL);

      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

      const data = await response.json();

      if (!data.length || data.length === 0) {
        resultsContainer.innerHTML = "<p>No results found.</p>";
        return;
      }

      resultsContainer.innerHTML = "";

      data.forEach(track => {
        const trackElement = document.createElement("div");
        trackElement.classList.add("track");

        trackElement.innerHTML = `
          <img src="${track.image}" alt="${track.name}" />
          <div>
            <p><strong>${track.name}</strong> - ${track.artists}</p>
            <p>Duration: ${track.duration}</p>
            <a href="${track.link}" target="_blank">Open in Spotify</a>
            <div class="buttons">
              <button class="play-button" onclick="playSong('${track.link}')">
                <i class="fas fa-play"></i> Play
              </button>
              <button class="download-button" onclick="downloadSong('${track.link}')">
                <i class="fas fa-download"></i> Download
              </button>
            </div>
            <div id="spotify_player_${getSpotifyTrackId(track.link)}"></div>
          </div>
        `;

        resultsContainer.appendChild(trackElement);
      });
    } catch (error) {
      console.error("Search error:", error);
      resultsContainer.innerHTML = "<p>An error occurred while searching for songs.</p>";
    }
  });
});

async function downloadSong(songUrl) {
  if (!songUrl) {
    alert("Song URL not found.");
    return;
  }

  const downloadApi = `https://api.siputzx.my.id/api/d/spotify?url=${encodeURIComponent(songUrl)}`;

  try {
    const response = await fetch(downloadApi);

    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

    const data = await response.json();

    if (data.status === true && data.download) {
      // Redirect browser to download URL
      window.location.href = data.download;
    } else {
      alert("Download failed, please try again later.");
    }
  } catch (error) {
    console.error("Download error:", error);
    alert("An error occurred while downloading the song.");
  }
}

function playSong(songUrl) {
  const trackId = getSpotifyTrackId(songUrl);
  const playerContainer = document.getElementById(`spotify_player_${trackId}`);

  if (!playerContainer) {
    console.error("Player container not found.");
    return;
  }

  // Clear other players
  document.querySelectorAll("[id^='spotify_player_']").forEach(el => (el.innerHTML = ""));

  playerContainer.innerHTML = `
    <iframe src="https://open.spotify.com/embed/track/${trackId}"
      width="300" height="80" frameborder="0" allowtransparency="true" allow="encrypted-media">
    </iframe>
  `;
}

function getSpotifyTrackId(url) {
  const match = url.match(/track\/([a-zA-Z0-9]+)/);
  return match ? match[1] : "";
}
