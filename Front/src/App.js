import './App.module.scss';
import {useState } from 'react';
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
