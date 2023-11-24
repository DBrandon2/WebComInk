import { getConnectedUser } from "../apis/users";

export async function userLoader() {
  return getConnectedUser();
}
