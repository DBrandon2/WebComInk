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
import LegalMentions from "./pages/Legal/LegalMentions";
import TermsOfUse from "./pages/Legal/TermsOfUse";
import PrivacyPolicy from "./pages/Legal/PrivacyPolicy";
import CookiesPolicy from "./pages/Legal/CookiesPolicy";
import Support from "./pages/Legal/Support";
import BugReport from "./pages/Legal/BugReport";
import API from "./pages/Legal/API";
import Contact from "./pages/Legal/Contact";
import FAQ from "./pages/Legal/FAQ";
import Media from "./pages/Legal/Media";
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
        path: "/Comics",
        element: (
          <UserNotConnected>
            <Comics />
          </UserNotConnected>
        ),
      },
      {
        path: "/Bibliothèque",
        element: <Library />,
      },
      {
        path: "/Auth",
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
        path: "/Profile",
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
        path: "/Paramètres",
        element: <Settings />,
      },
      {
        path: "/Mentions-Légales",
        element: <LegalMentions />,
      },
      {
        path: "/Conditions-Générales-d'utilisation",
        element: <TermsOfUse />,
      },
      {
        path: "/Politique-de-protection-des-données",
        element: <PrivacyPolicy />,
      },
      {
        path: "/Politique-des-Cookies",
        element: <CookiesPolicy />,
      },
      {
        path: "/Aide",
        element: <Support />,
      },
      {
        path: "/Signaler-un-bug",
        element: <BugReport />,
      },
      {
        path: "/API",
        element: <API />,
      },
      {
        path: "/Contact",
        element: <Contact />,
      },
      {
        path: "/FAQ",
        element: <FAQ />,
      },
      {
        path: "/Media",
        element: <Media />,
      },
    ],
  },
]);
