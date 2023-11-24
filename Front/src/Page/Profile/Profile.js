import { useContext } from "react";
import { AuthContext } from "../../context";


function Profile() {

  const { user } = useContext(AuthContext);

  return (
    <>
    <div>
      <h1>Profile</h1>
          <ul>
            <li>Nom : {user.name}</li>
            <li>Email : {user.email}</li>
          </ul>
    </div>
    </>
  )
}

export default Profile