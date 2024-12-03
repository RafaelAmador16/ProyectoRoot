export const addLigaToAPI = async (nuevaLiga) => {
  try {
      const response = await fetch('http://127.0.0.1:8000/api/ligas', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(nuevaLiga),
      });

      if (response.ok) {
          const data = await response.json();
          return data;
      } else {
          throw new Error('Error al crear la liga');
      }
  } catch (error) {
      console.error('Error de red:', error);
      throw error;
  }
};
export const obtenerJornadasTerminadasPorLiga = async (ligaId) => {
    try {
        const response = await fetch(`http://127.0.0.1:8000/api/partidas?liga=/api/ligas/${ligaId}`);
        const data = await response.json();
        console.log('Respuesta de la API:', data); // Verifica la estructura de la respuesta

        // Filtra las partidas por liga
        const partidasPorLiga = data.member.filter(partida => partida.liga === `/api/ligas/${ligaId}`);
        
        // Agrupa las partidas por jornada
        const jornadasAgrupadas = partidasPorLiga.reduce((acc, partida) => {
            const jornada = partida.jornada;
            if (!acc[jornada]) {
                acc[jornada] = [];
            }
            acc[jornada].push(partida);
            return acc;
        }, {});

        console.log('Jornadas agrupadas:', jornadasAgrupadas); // Verifica las jornadas agrupadas

        // Filtra las jornadas donde todas las partidas están terminadas
        const jornadasTerminadas = Object.keys(jornadasAgrupadas).filter(jornada => {
            // Comprueba si todas las partidas de la jornada están terminadas
            return jornadasAgrupadas[jornada].every(partida => partida.terminada === true);
        });

        console.log('Jornadas terminadas:', jornadasTerminadas); // Verifica las jornadas terminadas

        // Devuelve las jornadas ordenadas
        return jornadasTerminadas.map(jornada => parseInt(jornada)).sort((a, b) => a - b);
    } catch (error) {
        console.error('Error al obtener las jornadas terminadas:', error);
        return [];
    }
};
export const getLigaNameById = async (ligaId) => {
    try {
        const response = await fetch(`http://127.0.0.1:8000/api/ligas/${ligaId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`Error al obtener la liga con ID ${ligaId}: ${response.status}`);
        }

        const ligaData = await response.json();
        return ligaData.name; 
    } catch (error) {
        console.error(`Error al obtener el nombre de la liga con ID ${ligaId}:`, error);
        throw error; 
    }
};
  


export const addJugadoresToLigaAPI = async (jugadores, ligaId) => {
  try {
      const promises = jugadores.map(async (jugador) => {
          const ligaJugador = {
              liga: `/api/ligas/${ligaId}`,
              jugador: `/api/jugadores/${jugador.id}`,
              puntos: 0,
              puntosTotales: 0,
          };

          const response = await fetch('http://127.0.0.1:8000/api/liga_jugadores', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify(ligaJugador),
          });

          if (!response.ok) {
              throw new Error(`Error al asociar jugador ${jugador.id} a la liga`);
          }
      });

      await Promise.all(promises);
      return true;
  } catch (error) {
      console.error('Error de red:', error);
      throw error;
  }
};
export const updatePuntos = async (ligaId, jugadorId, puntosPartida, puntosTotalesPartida) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/liga_jugadores?liga=${ligaId}`);
      if (!response.ok) {
        throw new Error('No se pudieron obtener los datos de los jugadores en la liga');
      }
      
      const data = await response.json();
      const jugadoresEnLiga = data.member;
      console.log('Jugadores en la liga:', jugadoresEnLiga);
      const jugadorEnLiga = jugadoresEnLiga.find(j => j.jugador == `/api/jugadores/${jugadorId}`);
      if (!jugadorEnLiga) {
        throw new Error('Jugador no encontrado en la liga');
      }
  
      console.log("Jugador encontrado:", jugadorEnLiga);
  
      const puntosActuales = parseInt(jugadorEnLiga.puntos || 0, 10);
      const puntosTotalesActuales = parseInt(jugadorEnLiga.puntosTotales || 0, 10);
      const puntosPartidaInt = parseInt(puntosPartida || 0, 10);
      const puntosTotalesPartidaInt = parseInt(puntosTotalesPartida || 0, 10);
      const nuevosPuntos = puntosActuales + puntosPartidaInt;
      const nuevosPuntosTotales = puntosTotalesActuales + puntosTotalesPartidaInt;
      const updateResponse = await fetch(`http://127.0.0.1:8000/api/liga_jugadores/${jugadorEnLiga.id}`, {
        method: 'PATCH',
        headers: {
          "Content-Type": "application/merge-patch+json",
        },
        body: JSON.stringify({
          puntos: nuevosPuntos,
          puntosTotales: nuevosPuntosTotales,
        }),
      });
  
      if (!updateResponse.ok) {
        throw new Error('Error al actualizar los puntos del jugador');
      }
    } catch (error) {
      console.error("Error al actualizar los puntos del jugador:", error);
    }
};

