import './App.module.scss';
import Header from './components/Header/Header';
import Populaires from './components/Page/Homepage/Populaires';
import CarouselComponent from './components/Page/Homepage/carousel.component';
import Register from './components/Page/Form/register/Register';
import {useState } from 'react';
import Login from './components/Page/Form/login/Login';
import Profile from './components/Page/Profile/Profile';
import Homepage from './components/Page/Homepage/Homepage';
import Layout from './layout/layout';




function App() {
  const [user, setUser] = useState(null)

  function logout(){
    setUser(null);
  }

  function getUser(userLogged) {
    setUser(userLogged);
  }

  return (
    <div className="App">
      <Layout
        getUser={getUser}
        user={user}
        logout={logout}
        />
    </div>
  );
}

export default App;
