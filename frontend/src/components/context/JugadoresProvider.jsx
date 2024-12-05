import { createContext, useContext, useState, useEffect } from 'react';
import { addJugadorToAPI, getJugadores } from '../../helper/jugadoresHelper'; // Supongo que tienes una función que obtiene los jugadores
import { useUser } from './UserProvider'; // Para obtener el usuario actual

const JugadoresContext = createContext();

export const useJugadores = () => useContext(JugadoresContext);

export const JugadoresProvider = ({ children }) => {
    const { user } = useUser(); // Obtener el usuario actual desde el contexto
    const [jugadores, setJugadores] = useState([]);

    const loadJugadores = async () => {
        const jugadoresDesdeAPI = await getJugadores();

        // Crear el formato esperado del creador (como URI)
        const userCreatorUri = `/api/users/${user.id}`;

        // Filtrar jugadores cuyo creator coincida con el del usuario actual
        const jugadoresDelUsuario = jugadoresDesdeAPI.filter(jugador => {
            return jugador.creator === userCreatorUri; // Comparar con la URI completa
        });

        setJugadores(jugadoresDelUsuario);
    };
    const addJugador = async (nuevoJugador) => {
        try {
            // Insertar el jugador en el backend
            const jugadorCreado = await addJugadorToAPI(nuevoJugador);

            // Validar si el creador coincide con el usuario actual
            if (jugadorCreado.creator === `/api/users/${user.id}`) {
                setJugadores((prevJugadores) => [...prevJugadores, jugadorCreado]);
            }
        } catch (error) {
            console.error('Error al agregar el jugador:', error);
        }
    };


    useEffect(() => {
        if (user) {
            loadJugadores(); // Cargar jugadores solo si el usuario está disponible
        }
    }, [user]);

    return (
        <JugadoresContext.Provider value={{ jugadores, addJugador }}>
            {children}
        </JugadoresContext.Provider>
    );
};

export default JugadoresProvider;