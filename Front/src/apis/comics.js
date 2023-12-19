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

export const fetchComicsDataOne = async (idComics) => {
    try {
        if (!idComics) {
            console.error('idComics is not defined.');
            return null;
        }
        const response = await fetch(`${API_INFO}/getOneComics/${idComics}`);
        const data = await response.json();
        if (data.length > 0) {
            return data;
        } else {
            console.error('No data received.');
            return null;
        }
    } catch (error) {
        console.error('Error during data retrieval:', error);
        return null;
    }
}


export const fetchChapters = async (idComics) => {
    try {
      if (!idComics) {
        console.error("idComics is not defined");
        return null;
      }
      const response = await fetch(`${API_INFO}/getChapters/${idComics}`);
      const data = await response.json();
      if (data.length > 0) {
        return data;
      } else {
        console.error("No data received.");
        return null;
      }
    } catch (error) {
      console.error("Error during data retrieval", error);
      return null;
    }
  };


  export const fetchChapterImages = async (idChapter) => {
    try {
      if (!idChapter) {
        console.error('idChapter is not defined.');
        return null;
      }
      const response = await fetch(`${API_INFO}/getImgChapters/${idChapter}`);
      const data = await response.json();
      if (data.length > 0) {
        return data;
      } else {
        console.error('No chapter images received.');
        return null;
      }
    } catch (error) {
      console.error('Error during chapter images retrieval:', error);
      return null;
    }
  };
