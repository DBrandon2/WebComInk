import React, { useState } from 'react'
import { useLoaderData } from 'react-router-dom'
import { AuthContext } from "../../context"
import { signin, signout } from "../../apis/users"

function AuthProvider({children}) {
    const userConnect = useLoaderData()
    const [user, setUser] = useState(userConnect)
    console.log(user)

    async function login (values) {
        const newUser = await signin(values)
        setUser(newUser)
    }

    async function logout(values){
        const newUser = await signout(values)
        setUser(newUser)
    }




  return (
    <AuthContext.Provider
        value={{
            user,
            login,
            logout
        }}>
            {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider
