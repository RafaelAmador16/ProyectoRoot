import { createContext, useContext, useState, useEffect } from 'react';
import { getJugadores } from '../../helper/jugadoresHelper'; // Supongo que tienes una función que obtiene los jugadores
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

    useEffect(() => {
        if (user) {
            loadJugadores(); // Cargar jugadores solo si el usuario está disponible
        }
    }, [user]);

    return (
        <JugadoresContext.Provider value={{ jugadores }}>
            {children}
        </JugadoresContext.Provider>
    );
};

export default JugadoresProvider;