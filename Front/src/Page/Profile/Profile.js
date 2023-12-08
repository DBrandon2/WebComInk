import { useContext, useRef, useState } from "react";
import { AuthContext } from "../../context";
import styles from "./Profile.module.scss"
import { useNavigate } from "react-router-dom";
import PopUp from "../../components/PopUp/PopUp";






function Profile() {
  const { user, logout } = useContext(AuthContext);
  const [feedback, setFeedback] = useState("");
  const [showPopUp, setShowPopUp] = useState(false);
  const navigate = useNavigate();
  const avatarRef = useRef();
  const bannerRef = useRef();
  const portraitRef = useRef();
  const [errorAvatar, setErrorAvatar] = useState("");
  const [formData, setFormData] = useState({
    title: '',
    banner: null,
    portrait:null,
    synopsis: '',
    author: ''
  });
  

  
  console.log(user)
  // console.log(avatarRef)

  async function addAvatar(){
    const formData = new FormData(); 
    // console.log(avatarRef)
    if (avatarRef.current && avatarRef.current.files[0]){
      const maxFileSize = 5000000;
      if(avatarRef.current.files[0].size > maxFileSize) {
        setErrorAvatar("Le fichier est trop volumineux")
        return;
      }
      const supportExtensions = ["jpg", "jpeg", "png", "avif"];
      const fileExtension = avatarRef.current.files[0].name
      .split(".")
      .pop()
      .toLowerCase();
      if (!supportExtensions.includes(fileExtension)){
        setErrorAvatar("Format de fichier non supporté");
      }
      formData.append("avatar", avatarRef.current.files[0]);
      formData.append("iduser", user.iduser);
      // console.log(formData)
    try{
      const response = await fetch (`http://localhost:8000/api/users/updateAvatar`, {
        method: "POST",
        body: formData,
      });
      if (response.ok) {
        setFeedback("Avatar Modifié avec succès");
      } else {
        console.error("Erreur lors de la mise à jour de l'avatar :", response.status);
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'avatar :", error);
      setFeedback("Erreur lors de la mise à jour de l'avatar. Veuillez réessayer.");
    }
  }
}

const handleSubmit = async(e) => {
  e.preventDefault();

  if (!bannerRef.current || !bannerRef.current.files || bannerRef.current.files.length === 0) {
    console.error("Aucun fichier sélectionné");
    return;
  }

  const title = formData.title;
  const synopsis = formData.synopsis;
  const author = formData.author;
  const illustrator = formData.illustrator;

  const formDataToSend = new FormData();

  formDataToSend.append('title', title);
  formDataToSend.append('banner', bannerRef.current.files[0]);
  formDataToSend.append('portrait', portraitRef.current.files[0]);
  formDataToSend.append('synopsis', synopsis);
  formDataToSend.append('author', author);
  formDataToSend.append('illustrator', illustrator);
  console.log(formDataToSend);
  try{
    const response = await fetch (`http://localhost:8000/api/users/insertComics`, {
      method: "POST",
      body: formDataToSend,
    });
    console.log(formData)
    if(response.ok) {
      console.log("Envoie réussie")
      setFormData({
        title: '',
        banner: null,
        portrait:null,
        synopsis: '',
        author: '',
        illustrator: '',
      });
    }else {
      console.error("Erreur de l'envoie", response.status)
    }
  }catch(error) {
    console.error("erreur lors de la requête", error)
  }
}

const handleInputChange = (e) => {
  const { id, value, files } = e.target || {};

  setFormData((prevData) => ({
    ...prevData,
    [id]: (id === "banner" || id ==="portrait") && files ? files[0] : value,
  }));
};

  


//  --------Logout----------
  const openPopUp = () => {
    setShowPopUp(true);
  };

  const closePopUp = () => {
    setShowPopUp(false);
  };

  const handleLogout = async () => {
    try {
      await logout();
      setFeedback("Vous avez été déconnecté");
      navigate("../connexion");
    } catch (error) {
      console.error(error);
    }finally {
      closePopUp();
    }
  };
  // ---------------------------------

  // console.log(user.profilePicture)

  return (
    <>
    <div className={`${styles.mainDiv}`}>

      <div className={`${styles.profileTitle}`}>
        <h1>Profile de Brandon </h1>
        <span>Choisie un avatar et écris toi une description pour créer un profile à ton image !</span>
      </div>

      <div className={`${styles.profilePPInfo}`}>
        <div className={`${styles.profilePicture}`}>
            {/* --------------------- */}
          <div
           className={`${styles.divPP}`}
           onClick={() => document.getElementById('profilePicture').click()}
           >
              <img src={`http://localhost:8000/${user.profilePicture}`} alt="ProfilePicture" />
              <input type="file" id="profilePicture" ref={avatarRef} style={{ display: 'none' }} />
            <i className={`fa-solid fa-pen-to-square ${styles.editIcon}`}></i>
          </div>
          {/* ----------------------- */}
          <button onClick={addAvatar} className="whiteButton">Changer d'avatar</button>
        </div>
        <div className={`${styles.profileInfo}`}>
          <ul>
            <li><span>Username :</span>  {user.username} </li>
            <li><span>Email :</span> {user.email}</li>
            <li className="passwordProfile"> <span>Password :</span> ************</li>
          </ul>
        </div>
      </div>
      {/* <div className={`${styles.profileDescription}`}> */}
        {/* <div className={`${styles.descriptionEntete}`}>
          <p>À propos</p>
        </div> */}
        {/* <div className={`${styles.description}`}> */}
          {/* <TextField className={`${styles.description}`}/> */}
        {/* </div> */}
        {/* <div className={`${styles.descriptionBtn}`}>
          <button className="whiteButton">
            Modifier la description
          </button>
        </div> */}
      {/* </div> */}
      
        {user && user.admin === 1 && (
          <div className={`${styles.Admin}`}>
            <h1>Panel Admin</h1>
            <form onSubmit={handleSubmit} encType="multipart/form-data">
        <input
          type="text"
          id="title"
          placeholder="Title"
          value={formData.title}
          onChange={handleInputChange}
        />
        <p>Bannière</p>
        <input
          type="file"
          id="banner"
          name="banner"
          ref={bannerRef}
          onChange={handleInputChange}
        />
        <p>Portrait</p>
        <input
          type="file"
          id="portrait"
          name="portrait"
          ref={portraitRef}
          onChange={handleInputChange}
        />
        <input
          type="text"
          id="synopsis"
          placeholder="Synopsis"
          value={formData.synopsis}
          onChange={handleInputChange}
        />
        <input
          type="text"
          id="author"
          placeholder="Author"
          value={formData.author}
          onChange={handleInputChange}
        />
        <input
          type="text"
          id="illustrator"
          placeholder="Illustrator"
          value={formData.illustrator}
          onChange={handleInputChange}
        />
        <button type="submit">Envoyer</button>
      </form>
          </div>
        ) }
      
      

      <div>
        <button onClick={openPopUp} className={`${styles.logoutBtn}`}>Se déconnecter</button>
      </div>

      {showPopUp && (
          <PopUp 
            message="Voulez-vous vraiment vous déconnecter ?"
            onConfirm={handleLogout}
            onCancel={closePopUp}
            active={showPopUp}
          />
        )}


      {feedback && <p className={`${styles.feedback} mb20`}>{feedback}</p>}
                        {feedback && (
                          <p className={`${styles.feedback} mb20`}>{feedback}</p>
                        )}
                        

          
    </div>
    </>
  )
}

export default Profile