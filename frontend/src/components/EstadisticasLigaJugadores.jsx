import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchLigaJugadores } from "../helper/ligasHelper";
import { getEstadisticasJugador } from "../helper/estadisticasHelper";

const EstadisticasLigaJugadores = () => {
  const { id: ligaId } = useParams();
  const [estadisticasJugadores, setEstadisticasJugadores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEstadisticas = async () => {
      setLoading(true); 
      try {
        const listaJugadores = await fetchLigaJugadores(ligaId);
        const estadisticas = await Promise.all(
          listaJugadores.map(async (jugador) => {
            const jugadorId = jugador.jugador.split("/").pop();
            return await getEstadisticasJugador(ligaId, jugadorId);
          })
        );
        setEstadisticasJugadores(estadisticas);
      } catch (error) {
        console.error("Error al cargar estadísticas:", error);
      }
    };

    fetchEstadisticas();
    setLoading(false); // Finalizar carga
  }, [ligaId]);
  if (loading) {
    return <div className="loading">Cargando estadísticas...</div>;
  }

  return (
    <div className="estadisticas-liga-container">
      <h1 style={{marginBottom: '25px'}}>Estadísticas de Jugadores en Liga</h1>
      <div className="estadisticas-jugadores-grid">
        {estadisticasJugadores.map((estadistica, index) => (
          <div key={index} className={`estadisticas-jugador-block ${estadistica.mejorRol}`}>
            <h1>Jugador: {estadistica.nombre}</h1>
            <p className="estadisticas-text"><strong>Mejor Rol:</strong> {estadistica.mejorRol || "N/A"}</p>
            
            <h3>Roles Ganados:</h3>
            <div className="roles-container">
              {Object.entries(estadistica.rolesGanados).map(([rol, veces]) => (
                <p key={rol} className="estadisticas-text">
                  <strong>{rol}:</strong> {veces} vez/veces
                </p>
              ))}
            </div>

            <h3>Posiciones:</h3>
            <div className="posiciones-container">
              {Object.entries(estadistica.posiciones).map(([pos, veces]) => (
                <p key={pos} className="estadisticas-text">
                  <strong>Posición {pos}:</strong> {veces} vez/veces
                </p>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EstadisticasLigaJugadores;
