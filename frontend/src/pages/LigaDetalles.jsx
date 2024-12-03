import { Link, useNavigate, useParams } from "react-router-dom";
import { fetchLigaDetalles } from "../helper/ligasHelper";
import { useEffect, useState } from "react";
import NavigationButtons from "../components/NavigationButtons";
import { useUser } from "../components/context/UserProvider";

const LigaDetalles = () => {
  const { id } = useParams();
  const [datos, setDatos] = useState({});
  const [isLoading, setIsLoading] = useState(true); // Estado para el loading
  const { jugador, user } = useUser();
  const navigate = useNavigate();
  useEffect(() => {
    if(!user && !jugador){
      navigate('/')
  }
    const obtenerDatos = async () => {
      try {
        setIsLoading(true); // Activa el estado de carga
        const datosLiga = await fetchLigaDetalles(id);
        setDatos(datosLiga);
      } catch (error) {
        console.error("Error al obtener los detalles de la liga:", error);
      } finally {
        setIsLoading(false); // Finaliza la carga
      }
    };
    obtenerDatos();
  }, [id]);

  return (
    <>
      <div className="liga-detalles-container">
        {isLoading ? ( // Si está cargando, mostrar el mensaje de carga
          <div className="loading">
            <h2>Cargando detalles de la liga...</h2>
          </div>
        ) : (
          <>
            {/* Mostrar "Rellenar jornada actual" si existe usuario y la liga no está terminada */}
            {user && !datos.terminada && (
              <Link to={`/rellenar/${id}`} className="liga-detalles-link marquesado">
                <h2>Rellenar jornada actual</h2>
              </Link>
            )}

            {/* Mostrar las otras opciones para todos los usuarios */}
            <Link to={`/jornadas-pasadas/${id}`} className="liga-detalles-link nido">
              <h2>Ver jornadas</h2>
            </Link>

            <Link to={`/clasificacion/${id}`} className="liga-detalles-link alianza">
              <h2>Ver clasificación</h2>
            </Link>

            <Link to={`/estadisticas-liga/${id}`} className="liga-detalles-link vagabundo">
              <h2>Ver estadísticas de liga</h2>
            </Link>
          </>
        )}
      </div>
      <NavigationButtons />
    </>
  );
};

export default LigaDetalles;
