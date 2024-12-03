import { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { addLigaToAPI, addJugadoresToLigaAPI, addPartidasToAPI } from "../helper/ligasHelper";
import { useJugadores } from "./context/JugadoresProvider";
import { useUser } from "./context/UserProvider";

const LigaForm = () => {
  const { jugadores } = useJugadores();
  const { user } = useUser();
  const [nombre, setNombre] = useState("");
  const [vueltas, setVueltas] = useState(1);
  const [jugador1, setJugador1] = useState(0);
  const [jugador2, setJugador2] = useState(0);
  const [jugador3, setJugador3] = useState(0);
  const [jugador4, setJugador4] = useState(0);
  const [rolesDisponibles, setRolesDisponibles] = useState([]);
  const [jugadoresFiltrados, setJugadoresFiltrados] = useState([]);

  useEffect(() => {
    setRolesDisponibles([
      { id: 1, name: "Marquesado" },
      { id: 2, name: "Nido" },
      { id: 3, name: "Alianza" },
      { id: 4, name: "Vagabundo" },
    ]);
  }, []);

  useEffect(() => {
    if (user) {
      const jugadoresDelUsuario = jugadores.filter((jugador) => {
        const creatorId = jugador.creator.split("/").pop();
        return creatorId == user.id;
      });

      setJugadoresFiltrados(jugadoresDelUsuario);
    }
  }, [jugadores, user]);

  const handleChangeNombre = (e) => setNombre(e.target.value);
  const handleChangeVueltas = (e) => setVueltas(e.target.value);
  const handleChangeJugador1 = (e) => setJugador1(e.target.value);
  const handleChangeJugador2 = (e) => setJugador2(e.target.value);
  const handleChangeJugador3 = (e) => setJugador3(e.target.value);
  const handleChangeJugador4 = (e) => setJugador4(e.target.value);

  const asignarRoles = (jugadores, jornada) => {
    const numRoles = rolesDisponibles.length;
    return jugadores.map((jugador, index) => ({
      jugador_id: jugador.id,
      rol_id: rolesDisponibles[(index + jornada - 1) % numRoles]?.id,
    }));
  };

  const mezclarRoles = () => {
    return [...rolesDisponibles].sort(() => Math.random() - 0.5);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!nombre || !jugador1 || !jugador2 || !jugador3 || !jugador4) {
      console.error("Es necesario un nombre y 4 jugadores");
      return;
    }

    const nuevaLiga = {
      name: nombre,
      jornadas: vueltas * 4,
      terminada: false,
      creador: `/api/users/${user.id}`,
    };
    try {
      const ligaCreada = await addLigaToAPI(nuevaLiga);
      const ligaId = ligaCreada.id;
      if (ligaCreada) {
        const jugadoresSeleccionados = [jugador1, jugador2, jugador3, jugador4].map((id) => {
          if (!id || id == 0) {
            console.error("Jugador seleccionado tiene ID inválido:", id);
            throw new Error("ID de jugador inválido");
          }
          return { id };
        });

        await addJugadoresToLigaAPI(jugadoresSeleccionados, ligaId);

        for (let jornada = 1; jornada <= vueltas * 4; jornada++) {
          let rolesActuales = rolesDisponibles;

          if (jornada > 4 && (jornada - 1) % 4 === 0) {
            rolesActuales = mezclarRoles();
          }

          const jugadoresConRoles = asignarRoles(jugadoresSeleccionados, jornada);

          for (const jugador of jugadoresConRoles) {
            try {
              await addPartidasToAPI({
                liga: `/api/ligas/${ligaId}`,
                jugador: `/api/jugadores/${jugador.jugador_id}`,
                rol: `/api/roles/${jugador.rol_id}`,
                jornada,
                posicion: null,
                dominancia: false,
                puntos: 0,
                terminada: false,
              });
            } catch (error) {
              console.error("Hubo un problema al guardar los datos de la partida:", error);
            }
          }
        }

        console.log("Liga, jugadores y partidas creadas correctamente");
        setNombre("");
        setVueltas(1);
        setJugador1(0);
        setJugador2(0);
        setJugador3(0);
        setJugador4(0);
      }
    } catch (error) {
      console.error("Error al crear la liga, jornadas o asociar jugadores:", error);
    }
  };

  return (
    <div>
        <h1 className="titulo">Crear liga</h1>
        <div className="liga-form-container">
          <form onSubmit={handleSubmit} className="liga-form">
            <input
              type="text"
              value={nombre}
              onChange={handleChangeNombre}
              placeholder="Nombre de la liga"
              name="nombre"
              className="liga-input"
            />
            <label className="liga-label">
            
            <span className="liga-label-text">Numero de vueltas</span>
            <input
              type="number"
              value={vueltas}
              onChange={handleChangeVueltas}
              placeholder="Número de vueltas"
              min="1"
              max="4"
              className="liga-input2"
            />
            </label>

            {jugadoresFiltrados.length >= 4 ? (
              <>
                <select value={jugador1} onChange={handleChangeJugador1} required className="liga-select">
                  <option value={0}>Jugador 1</option>
                  {jugadoresFiltrados
                    .filter((jugador) => jugador.id != jugador2 && jugador.id != jugador3 && jugador.id != jugador4)
                    .map((jugador) => (
                      <option key={jugador.id} value={jugador.id}>
                        {jugador.name}
                      </option>
                    ))}
                </select>

                <select value={jugador2} onChange={handleChangeJugador2} required className="liga-select">
                  <option value={0}>Jugador 2</option>
                  {jugadoresFiltrados
                    .filter((jugador) => jugador.id != jugador1 && jugador.id != jugador3 && jugador.id != jugador4)
                    .map((jugador) => (
                      <option key={jugador.id} value={jugador.id}>
                        {jugador.name}
                      </option>
                    ))}
                </select>

                <select value={jugador3} onChange={handleChangeJugador3} required className="liga-select">
                  <option value={0}>Jugador 3</option>
                  {jugadoresFiltrados
                    .filter((jugador) => jugador.id != jugador1 && jugador.id != jugador2 && jugador.id != jugador4)
                    .map((jugador) => (
                      <option key={jugador.id} value={jugador.id}>
                        {jugador.name}
                      </option>
                    ))}
                </select>

                <select value={jugador4} onChange={handleChangeJugador4} required className="liga-select">
                  <option value={0}>Jugador 4</option>
                  {jugadoresFiltrados
                    .filter((jugador) => jugador.id != jugador1 && jugador.id != jugador2 && jugador.id != jugador3)
                    .map((jugador) => (
                      <option key={jugador.id} value={jugador.id}>
                        {jugador.name}
                      </option>
                    ))}
                </select>

                <button type="submit" className="liga-submit">
                  Crear Liga
                </button>
              </>
            ) : (
              <div>
                <p>No tienes suficientes jugadores (mínimo 4) para crear una liga.</p>
                <Link to="/jugadorcreate" className="liga-create-link">
                  Crear nuevos jugadores
                </Link>
              </div>
            )}
          </form>
        </div>
    </div>
    
  );
};

export default LigaForm;
