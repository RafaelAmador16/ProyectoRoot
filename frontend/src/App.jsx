import {  RouterProvider, createBrowserRouter } from "react-router-dom";
import './App.css'
import RootPage from "./pages/RootPage";
import ErrorPage from "./pages/ErrorPage";
import MainPage from "./pages/MainPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import LigaCreate from "./pages/LigaCreate";
import LigaPage from "./pages/LigaPage";
import { UserProvider } from "./components/context/UserProvider";
import JugadorPage from "./pages/JugadorPage";
import JugadoresProvider from "./components/context/JugadoresProvider";
import LigaTerminada from "./components/LigaTerminada";
import CrearPartida from "./components/CrearPartida";
import DetallesPartida from "./components/DetallesPartida";
import LigaNoTerminada from "./components/LigaNoTerminada";
import MisLigas from "./pages/MisLigas";
import LigaDetalles from "./pages/LigaDetalles";
import Clasificacion from "./components/Clasificacion";
import Resultados from "./components/Resultados";
import JornadasPasadas from "./components/JornadasPasadas";
import JornadasPasadasResultado from "./components/JornadasPasadasResultado";
import EstadisticasRoles from "./pages/EstadisticasRoles";
import EstadisticasLiga from "./pages/EstadisticasLiga";
import EstadisticasTusJugadores from "./pages/EstadisticasTusJugadores";
import LigaActual from "./pages/LigaActual";
import LoginJugador from "./pages/LoginJugador";
import LigasJugador from "./components/LigasJugador";
import TusEstadisticas from "./pages/TusEstadisticas";


function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <RootPage />,
      errorElement: <ErrorPage />,
      children: [
          { path: "/", element: <MainPage />},
          { path: "/login", element: <LoginPage /> },
          { path: "/loginjugador", element: <LoginJugador /> },
          { path: "/register", element: <RegisterPage /> },
          { path: "/ligacreate", element: <LigaCreate /> },
          { path: "/misligas", element: <MisLigas /> },
          { path: "/ligasjugador", element: <LigasJugador /> },
          { path: "/estadisticas-generales", element: <EstadisticasRoles /> },
          { path: "/liga-actual", element: <LigaActual /> },
          { path: "estadisticastusjugadores", element: <EstadisticasTusJugadores />},
          { path: "/liga-actual/:id", element: <LigaDetalles /> },
          { path: "/tusestadisticas/:id", element: <TusEstadisticas />},
          { path: "/estadisticas-liga/:id", element: <EstadisticasLiga /> },
          { path: "liga-terminada/:id", element: <LigaDetalles />},
          { path: "/clasificacion/:id", element: <Clasificacion /> },
          { path: "/jornadas-pasadas/:id", element: <JornadasPasadas />},
          { path: "/jornadas-pasadas/:id/:jornada", element: <JornadasPasadasResultado />},
          { path: "/rellenar/:id", element: <Resultados /> },
          { path: "/crear-partida", element: <CrearPartida />},
          { path: "/detalles-partida", element: <DetallesPartida />},
          { path: "/ligasterminadas", element: <LigaTerminada /> },
          { path: "/ligasnoterminadas", element: <LigaNoTerminada /> },
          { path: "/jugadorcreate", element: <JugadorPage /> },
          { path: "/liga/:id", element: <LigaPage /> },
      ]
    },
       
  ]);
  return (
    <UserProvider>
      <JugadoresProvider>
        <RouterProvider router={router} />
      </JugadoresProvider>
    </UserProvider>
      
    
  );
}

export default App
