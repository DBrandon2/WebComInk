const API_BOOKS = "/api/comics";

export const fetchBooks = async (iduser) => {
    console.log("test")
        const response = await fetch(`${API_BOOKS}/getBooksComics/${iduser}`);
        const backResponse = await response.json();
        if (response.ok) {
            return backResponse;
        }else {
            if(backResponse) {
                throw backResponse;
            }else {
                throw new Error("Une erreur est survenue")
            }
        }
  };

export const fetchBooksUser = async (idComics, iduser) => {
        const response = await fetch(`${API_BOOKS}/getBooks/${idComics}/${iduser}`);
        // return { bookCount: data.bookCount, isBooked: data.isBooked };
        const backResponse = await response.json();
        if (response.ok) {
            return backResponse;
        }else {
            if(backResponse) {
                throw backResponse;
            }else {
                throw new Error("Une erreur est survenue")
            }
        }
  };

  export const addBook = async (idComics, iduser) => {
    try {
      if (!idComics || !iduser) {
        console.error("idComics or userId is not defined");
        return null;
      }
      const response = await fetch(`/api/comics/addBook/${idComics}/${iduser}`, {
        method: 'PATCH',
      });
      if (response.status === 200) {
        console.log("Book added successfully.");
        return true;
      } else {
        console.error("Failed to add bookmarks.");
        return false;
      }
    } catch (error) {
      console.error("Error during adding like", error);
      return null;
    }
  };

  export const removeBook = async (idComics, iduser) => {
    try {
      if (!idComics || !iduser) {
        console.error("idComics or userId is not defined");
        return null;
      }
  
      const response = await fetch(`/api/comics/removeBook/${idComics}/${iduser}`, {
        method: 'PATCH',
      });
  
      if (response.status === 200) {
        console.log("Book removed successfully.");
        return true;
      } else {
        console.error("Failed to remove bookmarks.");
        return false;
      }
    } catch (error) {
      console.error("Error during removing like", error);
      return null;
    }
  };

  export const AllBooks = async (idComics) => {
    try {
      const response = await fetch(`/api/comics/getAllBooks/${idComics}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(error);
      throw new Error(`Erreur lors de la récupération des bookmarks : ${error.message}`);
    }
  };