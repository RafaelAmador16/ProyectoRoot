import { useEffect, useState } from "react";
import { 
  fetchFirstPlaceGames, 
  fetchFourthPlaceGames, 
  fetchSecondPlaceGames, 
  fetchThirdPlaceGames, 
  fetchTotalPartidasTerminadas 
} from "../helper/estadisticasHelper";
import NavigationButtons from "../components/NavigationButtons";
import "./css/animaciones.css"

const EstadisticasRoles = () => {
  const [loading, setLoading] = useState(true);
  const [partidasTerminadas, setPartidasTerminadas] = useState({
    1: { partidas: 0, sumaPuntos: 0 },
    2: { partidas: 0, sumaPuntos: 0 },
    3: { partidas: 0, sumaPuntos: 0 },
    4: { partidas: 0, sumaPuntos: 0 },
  });
  const [partidasPrimero, setPartidasPrimero] = useState({
    1: { partidas: 0 },
    2: { partidas: 0 },
    3: { partidas: 0 },
    4: { partidas: 0 },
  });
  
  const [partidasSegundo, setPartidasSegundo] = useState({
    1: { partidas: 0 },
    2: { partidas: 0 },
    3: { partidas: 0 },
    4: { partidas: 0 },
  });
  
  const [partidasTercero, setPartidasTercero] = useState({
    1: { partidas: 0 },
    2: { partidas: 0 },
    3: { partidas: 0 },
    4: { partidas: 0 },
  });
  
  const [partidasCuarto, setPartidasCuarto] = useState({
    1: { partidas: 0 },
    2: { partidas: 0 },
    3: { partidas: 0 },
    4: { partidas: 0 },
  });
  const [rolGanador, setRolGanador] = useState({
    1: { ganador: "perdedor"},
    2: { ganador: "perdedor"},
    3: { ganador: "perdedor"},
    4: { ganador: "perdedor"}
  })
  
  const [error, setError] = useState(null);

  useEffect(() => {
    const getTotalPartidasTerminadas = async () => {
      setLoading(true);
      try {
        const rolesIds = [1, 2, 3, 4];  // IDs de los roles
        for (const id of rolesIds) {
          // Fetching data for partidasTerminadas
          const { partidas, sumaPuntos } = await fetchTotalPartidasTerminadas(id);
          setPartidasTerminadas((prevState) => ({
            ...prevState,
            [id]: { partidas, sumaPuntos },
          }));

          // Fetching data for each place (primero, segundo, tercero, cuarto)
          const { partidas: partidasPrimeroResult } = await fetchFirstPlaceGames(id);
          const { partidas: partidasSegundoResult } = await fetchSecondPlaceGames(id);
          const { partidas: partidasTerceroResult } = await fetchThirdPlaceGames(id);
          const { partidas: partidasCuartoResult } = await fetchFourthPlaceGames(id);

          // Updating the state for each place
          setPartidasPrimero((prevState) => ({
            ...prevState,
            [id]: { partidas: partidasPrimeroResult },
          }));

          setPartidasSegundo((prevState) => ({
            ...prevState,
            [id]: { partidas: partidasSegundoResult },
          }));

          setPartidasTercero((prevState) => ({
            ...prevState,
            [id]: { partidas: partidasTerceroResult },
          }));

          setPartidasCuarto((prevState) => ({
            ...prevState,
            [id]: { partidas: partidasCuartoResult },
          }));
        }
        setLoading(false); 
      } catch (error) {
        setError(error.message);
      }
    };

    getTotalPartidasTerminadas();
  }, []);
  
  useEffect(() => {
    const determinarRolGanador = () => {
      let maxPuntos = -1;
      let ganadorId = null;
  
      Object.entries(partidasTerminadas).forEach(([id, { sumaPuntos }]) => {
        if (sumaPuntos > maxPuntos) {
          maxPuntos = sumaPuntos;
          ganadorId = id;
        }
      });
  
      setRolGanador((prevState) => {
        const newState = { ...prevState };
        Object.keys(prevState).forEach((key) => {
          newState[key] = { ganador: key === ganadorId ? "ganador" : "perdedor" };
        });
        return newState;
      });
    };
  
    determinarRolGanador();
  }, [partidasTerminadas]);

  const calculatePercentage = (roleId) => {
    const totalPartidas = partidasTerminadas[roleId]?.partidas || 0;
    const partidasPrimerPuesto = partidasPrimero[roleId]?.partidas || 0;
    return totalPartidas > 0 ? ((partidasPrimerPuesto / totalPartidas) * 100).toFixed(2) : "0.00";
  };
  if (loading) {
    return <div className="loading">Cargando estadísticas...</div>;
  }

  return (
    <>
      <div className="estadisticas-liga-container">
        <h2 className="estadisticas-liga-titulo">Estadísticas</h2>
        <div className="estadisticas-jugadores-grid">
          <div className="estadisticas-jugador-block Marquesado">
            <h4 className="estadisticas-rol">Marquesado:</h4> {/*1 */}
            <p className="estadisticas-text">Primer puesto: <b>{partidasPrimero[1].partidas} partidas</b></p>
            <p className="estadisticas-text">Segundo puesto: <b>{partidasSegundo[1].partidas} partidas</b></p>
            <p className="estadisticas-text">Tercer puesto: <b>{partidasTercero[1].partidas} partidas</b></p>
            <p className="estadisticas-text">Cuarto puesto: <b>{partidasCuarto[1].partidas} partidas</b></p>
            <p className="estadisticas-text">Suma de puntos: <b>{partidasTerminadas[1].sumaPuntos}</b></p>
            <p className="estadisticas-text">
              Porcentaje de Victorias: <b>{calculatePercentage(1)}%</b>
            </p>
          </div>
    
          <div className="estadisticas-jugador-block Nido">
            <h4 className="estadisticas-rol">Nido:</h4> {/*2 */}
            <p className="estadisticas-text">Primer puesto: <b>{partidasPrimero[2].partidas} partidas</b></p>
            <p className="estadisticas-text">Segundo puesto: <b>{partidasSegundo[2].partidas} partidas</b></p>
            <p className="estadisticas-text">Tercer puesto: <b>{partidasTercero[2].partidas} partidas</b></p>
            <p className="estadisticas-text">Cuarto puesto: <b>{partidasCuarto[2].partidas} partidas</b></p>
            <p className="estadisticas-text">Suma de puntos: <b>{partidasTerminadas[2].sumaPuntos}</b></p>
            <p className="estadisticas-text">
              Porcentaje de Primer Puesto: <b>{calculatePercentage(2)}%</b>
            </p>
          </div>
    
          <div className="estadisticas-jugador-block Alianza">
            <h4 className="estadisticas-rol">Alianza:</h4> {/*3 */}
            <p className="estadisticas-text">Primer puesto: <b>{partidasPrimero[3].partidas} partidas</b></p>
            <p className="estadisticas-text">Segundo puesto: <b>{partidasSegundo[3].partidas} partidas</b></p>
            <p className="estadisticas-text">Tercer puesto: <b>{partidasTercero[3].partidas} partidas</b></p>
            <p className="estadisticas-text">Cuarto puesto: <b>{partidasCuarto[3].partidas} partidas</b></p>
            <p className="estadisticas-text">Suma de puntos: <b>{partidasTerminadas[3].sumaPuntos}</b></p>
            <p className="estadisticas-text">
              Porcentaje de Primer Puesto: <b>{calculatePercentage(3)}%</b>
            </p>
          </div>
    
          <div className="estadisticas-jugador-block Vagabundo">
            <h4 className="estadisticas-rol">Vagabundo:</h4> {/*4 */}
            <p className="estadisticas-text">Primer puesto: <b>{partidasPrimero[4].partidas} partidas</b></p>
            <p className="estadisticas-text">Segundo puesto: <b>{partidasSegundo[4].partidas} partidas</b></p>
            <p className="estadisticas-text">Tercer puesto: <b>{partidasTercero[4].partidas} partidas </b></p>
            <p className="estadisticas-text">Cuarto puesto: <b>{partidasCuarto[4].partidas} partidas </b></p>
            <p className="estadisticas-text">Suma de puntos: <b>{partidasTerminadas[4].sumaPuntos}</b></p>
            <p className="estadisticas-text">
              Porcentaje de Primer Puesto: <b>{calculatePercentage(4)}%</b>
            </p>
          </div>
        </div>
        {error && <p className="estadisticas-error">Error: {error}</p>}
      </div>
      <NavigationButtons />
      <div className="imagenes-roles-container">
        <img src="/img/Marquesado.png" className={`marquesado-${rolGanador[1].ganador}`} />
        <img src="/img/Nido.png"  className={`nido-${rolGanador[2].ganador}`}/>
        <img src="/img/Alianza.png" className={`alianza-${rolGanador[3].ganador}`} />
        <img src="/img/Vagabundo.png" className={`vagabundo-${rolGanador[4].ganador}`} />
      </div>
      
    </>
  );

};

export default EstadisticasRoles;
