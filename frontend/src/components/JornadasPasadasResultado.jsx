import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { obtenerInfoJugadorYRol } from "../helper/ligasHelper";
import NavigationButtons from "./NavigationButtons";

const JornadasPasadasResultado = () => {
  const { id, jornada } = useParams();
  const [resultados, setResultados] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResultados = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/partidas?liga=/api/ligas/${id}`);
        if (!response.ok) {
          throw new Error("Error al obtener los resultados");
        }
        const data = await response.json();

        console.log(data);
        if (!Array.isArray(data.member)) {
          throw new Error("La respuesta de la API no contiene un array de partidas");
        }
        const partidasFiltradas = data.member.filter(
          partida => partida.liga == `/api/ligas/${id}` && partida.jornada == parseInt(jornada)
        );

        if (partidasFiltradas.length === 0) {
          throw new Error("No se encontraron resultados para esta jornada");
        }
        const resultados = await Promise.all(partidasFiltradas.map(async (partida) => {
          console.log(partida);
          const idJugador = partida.jugador.split('/').pop();
          const idRol = partida.rol.split('/').pop();
          const infoJugadorYRol = await obtenerInfoJugadorYRol(partida.id, idJugador, idRol);

          return {
            partidaId: partida.id,
            jugadorId: infoJugadorYRol.jugadorId,
            jugadorNombre: infoJugadorYRol.jugadorNombre,
            rolId: infoJugadorYRol.rolId,
            rolNombre: infoJugadorYRol.rolNombre,
            puntos: partida.puntos || 0,
            posicion: partida.posicion || "No disponible",
            dominancia: partida.dominancia || "No disponible",
          };
        }));

        setResultados(resultados);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchResultados();
  }, [id, jornada]);

  if (loading) {
    return <div className="loading">Cargando resultados...</div>;
  }

  if (error) {
    return <div className="jornadas-pasadas-error">Error: {error}</div>;
  }

  return (
    <>
      <div className="jornadas-pasadas-container">
        <h1 className="jornadas-pasadas-title">Resultados de la jornada {jornada}</h1>
        <table className="jornadas-pasadas-table">
          <thead>
            <tr>
              <th>Jugador</th>
              <th>Rol</th>
              <th>Puntos</th>
              <th>Posición</th>
            </tr>
          </thead>
          <tbody>
            {resultados.map((resultado) => (
              <tr key={resultado.partidaId} className={`${resultado.rolNombre}`}>
                <td>{resultado.jugadorNombre}</td>
                <td>{resultado.rolNombre}</td>
                <td>{resultado.puntos}</td>
                <td>{resultado.posicion}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <NavigationButtons />
    </>
  );
};

export default JornadasPasadasResultado;
