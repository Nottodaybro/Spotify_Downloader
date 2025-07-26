document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("searchInput");
  const searchButton = document.getElementById("searchButton");
  const resultsContainer = document.getElementById("results");

  // Disable searching UI since we're focusing on URL input for download only
  searchInput.placeholder = "Enter full Spotify track URL to download...";
  searchButton.textContent = "Download";

  searchButton.addEventListener("click", async () => {
    const url = searchInput.value.trim();
    if (!url) {
      alert("Please enter a Spotify track URL to download!");
      return;
    }
    if (!url.includes("spotify.com/track/")) {
      alert("Please enter a valid Spotify track URL!");
      return;
    }

    try {
      resultsContainer.innerHTML = "<p>Processing your download request...</p>";

      // Use your backend API here; change URL if you host your own
      const downloadApi = `https://api.siputzx.my.id/api/d/spotify?url=${encodeURIComponent(url)}`;

      const response = await fetch(downloadApi);
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

      const data = await response.json();

      if (data.status === true && data.download) {
        resultsContainer.innerHTML = `<p>Download ready: <a href="${data.download}" target="_blank" download>Click here if your download doesn't start automatically</a></p>`;

        // Auto-download trigger
        window.location.href = data.download;
      } else {
        resultsContainer.innerHTML = "<p>Download failed, please try again later.</p>";
      }
    } catch (error) {
      console.error("Download error:", error);
      resultsContainer.innerHTML = "<p>An error occurred while downloading the song.</p>";
    }
  });
});
