
const API_LIKES = "/api/comics";

export const fetchLikes = async(idComics, iduser = null) => {
    try {
      if (iduser) {
        const response = await fetch(`/api/comics/getLikes/${idComics}/${iduser}`);
        const data = await response.json();
        return data.likeCount;
      } else {
        const response = await fetch(`${API_LIKES}/getLikes/${idComics}`);
        const data = await response.json();
        return data.likeCount;
      }
    } catch (error) {
      throw new Error(`Error fetching likes: ${error.message}`);
    }
  }

export const addLike = async (idComics, iduser) => {
  try {
    if (!idComics || !iduser) {
      console.error("idComics or userId is not defined");
      return null;
    }
    const response = await fetch(`${API_LIKES}/addLike/${idComics}/${iduser}`, {
      method: 'PATCH',
    });
    if (response.status === 200) {
      console.log("Like added successfully.");
      return true;
    } else {
      console.error("Failed to add like.");
      return false;
    }
  } catch (error) {
    console.error("Error during adding like", error);
    return null;
  }
};

export const removeLike = async (idComics, iduser) => {
    try {
      if (!idComics || !iduser) {
        console.error("idComics or userId is not defined");
        return null;
      }
  
      const response = await fetch(`${API_LIKES}/removeLike/${idComics}/${iduser}`, {
        method: 'PATCH',
        // headers: {

        // }
      });
  
      if (response.status === 200) {
        console.log("Like removed successfully.");
        return true;
      } else {
        console.error("Failed to remove like.");
        return false;
      }
    } catch (error) {
      console.error("Error during removing like", error);
      return null;
    }
  };

  export async function alreadyLiked (iduser, idComics) {
    try {
        const response = await fetch(${ API_LIKES }/verifyLike/${ iduser }/${ idComics });
        const returnFromBack = await response.json();
        return returnFromBack.likeCount;
    } catch (error) {
        console.error(error);
    }
}