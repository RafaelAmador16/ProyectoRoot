import { useEffect, useState } from "react";
import { useUser } from "./context/UserProvider";
import { getLigasNoTerminadas } from "../helper/ligasHelper";
import { Link } from "react-router-dom";

const LigaNoTerminada = () => {
  const [ligasNoTerminadas, setLigasNoTerminadas] = useState([]);
  const [isLoading, setIsLoading] = useState(true); 
  const { user } = useUser();

  useEffect(() => {
    if(user){
      const fetchLigas = async () => {
        if (user) {
          try {
            setIsLoading(true); 
            const ligas = await getLigasNoTerminadas(user.id);
            setLigasNoTerminadas(ligas);
          } catch (error) {
            console.error("Error al obtener ligas no terminadas:", error);
          } finally {
            setIsLoading(false); 
          }
        }
      };
      fetchLigas();
    }
  }, [user]);

  return (
    <>
      <div className="ligas-container">
        <h1 className="ligas-title">Ligas Actuales</h1>
        {isLoading ? (
          <div className="loading"><h2>Cargando ligas...</h2></div>
        ) : ligasNoTerminadas.length > 0 ? (
          <ul className="ligas-list">
            {ligasNoTerminadas.map((liga) => (
              <Link to={`/liga-actual/${liga.id}`} key={liga.id} className="links">
                <li  className="ligas-item">
                  <h2>{liga.name}</h2>
                </li>
              </Link>
            ))}
          </ul>
        ) : (
          <p className="no-ligas">No hay ligas actuales para este usuario.</p>
        )}
      </div>
    </>
  );
};

export default LigaNoTerminada;

