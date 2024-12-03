import { useEffect, useState } from 'react';
import { addPartidasToAPI } from '../helper/ligasHelper';
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';
import "../pages/css/otros.css";
import NavigationButtons from './NavigationButtons';

const DetallesPartida = () => {
  const [partida, setPartida] = useState(null);
  const [jugadores, setJugadores] = useState([]);
  const [ranking, setRanking] = useState(null);

  useEffect(() => {
    const partidaData = localStorage.getItem("partida");
    if (partidaData) {
      const partida = JSON.parse(partidaData);
      setPartida(partida);

      const jugadoresIniciales = partida.jugadores.map((jugador) => ({
        id: jugador.id,
        nombre: jugador.nombre,
        rol: jugador.rol.id,
        nombreRol: jugador.rol.nombre,
        puntos: 0,
        dominancia: false,
      }));

      setJugadores(jugadoresIniciales);
    }
  }, []);

  const validateDominancia = (puntos, dominancia) => {
    if (dominancia && puntos !== 30) {
      Swal.fire(
        "Error",
        "La dominancia solo puede asignarse a jugadores con exactamente 30 puntos.",
        "error"
      );
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const jugadoresCon30Puntos = jugadores.filter((jugador) => jugador.puntos == 30);

    if (jugadoresCon30Puntos.length == 0) {
      Swal.fire("Error", "Debe haber al menos un jugador con 30 puntos.", "error");
      return;
    }

    if (jugadoresCon30Puntos.length > 2) {
      Swal.fire("Error", "No pueden haber más de 2 jugadores ganadores.", "error");
      return;
    }

    if (jugadoresCon30Puntos.length == 2) {
      const vagabundoConDominancia = jugadoresCon30Puntos.find(
        (jugador) => jugador.nombreRol === "Vagabundo" && jugador.dominancia
      );
      const otroConDominancia = jugadoresCon30Puntos.find(
        (jugador) => jugador.nombreRol !== "Vagabundo" && jugador.dominancia
      );

      if (!vagabundoConDominancia || !otroConDominancia) {
        Swal.fire(
          "Error",
          "Solo el Vagabundo y otro rol con dominancia pueden tener 30 puntos.",
          "error"
        );
        return;
      }
    }

    for (let jugador of jugadores) {
      if (!validateDominancia(jugador.puntos, jugador.dominancia)) {
        return;
      }
    }

    let ranking = [...jugadores].sort((a, b) => b.puntos - a.puntos);
    const empate = ranking.filter((jugador) => jugador.puntos == ranking[0].puntos);

    if (empate.length > 1) {
      const todosCon30 = empate.every((jugador) => jugador.puntos == 30);

      if (todosCon30) {
        Swal.fire({
          title: "Empate con 30 puntos",
          text: "Los jugadores empatados compartirán el primer lugar.",
          icon: "info",
        });

        empate.forEach((jugador) => (jugador.posicion = 1));
        ranking = [
          ...empate,
          ...ranking.filter((jugador) => jugador.puntos != 30),
        ];
      } else {
        Swal.fire({
          title: "Empate sin 30 puntos",
          text: "Los jugadores empatados compartirán el último lugar.",
          icon: "info",
        });

        const ultimaPosicion = ranking.length;
        empate.forEach((jugador) => (jugador.posicion = ultimaPosicion));
        ranking = [
          ...ranking.filter((jugador) => !empate.includes(jugador)),
          ...empate,
        ];
      }
    }

    let currentPos = 1;
    for (let i = 0; i < ranking.length; i++) {
      if (i > 0 && ranking[i].puntos == ranking[i - 1].puntos) {
        ranking[i].posicion = ranking[i - 1].posicion;
      } else {
        ranking[i].posicion = currentPos;
      }
      currentPos++;
    }

    try {
      const requests = ranking.map((data) =>
        addPartidasToAPI({
          jugador: `/api/jugadores/${data.id}`,
          rol: `/api/roles/${data.rol}`,
          dominancia: data.dominancia,
          puntos: data.puntos,
          terminada: true,
          posicion: data.posicion,
        })
      );
      await Promise.all(requests);
    } catch (error) {
      console.error("Hubo un problema al guardar los datos de la partida:", error);
    }

    setRanking(ranking);
    localStorage.removeItem("partida");
  };

  return (
    <>
      <div className="detalles-partida-container">
        {ranking ? (
          <div className=''>
            {ranking.map((jugador) => (
              <div className={`detalles-partida-ranking ${jugador.nombreRol}`} key={jugador.id}>
                <div className={`detalles-partida-ranking2`}>
                  <div className="info-izquierda">
                    - <strong>{jugador.nombre}</strong> (<span>{jugador.nombreRol}</span>)
                  </div>
                  <div className="info-derecha">
                    <strong>{jugador.puntos} puntos</strong> - posición: <strong>{jugador.posicion}</strong>
                  </div>
                </div>
              </div>
            ))}
            <div className="detalles-partida-boton-container">
              <Link to={'/'}>
                <button className="detalles-partida-boton">Volver</button>
              </Link>
            </div>
          </div>
        ) : partida ? (
          <form onSubmit={handleSubmit} className="detalles-partida-form">
            {jugadores.map((jugador, index) => (
              <div className={`detalles-partida-jugador ${jugador.nombreRol}`} key={jugador.id}>
                <label style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                  Jugador {index + 1}: {jugador.nombre} &nbsp;
                  Rol: {jugador.nombreRol} &nbsp;
                  <span className='alinear-derecha' style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    Puntos:
                    <input
                      type="number"
                      min={0}
                      max={30}
                      value={jugador.puntos}
                      onChange={(e) => {
                        const nuevosJugadores = [...jugadores];
                        nuevosJugadores[index].puntos = parseInt(e.target.value, 10);
                        setJugadores(nuevosJugadores);
                      }}
                      className="detalles-partida-input"
                    />
                    <label className="detalles-partida-label">
                      <input
                        type="checkbox"
                        checked={jugador.dominancia}
                        onChange={() => {
                          const nuevosJugadores = [...jugadores];
                          nuevosJugadores[index].dominancia = !jugador.dominancia;
                          setJugadores(nuevosJugadores);
                        }}
                        className="detalles-partida-checkbox"
                      />
                      Dominancia
                    </label>
                  </span>
                </label>
              </div>
            ))}
            <button type="submit" className="detalles-partida-boton">Finalizar Partida</button>
          </form>
        ) : (
          <p>Cargando datos de la partida...</p>
        )}
      </div>
      <NavigationButtons />
    </>
  );
};

export default DetallesPartida;
