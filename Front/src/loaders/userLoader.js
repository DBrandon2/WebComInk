import { getConnectedUser } from "../apis/users";

export async function userLoader() {
  try {
    return getConnectedUser();
  } catch (error) {
    console.error(error, getConnectedUser())
  }
  
}
