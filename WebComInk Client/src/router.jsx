import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Register from "./pages/forms/Register";
import Login from "./pages/forms/Login";
import ErrorPage from "./pages/ErrorPage";
import Profile from "./pages/Profile/Profile";
import Overview from "./pages/Profile/pages/Overview";
import Data from "./pages/Profile/pages/Data";
import Details from "./pages/Details/Details";
import UserConnected from "./components/ProtectedRoutes/UserConnected";
import UserNotConnected from "./components/ProtectedRoutes/UserNotConnected";
import { rootLoader } from "./loaders/rootLoader";
import Homepage from "./pages/Homepage/Homepage";

export const router = createBrowserRouter([
  {
    path: "/",
    errorElement: <ErrorPage />,
    element: <App />,
    loader: rootLoader,
    children: [
      {
        path: "/",
        element: (
            <Homepage />
        ),
      },
      {
        path: "/register",
        element: (
          <UserNotConnected>
            <Register />
          </UserNotConnected>
        ),
      },
      {
        path: "/login",
        element: (
          <UserNotConnected>
            <Login />
          </UserNotConnected>
        ),
      },
      //  {
      //   path: "forgotpassword",
      //   element: <ForgotPassword />,
      // },
      // {
      //   path: "resetpassword",
      //   element: <ResetPassword />,
      // },
      {
        path: "/details/:id",
        element: (
          <UserConnected>
            <Details />
          </UserConnected>
        ),
      },
      {
        path: "/profile",
        element: (
          <UserConnected>
            <Profile />
          </UserConnected>
        ),
        children: [
          {
            index: true,
            element: <Overview />,
          },
          {
            path: "data",
            element: <Data />,
          },
        ],
      },
    ],
  },
]);
