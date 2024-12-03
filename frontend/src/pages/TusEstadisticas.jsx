import { useEffect, useState } from "react";
import { useUser } from "../components/context/UserProvider";
import { useNavigate, useParams } from "react-router-dom";
import { useJugadores } from "../components/context/JugadoresProvider";
import { contarPosicionesPorRol } from "../helper/estadisticasHelper";
import NavigationButtons from "../components/NavigationButtons";
import "./css/animaciones.css";

const TusEstadisticas = () => {
  const { id } = useParams();
  const { jugador } = useUser();
  const { jugadores } = useJugadores();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [posicionesPorRol, setPosicionesPorRol] = useState({});
  const [puntosPorRol, setPuntosPorRol] = useState({});
  const [rolGanador, setRolGanador] = useState({
    1: { ganador: "perdedor" },
    2: { ganador: "perdedor" },
    3: { ganador: "perdedor" },
    4: { ganador: "perdedor" },
  });
  const [jugadorNombre, setJugadorNombre] = useState("");

  const roleNames = {
    "1": "Marquesado",
    "2": "Nido",
    "3": "Alianza",
    "4": "Vagabundo",
  };

  useEffect(() => {
    if (!jugador && (!jugadores || jugadores.length === 0)) {
      navigate("/");
      return;
    }

    const jugadorValido = jugadores.find((j) => j.id === parseInt(id));

    if (!jugadorValido) {
      if (jugador && jugador.id === parseInt(id)) {
        setJugadorNombre(jugador.name);
      } else {
        navigate("/");
      }
    } else {
      setJugadorNombre(jugadorValido.name);
    }
  }, [id, jugador, jugadores, navigate]);

  useEffect(() => {
    const fetchEstadisticas = async () => {
      setLoading(true);
      setError(null);

      try {
        const { posiciones, puntosPorRol } = await contarPosicionesPorRol(id);
        setPosicionesPorRol(posiciones);
        setPuntosPorRol(puntosPorRol);
        setLoading(false);
      } catch (error) {
        setError(error.message || "Ocurrió un error al obtener las estadísticas.");
        setLoading(false);
      }
    };

    if (id) fetchEstadisticas();
  }, [id]);

  useEffect(() => {
    const determinarRolGanador = () => {
  
      let maxPuntos = -1;
      let ganadorId = null;
  
      Object.entries(puntosPorRol).forEach(([rolId, puntos]) => {
        if (puntos > maxPuntos) {
          maxPuntos = puntos;
          ganadorId = rolId; // Rol ID sigue siendo el ID numérico
        }
      });
  
      // Mapa de roles con nombres
      const roleNames = {
        "1": "Marquesado",
        "2": "Nido",
        "3": "Alianza",
        "4": "Vagabundo",
      };
      setRolGanador((prevState) => {
        const newState = { ...prevState };
  
        // Usamos roleNames[rolId] para comparar el nombre del rol con el ganador
        Object.keys(prevState).forEach((rolId) => {
          const rolName = roleNames[rolId]; // Obtenemos el nombre del rol
          newState[rolId] = { ganador: rolName == ganadorId ? "ganador" : "perdedor" };
        });
  
        return newState;
      });
    };
  
    if (puntosPorRol && Object.keys(puntosPorRol).length > 0) {
      determinarRolGanador();
    } 
  }, [puntosPorRol]);
  
  if (loading) {
    return <div className="loading">Cargando estadísticas...</div>;
  }

  if (error) {
    return <div className="estadisticas-error">Error: {error}</div>;
  }

  return (
    <>
      <div className="estadisticas-liga-container">
        <h2 className="estadisticas-liga-titulo">
          {jugadorNombre ? `Estadísticas de ${jugadorNombre}` : "Tus Estadísticas"}
        </h2>
        <div className="estadisticas-jugadores-grid">
          {Object.keys(posicionesPorRol).map((roleId) => {
            const roleName = roleNames[roleId] || `Rol ${roleId}`;
            const posiciones = posicionesPorRol[roleId] || { 1: 0, 2: 0, 3: 0, 4: 0 };
            const puntos = puntosPorRol[roleId] || 0;

            return (
              <div key={roleId} className={`estadisticas-jugador-block ${roleName}`}>
                <h4 className="estadisticas-rol">{roleName}:</h4>
                <p className="estadisticas-text">
                  Primer puesto: <b>{posiciones[1]}</b>
                </p>
                <p className="estadisticas-text">
                  Segundo puesto: <b>{posiciones[2]}</b>
                </p>
                <p className="estadisticas-text">
                  Tercer puesto: <b>{posiciones[3]}</b>
                </p>
                <p className="estadisticas-text">
                  Cuarto puesto: <b>{posiciones[4]}</b>
                </p>
                <p className="estadisticas-text">
                  Suma de puntos: <b>{puntos}</b>
                </p>
              </div>
            );
          })}
        </div>
      </div>
      <NavigationButtons />
      <div className="imagenes-roles-container">
        <img
          src="/img/Marquesado.png"
          className={`marquesado-${rolGanador["1"].ganador}`}
        />
        <img
          src="/img/Nido.png"
          className={`nido-${rolGanador["2"].ganador}`}
        />
        <img
          src="/img/Alianza.png"
          className={`alianza-${rolGanador["3"].ganador}`}
        />
        <img
          src="/img/Vagabundo.png"
          className={`vagabundo-${rolGanador["4"].ganador}`}
        />
      </div>
    </>
  );
};

export default TusEstadisticas;
