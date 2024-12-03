import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { Navigate, useParams } from 'react-router-dom';
import { fetchLigaDetalles, fetchLigaDetallesConPartidasNoTerminadas, marcarLigaComoTerminada, obtenerInfoJugadorYRol, updatePartidaInAPI, updatePuntos } from '../helper/ligasHelper';
import NavigationButtons from './NavigationButtons';

const Resultados = () => {
  const { id } = useParams(); 
  const [navigate, setNavigate] = useState(false);
  const [jugador1, setJugador1] = useState({});
  const [jugador2, setJugador2] = useState({});
  const [jugador3, setJugador3] = useState({});
  const [jugador4, setJugador4] = useState({});
  const [puntosj1, setPuntosj1] = useState(0);
  const [puntosj2, setPuntosj2] = useState(0);
  const [puntosj3, setPuntosj3] = useState(0);
  const [puntosj4, setPuntosj4] = useState(0);
  const [dominancia1, setDominancia1] = useState(false);
  const [dominancia2, setDominancia2] = useState(false);
  const [dominancia3, setDominancia3] = useState(false);
  const [dominancia4, setDominancia4] = useState(false);
  const [datosGeneral, setDatosGeneral] = useState([])
  const [datos, setDatos] = useState([]);
  const [redireccionar, setRedireccionar] = useState(false);
  const [cargando, setCargando] = useState(true); // Estado para controlar el spinner

  useEffect(() => {
    const obtenerDatos = async () => {
      try {
        setCargando(true); // Inicia el spinner

        const datosLiga2 = await fetchLigaDetalles(id);
        if (datosLiga2.terminada) {
          setRedireccionar(true);
        } else {
          setDatosGeneral(datosLiga2);
          const datosLiga = await fetchLigaDetallesConPartidasNoTerminadas(id);

          setDatos(datosLiga);

          const { idPartida, idJugador, idRol } = datosLiga;
          const setters = [setJugador1, setJugador2, setJugador3, setJugador4];

          for (let i = 0; i < 4; i++) {
            const infoJugador = await obtenerInfoJugadorYRol(
              idPartida[i],
              idJugador[i],
              idRol[i]
            );
            setters[i](infoJugador);
          }
        }
      } catch (error) {
        console.error("Error al obtener datos:", error);
      } finally {
        setCargando(false); // Detiene el spinner después de completar la carga
      }
    };

    obtenerDatos();
  }, [id]);
  if (cargando) {
    return (
      <div className="loading"></div>
    );
  }

  if(redireccionar){
    return <Navigate to={`/liga-terminada/${id}`} />;
  }
  if (navigate) {
    return <Navigate to={`/clasificacion/${id}`} replace={true} />;
  }
  const handleChangePuntosj1 = (e) => setPuntosj1(e.target.value);
  const handleChangePuntosj2 = (e) => setPuntosj2(e.target.value);
  const handleChangePuntosj3 = (e) => setPuntosj3(e.target.value);
  const handleChangePuntosj4 = (e) => setPuntosj4(e.target.value);

  const handleDominancia1Change = () => setDominancia1(!dominancia1);
  const handleDominancia2Change = () => setDominancia2(!dominancia2);
  const handleDominancia3Change = () => setDominancia3(!dominancia3);
  const handleDominancia4Change = () => setDominancia4(!dominancia4);

  const handleSubmit = async (e) => {
    e.preventDefault();

    let jugadores = [
      { partidaId: jugador1.partidaId, jugadorId: jugador1.jugadorId, nombre: jugador1.jugadorNombre, puntos: puntosj1, dominancia: dominancia1, rol: jugador1.rolNombre, posicion: 0, terminada: true },
      { partidaId: jugador2.partidaId, jugadorId: jugador2.jugadorId, nombre: jugador2.jugadorNombre, puntos: puntosj2, dominancia: dominancia2, rol: jugador2.rolNombre, posicion: 0, terminada: true },
      { partidaId: jugador3.partidaId, jugadorId: jugador3.jugadorId, nombre: jugador3.jugadorNombre, puntos: puntosj3, dominancia: dominancia3, rol: jugador3.rolNombre, posicion: 0, terminada: true },
      { partidaId: jugador4.partidaId, jugadorId: jugador4.jugadorId, nombre: jugador4.jugadorNombre, puntos: puntosj4, dominancia: dominancia4, rol: jugador4.rolNombre, posicion: 0, terminada: true }
    ];

    const jugadoresCon30Puntos = jugadores.filter(jugador => jugador.puntos == 30);
    const jugadoresCon0Puntos = jugadores.filter(jugador => jugador.puntos == 0);
    jugadores = jugadores.sort((a, b) => b.puntos - a.puntos);
    setCargando(true); 
    if (jugadoresCon30Puntos.length < 1) {
      Swal.fire("Error", "Minimo un jugador tiene que tener 30 puntps", "error");
      return;
    }
    if(jugadoresCon0Puntos.length==3){
      jugadoresCon30Puntos[0].posicion= 1
      jugadoresCon0Puntos[1].posicion=3
      jugadoresCon0Puntos[0].posicion=3
      jugadoresCon0Puntos[2].posicion=3
      const puntosPorPosicion = { 1: 5, 2: 3, 3: 1, 4: 0 };
      const resultados = jugadores.map(jugador => ({
        partidaId: jugador.partidaId,
        idJugador: jugador.jugadorId,
        puntos: jugador.puntos,
        dominancia: jugador.dominancia,
        terminada: jugador.terminada,
        posicion: jugador.posicion,
        puntosLiga: puntosPorPosicion[jugador.posicion],
      }));

    try {
      const updatePromises = resultados.map(async (result) => {
        await updatePartidaInAPI(result.partidaId, {
          puntos: parseInt(result.puntos, 10),
          dominancia: result.dominancia,
          terminada: true,
          posicion: result.posicion,
        });
        await updatePuntos(id, result.idJugador, result.puntosLiga, result.puntos);
      });

      await Promise.all(updatePromises);
      Swal.fire({
        title: "¡Éxito!",
        text: "Resultados actualizados correctamente.",
        icon: "success"
      });
      if (datos.jornada == datosGeneral.jornadas) {
        try {
          await marcarLigaComoTerminada(id);
        } catch (error) {
          console.error("Error al marcar la liga como terminada:", error);
        }
      }
      setNavigate(true)
      return;
      }catch(error){
        Swal.fire({
          title: "¡Error!",
          text: `Error al actualizar datos ${error}`,
          icon: "error"
        });
        setCargando(false); // Inicia el spinner
        return;
      }
    }
    if (jugadoresCon30Puntos.length > 2) {
      Swal.fire({
        title: "¡Error!",
        text: `No pueden haber mas de 2 jugadores ganadores`,
        icon: "error"
      });
      setCargando(false);
      return;
    }
    if (jugadoresCon30Puntos.length === 2) {
      const vagabundoConDominancia = jugadoresCon30Puntos.find(jugador => jugador.rol == "Vagabundo" && jugador.dominancia == true);
      const otroConDominancia = jugadoresCon30Puntos.find(jugador => jugador.rol != "Vagabundo" && jugador.dominancia == true);

      if (!vagabundoConDominancia || !otroConDominancia) {
        Swal.fire({
          title: "¡Error!",
          text: `Solo vagabundo y otro rol con dominancia puede tener 30 puntos`,
          icon: "error"
        });
        setCargando(false);
        return;
      }
      const otroJugador = jugadores.filter(jugador => jugador.puntos< 30)
      if(otroJugador.length == 2 && otroJugador[0].puntos == otroJugador[1].puntos){
        vagabundoConDominancia.posicion=1;
        otroConDominancia.posicion= 1;
        otroJugador[0].posicion= 3;
        otroJugador[1].posicion=3;
        const puntosPorPosicion = { 1: 5, 2: 3, 3: 1, 4: 0 };
        const resultados = jugadores.map(jugador => ({
          partidaId: jugador.partidaId,
          idJugador: jugador.jugadorId,
          puntos: jugador.puntos,
          dominancia: jugador.dominancia,
          terminada: jugador.terminada,
          posicion: jugador.posicion,
          puntosLiga: puntosPorPosicion[jugador.posicion],
      }));

      console.log("Datos preparados para enviar:", resultados);

      try {
        const updatePromises = resultados.map(async (result) => {
          await updatePartidaInAPI(result.partidaId, {
            puntos: parseInt(result.puntos, 10),
            dominancia: result.dominancia,
            terminada: true,
            posicion: result.posicion,
          });
          await updatePuntos(id, result.idJugador, result.puntosLiga, result.puntos);
        });

        await Promise.all(updatePromises);
        Swal.fire({
          title: "¡Éxito!",
          text: "Resultados actualizados correctamente.",
          icon: "success"
        });
        if (datos.jornada == datosGeneral.jornadas) {
          try {
            await marcarLigaComoTerminada(id);
          } catch (error) {
            console.error("Error al marcar la liga como terminada:", error);
          }
        }
        setCargando(false);
        setNavigate(true)
        return;
        }catch(error){
          Swal.fire({
            title: "¡Error!",
            text: `Hubo un problema al actulizar los datos ${error}`,
            icon: "error"
          });
          setCargando(false);
          return
        }
      }
    }

    const jugadoresConDominanciaIncorrecta = jugadores.filter(jugador => jugador.dominancia == true && jugador.puntos != 0 && jugador.puntos != 30);
    if (jugadoresConDominanciaIncorrecta.length > 0) {
      Swal.fire({
        title: "¡Error!",
        text: `Dominancia incorrecta`,
        icon: "error"
      });
      setCargando(false);
      return;
    }

    jugadores = jugadores.sort((a, b) => b.puntos - a.puntos);
    
    jugadores.forEach((jugador, index) => {
      if (jugador) { 
        jugador.posicion = index + 1;
      }
    });

    const empates = jugadores.filter((jugador, index, self) => 
      index > 0 && jugador.puntos == self[index - 1].puntos
    );
    console.log(empates.length);
    const jugadoresEmpatados = empates.length > 0 
  ? jugadores.filter(jugador => jugador.puntos === empates[0].puntos)
  : [];
    if (empates.length > 0) {
      
        if (jugadoresEmpatados.length === 2) {
          const vagabundo = jugadoresEmpatados.find(jugador => jugador.rol == "Vagabundo" && jugador.dominancia == true);
          const otroConDominancia = jugadoresEmpatados.find(jugador => jugador.rol != "Vagabundo" && jugador.dominancia == true && jugador.puntos== vagabundo.puntos);
  
          if (vagabundo && otroConDominancia && vagabundo.puntos == otroConDominancia.puntos) {
            if(vagabundo.puntos==30){
              vagabundo.posicion = 1;
              otroConDominancia.posicion = 1;
            }else{
              vagabundo.posicion= 3
              otroConDominancia.posicion = 3
            }
          }
          else{

            const { value: desempate } = await Swal.fire({
              title: 'Desempate entre puestos',
              text: `Los siguientes jugadores tienen los mismos puntos: ${jugadoresEmpatados.map(j => j.nombre).join(', ')}`,
              input: 'select',
              inputOptions: jugadoresEmpatados.reduce((acc, jugador) => {
                acc[jugador.nombre] = jugador.nombre;
                return acc;
              }, {}),
              inputPlaceholder: 'Selecciona quién gana el desempate',
              showCancelButton: true,
            });

            if (desempate) {
              const jugadorGanador = jugadores.find(j => j.nombre == desempate);
              const jugadorPerdedor = jugadoresEmpatados.find(j => j != jugadorGanador);
              const antiguaPosicion= jugadorGanador.posicion;
              if(jugadorPerdedor.posicion< jugadorGanador.posicion){
                jugadorGanador.posicion = jugadorPerdedor.posicion;
                jugadorPerdedor.posicion = antiguaPosicion
              }
            }
          }

        } 
        if (jugadoresEmpatados.length === 3) {
        const { value: desempate } = await Swal.fire({
          title: 'Desempate entre puestos 2, 3 y 4',
          text: `Los siguientes jugadores tienen los mismos puntos: ${jugadoresEmpatados.map(j => j.nombre).join(', ')}`,
          input: 'select',
          inputOptions: jugadoresEmpatados.reduce((acc, jugador) => {
            acc[jugador.nombre] = jugador.nombre;
            return acc;
          }, {}),
          inputPlaceholder: 'Selecciona quién queda en la posición 2',
          showCancelButton: true,
        });

        if (desempate) {
          const jugadorGanador = jugadores.find(j => j.nombre === desempate);
          jugadorGanador.posicion = 2;

          const jugadoresRestantes = jugadoresEmpatados.filter(j => j !== jugadorGanador);

          const { value: desempate3_4 } = await Swal.fire({
            title: 'Desempate entre puestos 3 y 4',
            text: `Los siguientes jugadores tienen los mismos puntos: ${jugadoresRestantes.map(j => j.nombre).join(', ')}`,
            input: 'select',
            inputOptions: jugadoresRestantes.reduce((acc, jugador) => {
              acc[jugador.nombre] = jugador.nombre;
              return acc;
            }, {}),
            inputPlaceholder: 'Selecciona quién queda en la posición 3',
            showCancelButton: true,
          });

          if (desempate3_4) {
            const jugadorGanador3_4 = jugadores.find(j => j.nombre === desempate3_4);
            jugadorGanador3_4.posicion = 3;

            const jugadorPerdedor3_4 = jugadoresRestantes.find(j => j !== jugadorGanador3_4);
            if (jugadorPerdedor3_4) jugadorPerdedor3_4.posicion = 4;
          }
        }
      }
    }

    const puntosPorPosicion = { 1: 5, 2: 3, 3: 1, 4: 0 };
    const resultados = jugadores.map(jugador => ({
      partidaId: jugador.partidaId,
      idJugador: jugador.jugadorId,
      puntos: jugador.puntos,
      dominancia: jugador.dominancia,
      terminada: jugador.terminada,
      posicion: jugador.posicion,
      puntosLiga: puntosPorPosicion[jugador.posicion],
    }));

    console.log("Datos preparados para enviar:", resultados);

    try {
      const updatePromises = resultados.map(async (result) => {
        await updatePartidaInAPI(result.partidaId, {
          puntos: parseInt(result.puntos, 10),
          dominancia: result.dominancia,
          terminada: true,
          posicion: result.posicion,
        });
        await updatePuntos(id, result.idJugador, result.puntosLiga, result.puntos);
      });
      await Promise.all(updatePromises);
      Swal.fire({
        title: "¡Éxito!",
        text: "Resultados actualizados correctamente.",
        icon: "success"
      });
      if (datos.jornada == datosGeneral.jornadas) {
        try {
          await marcarLigaComoTerminada(id);
        } catch (error) {
          console.error("Error al marcar la liga como terminada:", error);
        }
      }
      setCargando(false);
      setNavigate(true)
    } catch (error) {
      Swal.fire({
        title: "¡Error!",
        text: `Hubo un problema al actualizar datos ${error}`,
        icon: "error"
      });
      setCargando(false);
    }
};
  

  return (
    <>  
      <div className="actualizar-resultados-container">
        <h2 className="actualizar-resultados-titulo">
          Actualizar Resultados de la Liga: {datos.nombreLiga}
        </h2>

        <h3 className="actualizar-resultados-jornada ">Jornada {datos.jornada}</h3>

        <form onSubmit={handleSubmit} className="actualizar-resultados-form">
          <ul className="actualizar-resultados-lista">
            <li className={`actualizar-resultados-item ${jugador1.rolNombre}`}>
              {jugador1.jugadorNombre}, {jugador1.rolNombre} 
              <label className='alinear-derecha' style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                Puntos:
                <input
                  type="number"
                  min={0}
                  max={30}
                  value={puntosj1}
                  onChange={handleChangePuntosj1}
                  className="actualizar-resultados-input"
                />
                <label className="actualizar-resultados-label">
                  <input
                    type="checkbox"
                    checked={dominancia1}
                    onChange={handleDominancia1Change}
                    className="actualizar-resultados-checkbox"
                  />
                  Dominancia
                </label>
              </label>

            </li>

            <li className={`actualizar-resultados-item ${jugador2.rolNombre}`}>
              {jugador2.jugadorNombre}, {jugador2.rolNombre}
              <label className='alinear-derecha' style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                Puntos: 
                <input
                  type="number"
                  min={0}
                  max={30}
                  value={puntosj2}
                  onChange={handleChangePuntosj2}
                  className="actualizar-resultados-input"
                />
                <label className="actualizar-resultados-label">
                  <input
                    type="checkbox"
                    checked={dominancia2}
                    onChange={handleDominancia2Change}
                    className="actualizar-resultados-checkbox"
                  />
                  Dominancia
                </label>
              </label>
            </li>

            <li className={`actualizar-resultados-item ${jugador3.rolNombre}`}>
              {jugador3.jugadorNombre}, {jugador3.rolNombre}
              <label className='alinear-derecha' style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                Puntos: 
                <input
                  type="number"
                  min={0}
                  max={30}
                  value={puntosj3}
                  onChange={handleChangePuntosj3}
                  className="actualizar-resultados-input"
                />
                <label className="actualizar-resultados-label">
                  <input
                    type="checkbox"
                    checked={dominancia3}
                    onChange={handleDominancia3Change}
                    className="actualizar-resultados-checkbox"
                  />
                  Dominancia
                </label>
              </label>
            </li>

            <li className={`actualizar-resultados-item ${jugador4.rolNombre}`}>
              {jugador4.jugadorNombre},{jugador4.rolNombre}
              <label className='alinear-derecha' style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                Puntos:
                <input
                  type="number"
                  min={0}
                  max={30}
                  value={puntosj4}
                  onChange={handleChangePuntosj4}
                  className="actualizar-resultados-input"
                />
                <label className="actualizar-resultados-label">
                  <input
                    type="checkbox"
                    checked={dominancia4}
                    onChange={handleDominancia4Change}
                    className="actualizar-resultados-checkbox"
                  />
                  Dominancia
                </label>
              </label>
            </li>
          </ul>
          <button type="submit" className="actualizar-resultados-boton">
            Enviar Resultados
          </button>
        </form>
      </div>
      <NavigationButtons />
    </>
  );
};

export default Resultados;
