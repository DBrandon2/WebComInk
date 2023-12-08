const API_INFO = "/api/comics";

export const fetchComicsData = async () => {
    try {
        const response = await fetch(`${API_INFO}/getComics`);
        const data = await response.json();
        if (data.length > 0) {
            return data;
        } else {
            console.error('Aucune donnée récupérée.');
            return null;
        }
    } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
        return null;
    }
};