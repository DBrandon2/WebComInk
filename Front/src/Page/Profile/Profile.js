import { useContext } from "react";
import { AuthContext } from "../../context";
import styles from "./Profile.module.scss"


function Profile() {

  const { user } = useContext(AuthContext);

  return (
    <>
    <div className={`${styles.mainDiv}`}>

      <div className={`${styles.profileTitle}`}>
        <h1>Profile de {user.username}</h1>
        <span>Choisie un avatar et écris toi une déscription pour créer un profile à ton image !</span>
      </div>

      <div className={`${styles.profilePPInfo}`}>
        <div className={`${styles.profilePicture}`}>
          <img src="" alt=" Image Profile " />
          <button>Changer d'avatard</button>
        </div>
        <div className={`${styles.profileInfo}`}>
          <ul>
            <li>Username : {user.username}</li>
            <li>Email : {user.email}</li>
            <li> Password : </li>
          </ul>
        </div>
      </div>
      <div className={`${styles.profileDescription}`}>
        <div className={`${styles.desciptionEntete}`}>
          <p>À propos</p>
        </div>
        <div className={`${styles.description}`}>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Dicta voluptate adipisci iste nulla vel eius dignissimos eos reiciendis, consequuntur consectetur nihil ab cum voluptatem ipsa fuga exercitationem explicabo vitae quod!</p>
        </div>
        <div className={`${styles.descriptionBtn}`}>
          <button>
            Modifier la description
          </button>
        </div>
      </div>

          
    </div>
    </>
  )
}

export default Profile