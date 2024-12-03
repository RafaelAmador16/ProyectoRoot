import { useEffect, useState } from 'react';
import { useUser } from '../components/context/UserProvider';
import { fetchUserJugadores } from '../helper/jugadoresHelper';
import { getEstadisticasJugadorGeneral } from '../helper/estadisticasHelper';
import NavigationButtons from '../components/NavigationButtons';
import { Link } from 'react-router-dom';

const EstadisticasTusJugadores = () => {
  const { user } = useUser();
  const [estadisticasJugadores, setEstadisticasJugadores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEstadisticas = async () => {
      try {
        if (!user || !user.id) {
          console.warn("No se puede obtener información del usuario.");
          return;
        }
        const jugadoresUrls = await fetchUserJugadores(user.id);

        if (!jugadoresUrls || jugadoresUrls.length === 0) {
          console.warn("El usuario no tiene jugadores asociados.");
          return;
        }

        const estadisticas = await Promise.all(
          jugadoresUrls.map(async (jugadorUrl) => {
            const jugadorId = jugadorUrl.split('/').pop();
            const estadisticasJugador = await getEstadisticasJugadorGeneral(jugadorId);
            return {
              id: jugadorId,
              ...estadisticasJugador,
            };
          })
        );

        setEstadisticasJugadores(estadisticas);
        setLoading(false);
      } catch (error) {
        console.error("Error al cargar estadísticas:", error);
        setLoading(false);
      }
    };

    fetchEstadisticas();
  }, [user]);

  if (loading) {
    return (
      <div className="loading">
        <p>Cargando estadísticas...</p>
      </div>
    );
  }

  return (
    <>
      <div className="estadisticas-liga-container">
        <h1 className="estadisticas-liga-titulo">Tus Jugadores y sus Estadísticas</h1>
        <div className="estadisticas-jugadores-grid">
          {estadisticasJugadores.map((estadistica) => (
            <Link
              key={estadistica.id}
              to={`/tusestadisticas/${estadistica.id}`}
              className={`estadisticas-jugador-block ${estadistica.mejorRol}`}
              aria-label={`Ver estadísticas de ${estadistica.nombre}`}
            >
              <div>
                <h2 className="estadisticas-rol">{estadistica.nombre}</h2>
                <p className="estadisticas-text"><strong>Mejor Rol:</strong> {estadistica.mejorRol || 'N/A'}</p>
                <h3 className="estadisticas-subtitulo">Roles Ganados:</h3>
                <div className="estadisticas-roles">
                  {estadistica.rolesGanados
                    ? Object.entries(estadistica.rolesGanados).map(([rol, veces]) => (
                        <p key={rol} className="estadisticas-text">
                          <strong>{rol}:</strong> {veces} vez/veces
                        </p>
                      ))
                    : <p>No hay datos disponibles.</p>}
                </div>
                <h3 className="estadisticas-subtitulo">Posiciones:</h3>
                <div className="estadisticas-posiciones">
                  {estadistica.posiciones
                    ? Object.entries(estadistica.posiciones).map(([pos, veces]) => (
                        <p key={pos} className="estadisticas-text">
                          <strong>Posición {pos}:</strong> {veces} vez/veces
                        </p>
                      ))
                    : <p>No hay datos disponibles.</p>}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
      <NavigationButtons />
    </>
  );
};

export default EstadisticasTusJugadores;
