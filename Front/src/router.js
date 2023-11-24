import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import { lazy } from "react";
import { userLoader } from "./loaders/userLoader";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute"
const Homepage = lazy(() => import("./Page/Homepage/Homepage"))
const Register = lazy(() => import ("./Page/Form/register/Register"))
const Login = lazy(() => import ("./Page/Form/login/Login"))
const Profile = lazy(()=> import ("./Page/Profile/Profile"))
const Comics = lazy (() => import ("./Page/Comics/Comics"))

export const router = createBrowserRouter ([
    {
        path:"/",
        element: <App/>,
        loader: userLoader,
        children:  [
            {
                index: true,
                element: <Homepage/> 
            },
            {
                path: "register",
                element: <Register/>
            },
            {
                path:"login",
                element: <Login/>
            },
            {
                path:"comics",
                element: <Comics/> 
            },
            {
                path: "profile",
                element: (
                    <ProtectedRoute>
                        <Profile/>
                    </ProtectedRoute>
                )
            }
        ]
    }
])