import { getCurrentUser } from "../apis/auth.api";

export async function rootLoader() {
  return getCurrentUser();
}
