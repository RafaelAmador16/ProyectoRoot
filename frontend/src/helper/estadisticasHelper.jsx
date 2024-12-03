export const fetchFirstPlaceGames = async (id) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/roles/${id}`);
      
      // Verificar que la respuesta es válida (status 200)
      if (!response.ok) {
        throw new Error('Error al obtener los datos');
      }
      const data = await response.json();
      
      return { partidas: data.partidasPrimero.length || 0 };
    } catch (error) {
      console.error('Error al obtener los datos:', error);
      throw new Error('Error al obtener las partidas en primer lugar');
    }
};
export const fetchSecondPlaceGames = async (id) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/roles/${id}`);
      
      // Verificar que la respuesta es válida (status 200)
      if (!response.ok) {
        throw new Error('Error al obtener los datos');
      }
  
      const data = await response.json();
      // Filtrar solo las partidas en primer lugar
      return { partidas: data.partidasSegundo.length || 0 };
    } catch (error) {
      console.error('Error al obtener los datos:', error);
      throw new Error('Error al obtener las partidas en primer lugar');
    }
};
export const fetchThirdPlaceGames = async (id) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/roles/${id}`);
      
      // Verificar que la respuesta es válida (status 200)
      if (!response.ok) {
        throw new Error('Error al obtener los datos');
      }
  
      const data = await response.json();
      return { partidas: data.partidasTercero.length || 0 };
    } catch (error) {
      console.error('Error al obtener los datos:', error);
      throw new Error('Error al obtener las partidas en primer lugar');
    }
};
export const fetchFourthPlaceGames = async (id) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/roles/${id}`);
      
      // Verificar que la respuesta es válida (status 200)
      if (!response.ok) {
        throw new Error('Error al obtener los datos');
      }
  
      const data = await response.json();
      return { partidas: data.partidasCuarto.length || 0 };
    } catch (error) {
      console.error('Error al obtener los datos:', error);
      throw new Error('Error al obtener las partidas en primer lugar');
    }
};
export const fetchTotalPartidasTerminadas = async (id) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/roles/${id}`);
      
      // Verificar que la respuesta es válida (status 200)
      if (!response.ok) {
        throw new Error('Error al obtener los datos');
      }
  
      const data = await response.json();
  
      // Obtener las partidas terminadas del rol
      const partidasTerminadas = data.partidasTerminadas || [];
  
      // Calcular la suma de los puntos de todas las partidas terminadas
      const sumaPuntos = partidasTerminadas.reduce((total, partida) => total + partida.puntos, 0);
      
      // Devolver el número de partidas terminadas y la suma de puntos
      return {
        partidas: partidasTerminadas.length,
        sumaPuntos,
      };
    } catch (error) {
      console.error('Error al obtener las partidas terminadas:', error);
      throw new Error('Error al obtener las partidas terminadas');
    }
  };
export const fetchAllPlaceGames = async (id) => {
  try {
    // Obtener todas las partidas usando los helpers para los diferentes lugares
    const firstPlaceGames = await fetchFirstPlaceGames(id);
    const secondPlaceGames = await fetchSecondPlaceGames(id);
    const thirdPlaceGames = await fetchThirdPlaceGames(id);
    const fourthPlaceGames = await fetchFourthPlaceGames(id);
    const totalPartidasTerminadas = await fetchTotalPartidasTerminadas(id);

    return {
      firstPlaceGames,
      secondPlaceGames,
      thirdPlaceGames,
      fourthPlaceGames,
      totalPartidasTerminadas,
    };
  } catch (error) {
    console.error("Error al obtener los datos de las partidas:", error);
    throw new Error("Error al obtener las partidas");
  }
};
export async function getNumeroDePosicionPorRolYLiga(idRol, idLiga) {
  try {
    const response = await fetch(`http://127.0.0.1:8000/api/roles/${idRol}`);
    if (!response.ok) {
      throw new Error(`Error al obtener el rol con ID ${idRol}: ${response.statusText}`);
    }

    const rolData = await response.json();

    const partidasGanadas = rolData.partidasTerminadas.filter((partida) => 
      partida.liga == `/api/ligas/${idLiga}` && partida.posicion == 1
    );
    const partidasSegundo = rolData.partidasTerminadas.filter((partida) => 
      partida.liga == `/api/ligas/${idLiga}` && partida.posicion == 2
    );
    const partidasTercero = rolData.partidasTerminadas.filter((partida) => 
      partida.liga == `/api/ligas/${idLiga}` && partida.posicion == 3
    );
    const partidasCuarto = rolData.partidasTerminadas.filter((partida) => 
      partida.liga == `/api/ligas/${idLiga}` && partida.posicion == 4
    );

    return {
      partidasPrimero: partidasGanadas.length,
      partidasSegundo: partidasSegundo.length,
      partidasTercero: partidasTercero.length,
      partidasCuarto: partidasCuarto.length,
    };
  } catch (error) {
    console.error("Error al obtener las posiciones por rol y liga:", error);
    return {
      partidasPrimero: 0,
      partidasSegundo: 0,
      partidasTercero: 0,
      partidasCuarto: 0,
    };
  }
}
export async function getPuntosPorRolEnLiga(idRol, idLiga) {
  try {
    const response = await fetch(`http://127.0.0.1:8000/api/roles/${idRol}`);
    if (!response.ok) {
      throw new Error(`Error al obtener el rol con ID ${idRol}: ${response.statusText}`);
    }
    const rolData = await response.json();
    const partidasLiga = rolData.partidasTerminadas.filter((partida) => {
      return partida.liga == `/api/ligas/${idLiga}`;
    });
    const totalPuntos = partidasLiga.reduce((suma, partida) => suma + partida.puntos, 0);

    return totalPuntos;
  } catch (error) {
    console.error("Error al obtener los puntos por rol:", error);
    return 0;
  }
}
export async function getEstadisticasJugador(ligaId, jugadorId) {
  try {
    const response = await fetch(`http://127.0.0.1:8000/api/jugadores/${jugadorId}`);
    if (!response.ok) {
      throw new Error(`Error al obtener datos del jugador: ${response.statusText}`);
    }
    const jugadorData = await response.json();

    const jugadorNombre = jugadorData.name;

    if (!jugadorData.resultadosPartidasTerminadas) {
      console.warn(`Jugador ${jugadorId} no tiene resultados de partidas terminadas.`);
      return {
        nombre: jugadorNombre,
        mejorRol: null,
        rolesGanados: {},
        posiciones: { 1: 0, 2: 0, 3: 0, 4: 0 },
      };
    }

    const partidasLiga = jugadorData.resultadosPartidasTerminadas.filter((partida) => {
      return String(partida.liga) === String(ligaId);
    });

    if (partidasLiga.length === 0) {
      console.warn(`Jugador ${jugadorNombre} no tiene partidas en la liga ${ligaId}.`);
      return {
        nombre: jugadorNombre,
        mejorRol: null,
        rolesGanados: {},
        posiciones: { 1: 0, 2: 0, 3: 0, 4: 0 },
      };
    }

    const rolesGanados = {};
    const posiciones = { 1: 0, 2: 0, 3: 0, 4: 0 };
    const puntosPorRol = {};

    partidasLiga.forEach((partida) => {
      const { rol, posicion, puntos } = partida;

      if (posicion === 1) {
        rolesGanados[rol] = (rolesGanados[rol] || 0) + 1;
      }
      posiciones[posicion] = (posiciones[posicion] || 0) + 1;
      puntosPorRol[rol] = (puntosPorRol[rol] || 0) + puntos;
    });

    let mejorRol = null;
    let puntosMaximos = 0;

    for (const [rol, puntos] of Object.entries(puntosPorRol)) {
      if (puntos > puntosMaximos) {
        mejorRol = rol;
        puntosMaximos = puntos;
      }
    }

    return {
      nombre: jugadorNombre,
      mejorRol,
      rolesGanados,
      posiciones,
    };
  } catch (error) {
    console.error("Error al calcular estadísticas del jugador:", error.message);
    throw error;
  }
}
export async function getEstadisticasJugadorGeneral(jugadorId) {
  try {
    const response = await fetch(`http://127.0.0.1:8000/api/jugadores/${jugadorId}`);
    if (!response.ok) {
      throw new Error(`Error al obtener datos del jugador: ${response.statusText}`);
    }
    const jugadorData = await response.json();

    const jugadorNombre = jugadorData.name;

    if (!jugadorData.resultadosPartidasTerminadas) {
      console.warn(`Jugador ${jugadorId} no tiene resultados de partidas terminadas.`);
      return {
        nombre: jugadorNombre,
        mejorRol: null,
        rolesGanados: {},
        posiciones: { 1: 0, 2: 0, 3: 0, 4: 0 },
      };
    }

    const rolesGanados = {};
    const posiciones = { 1: 0, 2: 0, 3: 0, 4: 0 };
    const puntosPorRol = {};

    jugadorData.resultadosPartidasTerminadas.forEach((partida) => {
      const { rol, posicion, puntos } = partida;

      if (posicion === 1) {
        rolesGanados[rol] = (rolesGanados[rol] || 0) + 1;
      }
      posiciones[posicion] = (posiciones[posicion] || 0) + 1;
      puntosPorRol[rol] = (puntosPorRol[rol] || 0) + puntos;
    });

    let mejorRol = null;
    let puntosMaximos = 0;

    for (const [rol, puntos] of Object.entries(puntosPorRol)) {
      if (puntos > puntosMaximos) {
        mejorRol = rol;
        puntosMaximos = puntos;
      }
    }

    return {
      nombre: jugadorNombre,
      mejorRol,
      rolesGanados,
      posiciones,
    };
  } catch (error) {
    console.error("Error al calcular estadísticas del jugador:", error.message);
    throw error;
  }
}
export const contarPosicionesPorRol = async (jugadorId) => {
  try {
    const response = await fetch(`http://127.0.0.1:8000/api/jugadores/${jugadorId}`);

    if (!response.ok) {
      throw new Error(`Error al obtener los datos del jugador: ${response.status}`);
    }
    const jugadorData = await response.json();
    const resultados = jugadorData.resultadosPartidasTerminadas;

    if (!resultados || resultados.length === 0) {
      return { posiciones: {}, puntosPorRol: {} };
    }

    const contador = {};
    const puntosPorRol = {};

    resultados.forEach((resultado) => {
      const { rol, posicion, puntos } = resultado;

      if (!rol || posicion === null || posicion === undefined) {
        return;
      }

      // Inicializar contador para el rol si no existe
      if (!contador[rol]) {
        contador[rol] = { 1: 0, 2: 0, 3: 0, 4: 0 };
        puntosPorRol[rol] = 0;
      }

      // Incrementar posiciones
      if (contador[rol][posicion] !== undefined) {
        contador[rol][posicion]++;
      }

      // Sumar puntos para el rol
      puntosPorRol[rol] += puntos || 0;
    });

    return { posiciones: contador, puntosPorRol };
  } catch (error) {
    console.error("Error en la solicitud de la API:", error);
    return { posiciones: {}, puntosPorRol: {} };
  }
};

