import { useEffect, useState } from "react";
import { useUser } from "./context/UserProvider";
import { getLigasTerminadas } from "../helper/ligasHelper";
import { Link } from "react-router-dom";

const LigaTerminada = () => {
  const [ligasTerminadas, setLigasTerminadas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useUser();

  useEffect(() => {
    if (user) {
      const fetchLigas = async () => {
        try {
          setIsLoading(true);
          const ligas = await getLigasTerminadas(user.id);
          setLigasTerminadas(ligas);
        } catch (error) {
          console.error("Error al obtener ligas terminadas:", error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchLigas();
    }
  }, [user]);

  return (
    <>
      <div className="ligas-container">
        <h1 className="ligas-title">Ligas Terminadas</h1>
        {isLoading ? (
          <div className="loading"><h2>Cargando ligas...</h2></div>
        ) : ligasTerminadas.length > 0 ? (
          <ul className="ligas-list">
            {ligasTerminadas.map((liga) => (
              <Link to={`/liga-terminada/${liga.id}`} key={liga.id} className="links">
                <li key={liga.id} className="ligas-item">
                    <h2>{liga.name}</h2>
                </li>
              </Link>
            ))}
          </ul>
        ) : (
          <p className="no-ligas">No hay ligas terminadas para este usuario.</p>
        )}
      </div>
    </>
  );
};

export default LigaTerminada;
