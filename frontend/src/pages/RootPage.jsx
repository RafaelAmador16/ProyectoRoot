import Footer from "./Footer";
import Header from "./Header"
import { Outlet } from 'react-router-dom';
import './css/general.css'
import './css/animaciones.css'

const RootPage = () => {
  return (
    <div>
      <Header />
      <Outlet />
      <Footer />
    </div>
  )
}

export default RootPage