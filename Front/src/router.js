import { createBrowserRouter} from "react-router-dom";
import App from "./App";
import { lazy} from "react";
import { userLoader } from "./loaders/userLoader";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute"
import ScrollToTop from "./components/ScrollToTop/ScrollToTop";
import Details from "./Page/Comics/Details/Details";
const ResetPassword = lazy(() => import ("./Page/Security/ResetPassword"))
const ForgotPassword = lazy(() => import ("./Page/Security/ForgotPassword"))
const Homepage = lazy(() => import("./Page/Homepage/Homepage"))
const Register = lazy(() => import ("./Page/Form/register/Register"))
const Login = lazy(() => import ("./Page/Form/login/Login"))
const Profile = lazy(()=> import ("./Page/Profile/Profile"))
const Comics = lazy (() => import ("./Page/Comics/Comics"))
export const router = createBrowserRouter ([
    {
        path:"/",
        element: (
            <>
              <ScrollToTop />
              <App />
            </>
          ),
        loader: userLoader,
        children:  [
            {
                index: true,
                element: <Homepage/> 
            },
            {
                path: "inscription",
                element: <Register/>
            },
            {
                path:"connexion",
                element: <Login/>
            },
            {
                path: "details/:idComics",
                element: <Details/>,
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
            },
            {
                path: "motdepasseoublié",
                element: (<ForgotPassword/>)
            },
            {
                path: "changermotdepasse",
                element: (<ResetPassword/>)
            },
        ]
    }
])