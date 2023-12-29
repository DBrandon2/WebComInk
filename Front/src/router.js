import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import { lazy } from "react";
import { userLoader } from "./loaders/userLoader";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import ScrollToTop from "./components/ScrollToTop/ScrollToTop";
import Details from "./Page/Comics/Details/Details";
import Bibliothèque from "./Page/Bibliothèque/Bibliothèque";
import ImgChapter from "./Page/Comics/ImgChapter/ImgChapter";
import CGU from "./Page/InfoFooter/CGU/CGU";
import InfoCookie from "./Page/InfoFooter/InfoCookie/InfoCookie";
import Partenariat from "./Page/InfoFooter/Partenariat/Partenariat";
import Mentionslégal from "./Page/InfoFooter/MentionsLégal/Mentionslégal";
import Confidentialité from "./Page/InfoFooter/Politique de confidentialité/Confidentialité";
import BugAide from "./Page/InfoFooter/SignalerBugAide/BugAide";
import Réseaux from "./Page/InfoFooter/Réseaux/Réseaux";
import SAV from "./Page/InfoFooter/SAV/SAV";
const ResetPassword = lazy(() => import("./Page/Security/ResetPassword"));
const ForgotPassword = lazy(() => import("./Page/Security/ForgotPassword"));
const Homepage = lazy(() => import("./Page/Homepage/Homepage"));
const Register = lazy(() => import("./Page/Form/register/Register"));
const Login = lazy(() => import("./Page/Form/login/Login"));
const Profile = lazy(() => import("./Page/Profile/Profile"));
const Comics = lazy(() => import("./Page/Comics/Comics"));
export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <>
        <ScrollToTop />
        <App />
      </>
    ),
    loader: userLoader,
    children: [
      {
        index: true,
        element: <Homepage />,
      },
      {
        path: "inscription",
        element: <Register />,
      },
      {
        path: "connexion",
        element: <Login />,
      },
      {
        path: "details/:idComics",
        element: <Details />,
      },
      {
        path: "comics",
        element: <Comics />,
      },
      {
        path: "bibliothèque",
        element: (
          <ProtectedRoute>
            <Bibliothèque />
          </ProtectedRoute>
        ),
      },
      {
        path: "profile",
        element: (
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        ),
      },
      {
        path: "motdepasseoublié",
        element: <ForgotPassword />,
      },
      {
        path: "changermotdepasse",
        element: <ResetPassword />,
      },
      {
        path: "/chapter/:idChapter",
        element: <ImgChapter />,
      },
      {
        path: "CGU",
        element: <CGU />,
      },
      {
        path: "Politique-des-cookies",
        element: <InfoCookie />,
      },
      {
        path: "Partenariat",
        element: <Partenariat />,
      },
      {
        path: "Mentions-légales",
        element: <Mentionslégal />,
      },
      {
        path: "Politique-de-confidentialité",
        element: <Confidentialité />,
      },
      {
        path: "Aide-Signalé-un-bug",
        element: <BugAide />,
      },
      {
        path: "Réseaux-Sociaux",
        element: <Réseaux />,
      },
      {
        path: "SAV",
        element: <SAV />,
      },
    ],
  },
]);
