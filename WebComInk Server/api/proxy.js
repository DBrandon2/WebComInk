import axios from "axios";

export default async function handler(req, res) {
  // Construit l'URL complète vers Mangadex en récupérant les query params
  const query = req.url.replace('/api/proxy', ''); // Exemple: /manga?limit=18...
  const mangadexUrl = `https://api.mangadex.org${query}`;

  try {
    const response = await axios.get(mangadexUrl);
    // Transfert la réponse JSON telle quelle
    res.status(response.status).json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json({ error: error.message });
  }
}