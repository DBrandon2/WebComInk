const API_USERS = "/api/users";

export async function createUser(newUser) {
  try{
  const response = await fetch(`${API_USERS}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newUser),
  });
  const backResponse = await response.json();
  if (response.ok) {
    return backResponse;
  } else {
    if (backResponse) {
      throw new Error(backResponse);
    } 
  }
}catch (error) {
  throw error;
}}

export async function signin(values) {
  const response = await fetch(`${API_USERS}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(values),
  });
  const backResponse = await response.json();
  if (response.ok) {
    return backResponse;
  } else {
    if (backResponse) {
      throw backResponse;
    } else {
      throw new Error("Error API login");
    }
  }
}

export async function signout() {
  const response = await fetch(`${API_USERS}/logout`)
  console.log(response);
}

export async function getConnectedUser() {
  const response = await fetch(`${API_USERS}/userConnected`);
  const userC = await response.json();
  console.log(userC);
  return userC;
}
