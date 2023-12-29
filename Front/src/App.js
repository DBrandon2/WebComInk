import "./App.module.scss";
import { Suspense } from "react";
import Header from "./components/Header/Header/Header";
import Footer from "./components/Header/Footer/Footer";
import { Outlet } from "react-router-dom";
import AuthProvider from "./components/AuthProvider/AuthProvider";
import CookieConsent from "react-cookie-consent";
function App() {
  return (
    <div className="App">
      <AuthProvider>
        <CookieConsent
          location="bottom"
          buttonText="J'accepte"
          cookieName="myAwesomeCookieName2"
          style={{ background: "#2B373B" }}
          buttonStyle={{
            color: "var(--maintext)",
            fontSize: "13px",
            backgroundColor: "var(--accent)",
          }}
          expires={150}
          overlay
        >
          Ce site utilise des cookies pour une meilleur expérience utilisateur.{" "}
          <span
            style={{
              fontSize: "10px",
              color: "var(--accent)",
              marginLeft: "1%",
            }}
          >
            Veuillez accepter pour pouvoir naviguer librement sur le site.
          </span>
        </CookieConsent>

        <Header />
        <Suspense>
          <Outlet />
        </Suspense>
        <Footer />
      </AuthProvider>
    </div>
  );
}
export default App;
