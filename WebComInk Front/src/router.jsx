import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import React, { lazy } from "react";
import { rootLoader } from "./loaders/rootLoader";
const Auth = lazy(() => import("./pages/forms/Auth"));
const ErrorPage = lazy(() => import("./pages/ErrorPage"));
const Profile = lazy(() => import("./pages/Profile/Profile"));
const UserConnected = lazy(() =>
  import("./components/ProtectedRoutes/UserConnected")
);
const UserNotConnected = lazy(() =>
  import("./components/ProtectedRoutes/UserNotConnected")
);
const Homepage = lazy(() => import("./pages/Homepage/Homepage"));
const Comics = lazy(() => import("./pages/Comics/Comics"));
const Library = lazy(() => import("./pages/Library/Library"));
const Settings = lazy(() => import("./pages/Settings/Settings"));
const LegalMentions = lazy(() => import("./pages/Legal/LegalMentions"));
const TermsOfUse = lazy(() => import("./pages/Legal/TermsOfUse"));
const PrivacyPolicy = lazy(() => import("./pages/Legal/PrivacyPolicy"));
const CookiesPolicy = lazy(() => import("./pages/Legal/CookiesPolicy"));
const Support = lazy(() => import("./pages/Legal/Support"));
const BugReport = lazy(() => import("./pages/Legal/BugReport"));
const API = lazy(() => import("./pages/Legal/API"));
const Contact = lazy(() => import("./pages/Legal/Contact"));
const FAQ = lazy(() => import("./pages/Legal/FAQ"));
const Media = lazy(() => import("./pages/Legal/Media"));
const ValidationSuccess = lazy(() => import("./pages/Legal/ValidationSuccess"));
const ForgotPass = lazy(() => import("./pages/Forms/Security/ForgotPass"));
const ResetPass = lazy(() => import("./pages/Forms/Security/ResetPass"));
const ComicsDetails = lazy(() => import("./pages/Comics/ComicsDetails"));
const ChapterReader = lazy(() => import("./pages/Comics/ChapterReader"));

export const router = createBrowserRouter([
  {
    path: "/",
    errorElement: <ErrorPage />,
    element: <App />,
    loader: rootLoader,
    children: [
      {
        path: "/",
        element: <Homepage />,
      },
      {
        path: "/Comics",
        element: <Comics />,
      },
      {
        path: "/Comics/:id/:slug",
        element: <ComicsDetails />,
      },
      {
        path: "/Comics/:mangaId/:slug/chapter/:chapterId",
        element: <ChapterReader />,
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
      {
        path: "/forgot-password",
        element: (
          <UserNotConnected>
            <ForgotPass />
          </UserNotConnected>
        ),
      },
      {
        path: "/resetpassword",
        element: (
          <UserNotConnected>
            <ResetPass />
          </UserNotConnected>
        ),
      },
      {
        path: "/validation-inscription",
        element: <ValidationSuccess />,
      },
      {
        path: "/Profile",
        element: (
          <UserConnected>
            <Profile />
          </UserConnected>
        ),
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
