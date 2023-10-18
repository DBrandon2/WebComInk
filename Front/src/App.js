import './App.module.scss';
import {useState } from 'react';
import Header from './components/Header/Header/Header';
import Populaires from './Page/Homepage/Populaires/Populaires';
import CarouselComponent from './Page/Homepage/Carousel/carousel.component';
import Register from './Page/Form/register/Register';
import Login from './Page/Form/login/Login';
import Profile from './Page/Profile/Profile';
import Homepage from './Page/Homepage/Homepage';
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
