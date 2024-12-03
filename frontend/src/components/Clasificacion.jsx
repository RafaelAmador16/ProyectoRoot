import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchLigaJugadores, getLigaNameById } from '../helper/ligasHelper'; // Importamos la función getLigaNameById
import NavigationButtons from './NavigationButtons';

const Clasificacion = () => {
  const { id } = useParams();
  const [jugadores, setJugadores] = useState([]);
  const [ligaNombre, setLigaNombre] = useState(''); // Estado para almacenar el nombre de la liga
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadJugadores = async () => {
      setLoading(true);
      try {
        const ligaJugadores = await fetchLigaJugadores(id);
        setJugadores(ligaJugadores);
      } catch (error) {
        console.error('Error al cargar los jugadores:', error);
      } finally {
        setLoading(false);
      }
    };

    const loadLigaNombre = async () => {
      try {
        const nombre = await getLigaNameById(id); // Obtener el nombre de la liga
        setLigaNombre(nombre);
      } catch (error) {
        console.error('Error al obtener el nombre de la liga:', error);
      }
    };

    loadJugadores();
    loadLigaNombre(); // Llamamos para obtener el nombre de la liga
  }, [id]);

  if (loading) return <p className="loading-text loading">Cargando clasificación...</p>;

  const jugadoresOrdenados = jugadores.sort((a, b) => {
    if (b.puntos !== a.puntos) {
      return b.puntos - a.puntos;
    }
    return b.puntosTotales - a.puntosTotales;
  });

  return (
    <>
      <div className="clasificacion-container">
        <h1 className="clasificacion-title">
          {loading ? "Cargando..." : `Clasificación de la Liga ${ligaNombre}`} {/* Mostrar el nombre de la liga */}
        </h1>
        {jugadoresOrdenados.length === 0 ? (
          <p className="no-jugadores">No hay jugadores en esta liga</p>
        ) : (
          <ul className="clasificacion-list">
            {jugadoresOrdenados.map((jugador, index) => {
              let rankClass = "rank-other";
              if (index === 0) rankClass = "rank-first";
              else if (index === 1) rankClass = "rank-second";
              else if (index === 2) rankClass = "rank-third";

              return (
                <li key={jugador.id} className="clasificacion-item">
                  <span className={`clasificacion-rank ${rankClass}`}>
                    {index + 1}º
                  </span>
                  <div className="clasificacion-details">
                    <strong>{jugador.nombre}</strong>
                    <div className="clasificacion-points">
                      Puntos: {jugador.puntos}, Puntos Totales: {jugador.puntosTotales}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
      <NavigationButtons />
    </>
  );
};

export default Clasificacion;
