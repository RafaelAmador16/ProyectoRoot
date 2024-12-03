import { useEffect, useState } from "react";
import { obtenerJornadasTerminadasPorLiga } from "../helper/ligasHelper";
import { Link, useParams } from "react-router-dom";
import NavigationButtons from "./NavigationButtons";
import { getLigaNameById } from "../helper/ligasHelper"; // Importar la función

const JornadasPasadas = () => {
  const { id } = useParams();
  const [jornadas, setJornadas] = useState([]);
  const [ligaNombre, setLigaNombre] = useState(""); // Nuevo estado para el nombre de la liga
  const [loading, setLoading] = useState(true); // Estado de carga

  useEffect(() => {
    const fetchJornadas = async () => {
      try {
        const jornadasTerminadas = await obtenerJornadasTerminadasPorLiga(id);
        setJornadas(jornadasTerminadas);
      } catch (error) {
        console.error("Error al obtener las jornadas terminadas:", error);
      }
    };

    const fetchLigaNombre = async () => {
      try {
        const nombre = await getLigaNameById(id); // Obtener el nombre de la liga
        setLigaNombre(nombre);
      } catch (error) {
        console.error("Error al obtener el nombre de la liga:", error);
      } finally {
        setLoading(false); // Una vez que se termina de cargar, actualizar el estado de carga
      }
    };

    fetchJornadas();
    fetchLigaNombre(); // Llamar para obtener el nombre de la liga
  }, [id]);

  return (
    <>
      <div className="jornadas-container">
        <h2 className="jornadas-title">
          {loading ? "Cargando..." : `Jornadas Terminadas en la Liga ${ligaNombre}`} {/* Mostrar el nombre de la liga */}
        </h2>
        <div className="jornadas-list">
          {loading ? (
            <p className="loading">Cargando jornadas...</p> // Mensaje de carga
          ) : Array.isArray(jornadas) && jornadas.length > 0 ? (
            jornadas.map((jornada, index) => (
              <Link
                to={`/jornadas-pasadas/${id}/${jornada}`}
                className="jornadas-item"
                key={index}
              >
                Jornada {jornada}
              </Link>
            ))
          ) : (
            <p className="no-jornadas">No hay jornadas terminadas</p>
          )}
        </div>
      </div>
      <NavigationButtons />
    </>
  );
};

export default JornadasPasadas;