export const addPartidasToAPI = async (data) => {
    try {
        const response = await fetch('http://127.0.0.1:8000/api/partidas', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const errorDetails = await response.json();
            console.error('Error al crear la partida:', errorDetails);
            throw new Error('Error al crear la partida');
        }

        return await response.json();
    } catch (error) {
        console.error("Error de red:", error);
        throw error;
    }
};
export async function marcarLigaComoTerminada(ligaId) {
    const url = `http://127.0.0.1:8000/api/ligas/${ligaId}`;
  
    try {
      const response = await fetch(url, {
        method: 'PATCH',
        headers: {
            "Content-Type": "application/merge-patch+json",
        },
        body: JSON.stringify({terminada: true }) 
      });
  
      if (!response.ok) {
        throw new Error(`Error al actualizar la liga con ID ${ligaId}`);
      }
    } catch (error) {
      console.error(`Error en la actualización de la liga ${ligaId}: ${error}`);
    }
  }
export async function obtenerInfoJugadorYRol(partidaId, jugadorId, rolId) {
    try {
      const partidaResponse = await fetch(`http://127.0.0.1:8000/api/partidas/${partidaId}`);
      const partida = await partidaResponse.json();
      const jugadorResponse = await fetch(`http://127.0.0.1:8000/api/jugadores/${jugadorId}`);
      const jugador = await jugadorResponse.json();
      const rolResponse = await fetch(`http://127.0.0.1:8000/api/roles/${rolId}`);
      const rol = await rolResponse.json();
      const resultado = {
        partidaId: partida.id,
        jugadorId: jugador.id,
        jugadorNombre: jugador.name,
        rolId: rol.id,
        rolNombre: rol.name,
      };
  
      return resultado;
  
    } catch (error) {
      console.error("Error al obtener datos:", error);
      return null;
    }
  }

