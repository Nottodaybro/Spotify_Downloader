const axios = require("axios");

module.exports = async (req, res) => {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const { url } = req.body;
    if (!url) {
        return res.status(400).json({ error: "URL is required" });
    }

    try {
        console.log("Mengirim permintaan ke Spotymate...");
        res.setHeader("Content-Type", "application/json");
        res.setHeader("Transfer-Encoding", "chunked"); // Mode streaming

        const response = await axios.post(
            "https://spotymate.com/api/download-track",
            { url },
            {
                headers: {
                    "Content-Type": "application/json",
                    "User-Agent": "Mozilla/5.0 (Linux; Android 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Mobile Safari/537.36",
                    "Referer": "https://spotymate.com/"
                },
                timeout: 9000 // Timeout 9 detik (biar gak melebihi batas Vercel)
            }
        );

        console.log("Respon dari Spotymate diterima, mengirim ke klien...");
        res.write(JSON.stringify(response.data)); // Kirim data secara langsung ke klien
        res.end();
    } catch (error) {
        console.error("Error saat menghubungi Spotymate:", error.response ? error.response.data : error.message);
        res.status(500).json({ error: "Failed to fetch song", details: error.message });
    }
};
