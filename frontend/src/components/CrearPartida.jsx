import { useEffect, useState } from 'react';
import { useJugadores } from './context/JugadoresProvider'; // Obtener jugadores filtrados
import { Link, useNavigate } from 'react-router-dom'; // Para redireccionar al finalizar
import "../pages/css/otros.css"
import NavigationButtons from './NavigationButtons';

const CrearPartida = () => {
    const { jugadores } = useJugadores(); // Jugadores filtrados por usuario
    const [jugador1, setJugador1] = useState(0);
    const [jugador2, setJugador2] = useState(0);
    const [jugador3, setJugador3] = useState(0);
    const [jugador4, setJugador4] = useState(0);

    const [rol1, setRol1] = useState(0);
    const [rol2, setRol2] = useState(0);
    const [rol3, setRol3] = useState(0);
    const [rol4, setRol4] = useState(0);

    const [rolesDisponibles, setRolesDisponibles] = useState([]);
    const [error, setError] = useState(""); // Estado para manejar errores
    const [partidaExistente, setPartidaExistente] = useState(false); // Estado para verificar partida existente
    const navigate = useNavigate(); // Usamos useNavigate para redirigir

    useEffect(() => {
        // Definir manualmente los roles disponibles
        setRolesDisponibles([
            { id: 1, name: 'Marquesado' },
            { id: 2, name: 'Nido' },
            { id: 3, name: 'Alianza' },
            { id: 4, name: 'Vagabundo' }
        ]);

        // Verificar si ya existe una partida en el localStorage
        const partida = localStorage.getItem('partida');
        setPartidaExistente(Boolean(partida));
    }, []);
    console.log(jugadores);

    // Validar que no haya jugadores repetidos
    const validateUniquePlayers = () => {
        const jugadoresSeleccionados = [jugador1, jugador2, jugador3, jugador4];
        const jugadoresUnicos = new Set(jugadoresSeleccionados.filter(j => j !== 0));
        return jugadoresSeleccionados.length === jugadoresUnicos.size;
    };

    // Validar que no haya roles repetidos
    const validateUniqueRoles = () => {
        const rolesSeleccionados = [rol1, rol2, rol3, rol4];
        const rolesUnicos = new Set(rolesSeleccionados.filter(r => r !== 0));
        return rolesSeleccionados.length === rolesUnicos.size;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!validateUniquePlayers()) {
            setError("No se pueden seleccionar jugadores repetidos.");
            return;
        }

        if (!validateUniqueRoles()) {
            setError("No se pueden seleccionar roles repetidos.");
            return;
        }

        const partida = {
            jugadores: [
                {
                    id: jugador1,
                    nombre: jugadores.find(j => j.id === jugador1).name,
                    rol: {
                        id: rol1,
                        nombre: rolesDisponibles.find(r => r.id === rol1).name
                    }
                },
                {
                    id: jugador2,
                    nombre: jugadores.find(j => j.id === jugador2).name,
                    rol: {
                        id: rol2,
                        nombre: rolesDisponibles.find(r => r.id === rol2).name
                    }
                },
                {
                    id: jugador3,
                    nombre: jugadores.find(j => j.id === jugador3).name,
                    rol: {
                        id: rol3,
                        nombre: rolesDisponibles.find(r => r.id === rol3).name
                    }
                },
                {
                    id: jugador4,
                    nombre: jugadores.find(j => j.id === jugador4).name,
                    rol: {
                        id: rol4,
                        nombre: rolesDisponibles.find(r => r.id === rol4).name
                    }
                },
            ]
        };

        localStorage.setItem('partida', JSON.stringify(partida));
        navigate('/detalles-partida'); // Redirigir a la página de detalles de la partida
    };

    const handleChangeJugador1 = (e) => setJugador1(Number(e.target.value));
    const handleChangeJugador2 = (e) => setJugador2(Number(e.target.value));
    const handleChangeJugador3 = (e) => setJugador3(Number(e.target.value));
    const handleChangeJugador4 = (e) => setJugador4(Number(e.target.value));

    const handleChangeRol1 = (e) => setRol1(Number(e.target.value));
    const handleChangeRol2 = (e) => setRol2(Number(e.target.value));
    const handleChangeRol3 = (e) => setRol3(Number(e.target.value));
    const handleChangeRol4 = (e) => setRol4(Number(e.target.value));

    // Asignar roles de manera aleatoria
    const assignRandomRoles = () => {
        const rolesShuffled = [...rolesDisponibles].sort(() => Math.random() - 0.5);
        setRol1(rolesShuffled[0].id);
        setRol2(rolesShuffled[1].id);
        setRol3(rolesShuffled[2].id);
        setRol4(rolesShuffled[3].id);
    };

    // Función para borrar la partida existente del localStorage y mostrar el formulario nuevamente
    const handleNuevaPartida = () => {
        localStorage.removeItem('partida');
        setPartidaExistente(false);
        setError(""); // Limpia el error si hay alguno
        // Resetea el estado de los jugadores y roles
        setJugador1(0);
        setJugador2(0);
        setJugador3(0);
        setJugador4(0);
        setRol1(0);
        setRol2(0);
        setRol3(0);
        setRol4(0);
    };

    // Función para filtrar jugadores ya seleccionados, pero mostrando siempre el jugador ya elegido en su campo
    const filtrarJugadoresDisponibles = (jugadorActual) => {
        return jugadores.filter(jugador =>
            jugador.id === jugadorActual || 
            (jugador.id !== jugador1 &&
            jugador.id !== jugador2 &&
            jugador.id !== jugador3 &&
            jugador.id !== jugador4)
        );
    };

    // Función para filtrar roles ya seleccionados, pero mostrando siempre el rol ya elegido en su campo
    const filtrarRolesDisponibles = (rolActual) => {
        return rolesDisponibles.filter(rol =>
            rol.id === rolActual ||
            (rol.id !== rol1 &&
            rol.id !== rol2 &&
            rol.id !== rol3 &&
            rol.id !== rol4)
        );
    };

    return (
      <>
        <div className="partida-form-container">
        {partidaExistente ? (
          <div className="existing-partida">
            <p>Ya existe una partida creada.</p>
            <Link to="/detalles-partida" className="details-link">
              Ver detalles de la partida existente
            </Link>
            <button onClick={handleNuevaPartida} className="create-new-button">
              Crear nueva partida
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="partida-form">
            {error && <p className="error-message">{error}</p>}
            {jugadores.length >= 4 ? (
              <>
                <h2>Seleccionar Jugadores</h2>
                <select value={jugador1} onChange={handleChangeJugador1} required className="form-select">
                  <option value={0}>Jugador 1</option>
                  {filtrarJugadoresDisponibles(jugador1).map((jugador) => (
                    <option key={jugador.id} value={jugador.id}>
                      {jugador.name}
                    </option>
                  ))}
                </select>
  
                <select value={jugador2} onChange={handleChangeJugador2} required className="form-select ">
                  <option value={0}>Jugador 2</option>
                  {filtrarJugadoresDisponibles(jugador2).map((jugador) => (
                    <option key={jugador.id} value={jugador.id}>
                      {jugador.name}
                    </option>
                  ))}
                </select>
  
                <select value={jugador3} onChange={handleChangeJugador3} required className="form-select">
                  <option value={0}>Jugador 3</option>
                  {filtrarJugadoresDisponibles(jugador3).map((jugador) => (
                    <option key={jugador.id} value={jugador.id}>
                      {jugador.name}
                    </option>
                  ))}
                </select>
  
                <select value={jugador4} onChange={handleChangeJugador4} required className="form-select">
                  <option value={0}>Jugador 4</option>
                  {filtrarJugadoresDisponibles(jugador4).map((jugador) => (
                    <option key={jugador.id} value={jugador.id}>
                      {jugador.name}
                    </option>
                  ))}
                </select>
  
                <h2>Seleccionar Roles</h2>
                <select value={rol1} onChange={handleChangeRol1} required className="form-select">
                  <option value={0}>Selecciona un rol</option>
                  {filtrarRolesDisponibles(rol1).map((rol) => (
                    <option key={rol.id} value={rol.id}>
                      {rol.name}
                    </option>
                  ))}
                </select>
  
                <select value={rol2} onChange={handleChangeRol2} required className="form-select">
                  <option value={0}>Selecciona un rol</option>
                  {filtrarRolesDisponibles(rol2).map((rol) => (
                    <option key={rol.id} value={rol.id}>
                      {rol.name}
                    </option>
                  ))}
                </select>
  
                <select value={rol3} onChange={handleChangeRol3} required className="form-select">
                  <option value={0}>Selecciona un rol</option>
                  {filtrarRolesDisponibles(rol3).map((rol) => (
                    <option key={rol.id} value={rol.id}>
                      {rol.name}
                    </option>
                  ))}
                </select>
  
                <select value={rol4} onChange={handleChangeRol4} required className="form-select">
                  <option value={0}>Selecciona un rol</option>
                  {filtrarRolesDisponibles(rol4).map((rol) => (
                    <option key={rol.id} value={rol.id}>
                      {rol.name}
                    </option>
                  ))}
                </select>
  
                <button type="button" onClick={assignRandomRoles} className="random-button">
                  Asignar Roles Aleatoriamente
                </button>
  
                <button type="submit" className="submit-button">
                  Crear Partida
                </button>
              </>
            ) : (
              <div className="no-players-warning">
                <p>No tienes suficientes jugadores (mínimo 4) para crear una partida.</p>
                <Link to="/jugadorcreate" className="create-players-link">
                  Crear nuevos jugadores
                </Link>
              </div>
            )}
          </form>
        )}
      </div>
      <NavigationButtons />
    </>
    );
};

export default CrearPartida;
