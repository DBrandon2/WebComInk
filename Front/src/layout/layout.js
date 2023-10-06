import { Routes, Route} from "react-router-dom";
import Homepage from "../components/Page/Homepage/Homepage";
import Profile from "../components/Page/Profile/Profile";
import Header from "../components/Header/Header";
import Register from "../components/Page/Form/register/Register";
import Login from "../components/Page/Form/login/Login";
import Footer from "../components/Header/Footer";


function layout({
  getUser={getUser},
  user={user},
  logout={logout},
}) {
  return (
    <>
      <Header
        user={user}
        logout={logout}
      />
      <Routes>
          <Route path="/" element={<Homepage />}></Route>
          <Route path="/Profile" element={<Profile />}></Route>
          <Route path="/Connexion" element={<Login getUser={getUser}/>}></Route>
          <Route path="/Inscription" element={<Register />}></Route>
      </Routes>
      <Footer />
    </>
  );
}

export default layout;
