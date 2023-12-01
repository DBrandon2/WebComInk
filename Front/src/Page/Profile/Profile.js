import { useContext, useState } from "react";
import { AuthContext } from "../../context";
import styles from "./Profile.module.scss"
import PP from "../../assets/images/avatar.jpg"
import { Navigate } from "react-router-dom";



function Profile() {

  const {user, setUser } = useContext(AuthContext);
  const [feedback, setFeedback] = useState("");

  async function logout() {
    setFeedback("Vous allez être déconnecté")
    try {
      await fetch(`http://localhost:8000/api/users/logout`)
      setUser(null)
    } catch (error) {
      console.error(error)
    }

  }


  return (
    <>
    <div className={`${styles.mainDiv}`}>

      <div className={`${styles.profileTitle}`}>
        <h1>Profile de Brandon </h1>
        <span>Choisie un avatar et écris toi une déscription pour créer un profile à ton image !</span>
      </div>

      <div className={`${styles.profilePPInfo}`}>
        <div className={`${styles.profilePicture}`}>
          <div className={`${styles.divPP}`}>
            <img src="" alt="" />
          </div>
          <button className="whiteButton">Changer d'avatar</button>
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
        <div className={`${styles.description}`}>
            <p>{user.aboutme}</p>
        </div>
        <div className={`${styles.descriptionBtn}`}>
          <button className="whiteButton">
            Modifier la description
          </button>
        </div>
      </div>

      <div>
        <button onClick={logout} className={`${styles.logoutBtn}`}>Se déconnecter</button>
      </div>

          
    </div>
    </>
  )
}

export default Profile