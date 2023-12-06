import { useContext, useRef, useState } from "react";
import { AuthContext } from "../../context";
import styles from "./Profile.module.scss"
import { useNavigate } from "react-router-dom";
import PopUp from "../../components/PopUp/PopUp";
import TextField from "../../components/EditText/TextField";





function Profile() {
  const { user, setUser, login, logout } = useContext(AuthContext);
  const [feedback, setFeedback] = useState("");
  const [showPopUp, setShowPopUp] = useState(false);
  const navigate = useNavigate();
  const avatarRef = useRef();
  const [errorAvatar, setErrorAvatar] = useState("");
  

  
  console.log(user)
  console.log(avatarRef)

  async function addAvatar(){
    const formData = new FormData(); 
    console.log(avatarRef)
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
      console.log(formData)
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

  console.log(user.profilePicture)

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
      <div className={`${styles.profileDescription}`}>
        <div className={`${styles.descriptionEntete}`}>
          <p>À propos</p>
        </div>
        {/* <div className={`${styles.description}`}> */}
          <TextField className={`${styles.description}`}/>


        {/* </div> */}
        {/* <div className={`${styles.descriptionBtn}`}>
          <button className="whiteButton">
            Modifier la description
          </button>
        </div> */}
      </div>

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