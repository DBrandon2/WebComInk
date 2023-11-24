import './App.module.scss';
import { Suspense } from 'react';
import Header from './components/Header/Header/Header';
import Footer from "./components/Header/Footer/Footer"
import { Outlet } from 'react-router-dom';
import AuthProvider from "./components/AuthProvider/AuthProvider"




function App() {

  return (
    <div className="App">
      <AuthProvider>
        <Header/>
        <Suspense>
          <Outlet/>
        </Suspense>
        <Footer/>
      </AuthProvider>
    </div>
  );
}

export default App;
