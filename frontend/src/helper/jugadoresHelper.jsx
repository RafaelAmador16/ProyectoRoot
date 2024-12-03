import Swal from "sweetalert2";
import CryptoJS from 'crypto-js';
import Cookies from 'js-cookie';

export const getJugadores = async () => {
  try {
    const response = await fetch('http://127.0.0.1:8000/api/jugadores', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const data = await response.json();
      return data.member;
    } else {
      throw new Error('Error al obtener jugadores');
    }
  } catch (error) {
    console.error('Error de red:', error);
    throw error;
  }
};
export const getRolesFromAPI = async () => {
  try {
    const response = await fetch('http://127.0.0.1:8000/api/roles', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const data = await response.json();
      // Aquí accedemos a la propiedad 'member', que contiene el array de roles
      return data.member; 
    } else {
      throw new Error('Error al obtener roles');
    }
  } catch (error) {
    console.error('Error de red:', error);
    throw error;
  }
};
export const addJugadorToAPI = async (nuevoJugador) => {
  try {
    const response = await fetch('http://127.0.0.1:8000/api/jugadores', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(nuevoJugador),
    });

    if (response.ok) {
      const data = await response.json();
      return data; 
    } else if (response.status === 409) {
      // Si el servidor devuelve un código 409 (conflicto)
      Swal.fire({
        icon: 'error',
        title: 'Jugador duplicado',
        text: 'Ya existe un jugador con este nombre. Por favor, elige otro nombre.',
        confirmButtonText: 'Aceptar',
      });
      throw new Error('Jugador duplicado');
    } else {
      // Para otros errores no específicos
      Swal.fire({
        icon: 'error',
        title: 'Error al agregar jugador',
        text: 'Hubo un problema al agregar el jugador. Por favor, inténtalo de nuevo.',
        confirmButtonText: 'Aceptar',
      });
      throw new Error('Error al agregar jugador');
    }
  } catch (error) {
    console.error('Error de red:', error);
    throw error; 
  }
};
export const loginJugadorHelper = async (nombre, password, setJugadorCallback) => {
  // Encripta la contraseña
  const encryptedPassword = CryptoJS.SHA256(password).toString();

  try {
      const response = await fetch('http://127.0.0.1:8000/api/jugadores', {
          method: 'GET',
          headers: {
              'Content-Type': 'application/json',
          },
      });

      if (response.ok) {
          const jugadores = await response.json();
          console.log(jugadores);
          const jugador = jugadores.member.find(j => 
              j.name.trim() === nombre.trim() && j.password === encryptedPassword
          );

          if (jugador) {
              setJugadorCallback(jugador.name, jugador.id);

              const jugadorData = { name: jugador.name, id: jugador.id };
              Cookies.set('jugador', JSON.stringify(jugadorData), { expires: 1 });

              return { success: true }; 
          } else {
              console.error('Nombre de jugador o contraseña incorrectos.');
              return { success: false, message: 'Nombre de jugador o contraseña incorrectos.' }; 
          }
      } else {
          console.error('Error al obtener los jugadores.');
          return { success: false, message: 'Error al obtener los jugadores desde el servidor.' };
      }
  } catch (error) {
      console.error('Error de red:', error);
      return { success: false, message: 'Hubo un problema al conectar con el servidor.' };
  }
};
export const logoutJugadorHelper = (setJugador) => {
  setJugador(null);
  Cookies.remove('jugador');
};
export async function fetchUserJugadores(userId) {
  try {
    const response = await fetch(`http://127.0.0.1:8000/api/users/${userId}`);
    if (!response.ok) {
      throw new Error(`Error al obtener información del usuario: ${response.statusText}`);
    }
    const userData = await response.json();
    // Retornamos los IDs de los jugadores
    return userData.jugadores;
  } catch (error) {
    console.error("Error al obtener jugadores del usuario:", error);
    throw error;
  }
}