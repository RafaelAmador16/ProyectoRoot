import { useEffect, useState } from "react";
import { useUser } from "./context/UserProvider";
import { getLigasJugador, getLigaNameById } from "../helper/ligasHelper"; // Importar el helper
import { Link } from "react-router-dom";
import NavigationButtons from "./NavigationButtons";

const LigasJugador = () => {
  const [ligasJugador, setLigasJugador] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { jugador } = useUser(); // Usar jugador en lugar de user

  useEffect(() => {
    if (jugador) {
      const fetchLigasJugador = async () => {
        try {
          setIsLoading(true);
          const ligas = await getLigasJugador(jugador.id);

          // Mapear ligas con nombres obtenidos usando el helper
          const ligasConNombres = await Promise.all(
            ligas.map(async (liga) => {
              const ligaId = extractLigaId(liga.id); // Extrae el ID de la URL
              const name = await getLigaNameById(ligaId); // Obtiene el nombre de la liga
              return { id: ligaId, name };
            })
          );

          setLigasJugador(ligasConNombres);
        } catch (error) {
          console.error("Error al obtener las ligas del jugador:", error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchLigasJugador();
    }
  }, [jugador]);

  const extractLigaId = (url) => {
    const parts = url.split("/");
    return parts[parts.length - 1];
  };

  return (
    <>
      <div className="ligas-container">
        <h1 className="ligas-title">Ligas en las que perteneces</h1>
        {isLoading ? (
          <div className="loading">
            <h2>Cargando ligas...</h2>
          </div>
        ) : ligasJugador.length > 0 ? (
          <ul className="ligas-list">
            {ligasJugador.map((liga) => (
              <Link to={`/liga-actual/${liga.id}`} key={liga.id} className="links">
                <li className="ligas-item">
                  <h2>{liga.name}</h2>
                </li>
              </Link>
            ))}
          </ul>
        ) : (
          <p className="no-ligas">No hay ligas asociadas con este jugador.</p>
        )}
      </div>
      <NavigationButtons />
      <div className="animacion-vagabundo">
        <img src="./img/Alianza.png" className="foto-Alianza1" />
        <img src="./img/Alianza.png" className="foto-Alianza2" />
        <img src="./img/Vagabundo.png" className="foto-Vagabundo1" />
      </div>

    </>
  );
};

export default LigasJugador;