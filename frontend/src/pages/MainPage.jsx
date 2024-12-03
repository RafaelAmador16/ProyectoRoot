import { Link } from 'react-router-dom';
import { useUser } from '../components/context/UserProvider';

const MainPage = () => {
  const { user, jugador } = useUser();

  return (
    <div className="main-page">
      {/* Si hay un usuario autenticado */}
      {user ? (
        <div className='separacion'>
          <div className="button-container">
            <Link to={"/misligas"} className="link-button">
              <div className="action-button zorro">
               <h2>Ver Mis Ligas</h2>
              </div>
            </Link>
            <Link to={'/ligacreate'} className="link-button">
              <div className="action-button raton">
                <h2>Crear Liga</h2>
              </div>
            </Link>
            <Link to={"/crear-partida"} className="link-button" >
              <div className="action-button conejo">
                <h2>Crear Partida</h2>
              </div>
            </Link>
            <Link to={'/jugadorcreate'} className="link-button">
              <div className="action-button raton">
              <h2>Crear jugador</h2>
              </div>
            </Link>
          
            <Link to={'/estadisticas-generales'} className="link-button">
              <div className="action-button conejo">
                <h2>Ver estadisticas de los roles</h2>
              </div>
            </Link>
            <Link to={'/estadisticastusjugadores'} className="link-button">
              <div className="action-button zorro">
                <h2>Ver estadisticas de tus jugadores</h2>
              </div>
            </Link>
          </div>
          <div className='portada-lateral'>
            <img src='/img/portada.jpg' alt='Portada' className='portada2' />
          </div>
          <div>
            <img src='/img/Marquesado.png' className='foto-Marquesado1' />
            <img src='/img/Marquesado.png' className='foto-Marquesado2' />
            <img src='/img/Nido.png' className='foto-Nido1' />
            <img src='/img/Nido.png' className='foto-Nido2' />
            <img src='/img/Nido.png' className='foto-Nido3' />
          </div>
        </div>
      ) 
      // Si hay un jugador autenticado
      : jugador ? (
        <div className='separacion'>
          <div className="button-container">
            <Link to={"/ligasjugador"} className="link-button">
              <div className="action-button zorro">
               <h2>Ver mis Ligas</h2>
              </div>
            </Link>
            <Link to={`/tusestadisticas/${jugador.id}`} className="link-button">
              <div className="action-button raton">
                <h2>Ver mis estadisticas</h2>
              </div>
            </Link>
          </div>
          <div className='portada-lateral'>
            <img src='/img/portada.jpg' alt='Portada' className='portada2' />
          </div>
          <div>
            <img src='/img/Marquesado.png' className='foto-Marquesado1' />
            <img src='/img/Marquesado.png' className='foto-Marquesado2' />
            <img src='/img/Nido.png' className='foto-Nido1' />
            <img src='/img/Nido.png' className='foto-Nido2' />
            <img src='/img/Nido.png' className='foto-Nido3' />
          </div>
        </div>
      ) 
      // Si no hay ni usuario ni jugador
      : (
        <>
          <h1>Por favor,  <Link to={"/login"}>Inicia sesión</Link> , <Link to={"/register"}>Regístrate</Link> o <Link to={"/loginjugador"}>Loguéate como jugador</Link></h1>
          <img src="/img/portada.jpg" alt="Portada" className="portada-image" />
        </>
      )}
    </div>
  );
};
export default MainPage;