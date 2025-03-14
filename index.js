const axios = require('axios');

module.exports = async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: "Method not allowed" });
    }

    try {
        const { url } = req.body;
        if (!url) {
            return res.status(400).json({ error: "URL is required" });
        }

        const response = await axios.post('https://spotymate.com/api/download-track', 
            { url }, 
            {
                headers: {
                    'Content-Type': 'application/json',
                    'User-Agent': 'Mozilla/5.0',
                    'Referer': 'https://spotymate.com/'
                }
            }
        );

        return res.json(response.data);
    } catch (error) {
        console.error("Error saat mengunduh lagu:", error.message);
        return res.status(500).json({ error: "Gagal mengunduh lagu" });
    }
};
