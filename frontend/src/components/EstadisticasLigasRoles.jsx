import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getNumeroDePosicionPorRolYLiga, getPuntosPorRolEnLiga } from "../helper/estadisticasHelper";

const roles = [1, 2, 3, 4];
const rolesNombre = ["Marquesado", "Nido", "Alianza", "Vagabundo"];

const EstadisticasLigasRoles = () => {
  const { id } = useParams();
  const [estadisticas, setEstadisticas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEstadisticas = async () => {
      setLoading(true); 
      const resultados = await Promise.all(
        roles.map(async (idRol) => {
          const puntos = await getPuntosPorRolEnLiga(idRol, id);
          const posiciones = await getNumeroDePosicionPorRolYLiga(idRol, id);

          return {
            nombreRol: rolesNombre[idRol - 1], 
            puntos,
            ...posiciones, 
          };
        })
      );
      setEstadisticas(resultados);
      setLoading(false); 
    };

    fetchEstadisticas();
  }, [id]);

  if (loading) {
    return <div className="loading">Cargando estadísticas...</div>;
  }
  return (
    <div className="estadisticas-liga-container">
      <h1 className="estadisticas-liga-titulo">Estadísticas de la Liga {id}</h1>
      <div className="estadisticas-jugadores-grid">
        {estadisticas.map(({ nombreRol, puntos, partidasPrimero, partidasSegundo, partidasTercero, partidasCuarto }) => (
          <div key={nombreRol} className={`estadisticas-jugador-block ${nombreRol}`}>
            <h1 className="estadisticas-rol">{nombreRol}</h1>
            <p className="estadisticas-text">Total de puntos: <strong>{puntos}</strong></p>
            <p className="estadisticas-text">Total de puntos de liga: <strong>{partidasPrimero * 5 + partidasSegundo * 3 + partidasTercero * 1}</strong></p>
            <p className="estadisticas-text">Número de veces primero: <strong>{partidasPrimero}</strong></p>
            <p className="estadisticas-text">Número de veces segundo: <strong>{partidasSegundo}</strong></p>
            <p className="estadisticas-text">Número de veces tercero: <strong>{partidasTercero}</strong></p>
            <p className="estadisticas-text">Número de veces cuarto: <strong>{partidasCuarto}</strong></p>
            <p className="estadisticas-text">Porcentaje de victorias: <strong>{(partidasPrimero / (partidasSegundo + partidasTercero + partidasCuarto + partidasPrimero) * 100).toFixed(2)}%</strong></p>
          </div>
        ))}
      </div>
</div>
  );
};

export default EstadisticasLigasRoles;
