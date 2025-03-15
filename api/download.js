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
        const response = await axios.post("https://spotymate.com/api/download-track", { url }, {
            headers: {
                "Content-Type": "application/json",
                "User-Agent": "Mozilla/5.0 (Linux; Android 10)",
                "Referer": "https://spotymate.com/"
            },
            timeout: 10000 // Tambah timeout jadi 10 detik
        });

        return res.status(200).json(response.data);
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ error: "Failed to fetch song", details: error.message });
    }
};
