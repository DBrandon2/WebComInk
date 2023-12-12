import { getConnectedUser } from "../apis/users";

export async function userLoader() {
  try {
    const user = getConnectedUser()

    console.log(user)
    
    if (!user.profilePicture) {
        user.profilePicture = "Default_Avatar.png";
      }
      return user
  } catch (error) {
    console.error(error, getConnectedUser())
  }
  
}
