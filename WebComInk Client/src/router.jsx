import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Auth from "./pages/forms/Auth";
import ErrorPage from "./pages/ErrorPage";
import Profile from "./pages/Profile/Profile";
import Overview from "./pages/Profile/pages/Overview";
import Data from "./pages/Profile/pages/Data";
import UserConnected from "./components/ProtectedRoutes/UserConnected";
import UserNotConnected from "./components/ProtectedRoutes/UserNotConnected";
import { rootLoader } from "./loaders/rootLoader";
import Homepage from "./pages/Homepage/Homepage";
import Comics from "./pages/Comics/Comics";
import Library from "./pages/Library/Library";
import Settings from "./pages/Settings/Settings";
// import ForgotPass from "./pages/forms/Security/ForgotPass";
// import ResetPass from "./pages/forms/Security/ResetPass";

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
          <UserNotConnected>
            <Homepage />
          </UserNotConnected>
        ),
      },
      {
        path: "/comics",
        element: (
          <UserNotConnected>
            <Comics />
          </UserNotConnected>
        ),
      },
      {
        path: "/library",
        element: <Library />,
      },
      {
        path: "/auth",
        element: (
          <UserNotConnected>
            <Auth />
          </UserNotConnected>
        ),
      },
      // {
      //   path: "forgotpassword",
      //   element: <ForgotPass/>,
      // },
      // {
      //   path: "resetpassword",
      //   element: <ResetPass />,
      // },
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
      {
        path: "/settings",
        element: <Settings />,
      },
    ],
  },
]);