export const getLigasTerminadas = async (userId) => {
    try {
        const response = await fetch(`http://127.0.0.1:8000/api/users/${userId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`Error de respuesta del servidor: ${response.status}`);
        }

        const userData = await response.json();
        const ligasTerminadasURLs = userData.ligasTerminadas;

        const ligasDetails = await Promise.all(
            ligasTerminadasURLs.map(async (url) => {
                const ligaResponse = await fetch(`http://127.0.0.1:8000${url}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (!ligaResponse.ok) {
                    throw new Error(`Error al obtener liga desde ${url}: ${ligaResponse.status}`);
                }

                const ligaData = await ligaResponse.json();
                return {
                    id: ligaData.id,
                    name: ligaData.name
                };
            })
        );

        return ligasDetails;

    } catch (error) {
        console.error("Error al obtener ligas terminadas:", error);
        throw error; 
    }
};
export const getLigasJugador = async (jugadorId) => {
    try {
        const response = await fetch(`http://127.0.0.1:8000/api/jugadores/${jugadorId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`Error de respuesta del servidor: ${response.status}`);
        }

        const jugadorData = await response.json();
        const ligasTerminadasURLs = jugadorData.ligaJugadores;

        const ligasDetails = await Promise.all(
            ligasTerminadasURLs.map(async (url) => {
                const ligaResponse = await fetch(`http://127.0.0.1:8000${url}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (!ligaResponse.ok) {
                    throw new Error(`Error al obtener liga desde ${url}: ${ligaResponse.status}`);
                }

                const ligaData = await ligaResponse.json();
                return {
                    id: ligaData.liga,

                };
            })
        );

        return ligasDetails;

    } catch (error) {
        console.error("Error al obtener ligas del jugador:", error);
        throw error; 
    }
};
export const getLigasNoTerminadas = async (userId) => {
    try {
        const response = await fetch(`http://127.0.0.1:8000/api/users/${userId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`Error de respuesta del servidor: ${response.status}`);
        }

        const userData = await response.json();
        const ligasNoTerminadasURLs = Object.values(userData.ligasNoTerminadas);
        const ligasDetails = await Promise.all(
            ligasNoTerminadasURLs.map(async (url) => {
                const ligaResponse = await fetch(`http://127.0.0.1:8000${url}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (!ligaResponse.ok) {
                    throw new Error(`Error al obtener liga desde ${url}: ${ligaResponse.status}`);
                }

                const ligaData = await ligaResponse.json();
                return {
                    id: ligaData.id,
                    name: ligaData.name
                };
            })
        );

        return ligasDetails;

    } catch (error) {
        console.error("Error al obtener ligas no terminadas:", error);
        throw error;
    }
};
export const fetchLigaJugadores = async (idLiga) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/liga_jugadores?liga=/api/ligas/${idLiga}`);
      if (!response.ok) {
        throw new Error("Error fetching league players");
      }
      const data = await response.json();
      const jugadoresIds = data.member.map((jugador) => jugador.jugador.split('/').pop());
      const jugadoresResponse = await fetch(`http://127.0.0.1:8000/api/jugadores`);
      if (!jugadoresResponse.ok) {
        throw new Error("Error fetching players");
      }
      const jugadoresData = await jugadoresResponse.json();
      const jugadoresConNombre = data.member.map((jugador) => {
        const jugadorId = jugador.jugador.split('/').pop();
        const jugadorDetalles = jugadoresData.member.find(j => j.id === parseInt(jugadorId));
        return {
          ...jugador,
          nombre: jugadorDetalles ? jugadorDetalles.name : 'Desconocido', 
        };
      });
  
      return jugadoresConNombre;
    } catch (error) {
      console.error("Error:", error);
      return [];
    }
  };
  export const updatePartidaInAPI = async (partidaId, data) => {
    try {
        const response = await fetch(`http://127.0.0.1:8000/api/partidas/${partidaId}`, {
            method: 'PATCH',
            headers: {
                "Content-Type": "application/merge-patch+json",
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const errorDetails = await response.json();
            console.error('Error al actualizar la partida:', errorDetails);
            throw new Error('Error al actualizar la partida');
        }

        return await response.json();
    } catch (error) {
        console.error("Error de red:", error);
        throw error;
    }
   
};
export const fetchLigaDetalles = async (idLiga) => {
    try {
        const response = await fetch(`http://127.0.0.1:8000/api/ligas/${idLiga}`);
        if (!response.ok) {
            throw new Error("Error al traer los");
        }
        return await response.json();
    } catch (error) {
        console.error("Error:", error);
        throw error;
    }
};
export const fetchLigaDetallesConPartidasNoTerminadas = async (idLiga) => {
    try {
        const response = await fetch(`http://127.0.0.1:8000/api/ligas/${idLiga}`);
        if (!response.ok) {
            throw new Error("Error al traer los datos de la liga");
        }
        
        const ligaData = await response.json();
        const nombreLiga = ligaData.name;
        const jornada = ligaData.partidasPrimeraJornadaNoTerminada[0].jornada;
        const idPartida = ligaData.partidasPrimeraJornadaNoTerminada.map(partida => partida.id);
        const idRol = ligaData.partidasPrimeraJornadaNoTerminada.map(partida => 
            parseInt(partida.rol.split('/').pop())
        );
        const idJugador = ligaData.partidasPrimeraJornadaNoTerminada.map(partida => 
            parseInt(partida.jugador.split('/').pop())
        );

        return {
            nombreLiga,
            idPartida,
            jornada,
            idJugador,
            idRol
        };
    } catch (error) {
        console.error("Error:", error);
        throw error;
    }
};
