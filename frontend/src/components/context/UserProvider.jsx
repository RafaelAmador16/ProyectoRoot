import { createContext, useContext, useState, useEffect } from 'react';
import { loginUserHelper, logoutUserHelper, getStoredUser } from '../../helper/authHelper';
import { loginJugadorHelper, logoutJugadorHelper } from '../../helper/jugadoresHelper';

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [jugador, setJugador] = useState(null);

    // Efecto para recuperar el usuario de las cookies al cargar la app
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const storedUser = await getStoredUser();
                if (storedUser) {
                    setUser(storedUser);
                }
            } catch (err) {
                console.error('Error fetching stored user:', err);
            }
        };

        fetchUser();
    }, []);

    // Maneja el login
    const loginUser = async (nombre, password) => {
        try {
            const result = await loginUserHelper(nombre, password, (username, id) => {
                setUser({ username, id }); // Establece el usuario en el contexto
            });
            return result; // Retorna el resultado del login
        } catch (err) {
            console.error('Login failed:', err);
            return null; // O un valor que indique error
        }
    };
    const loginJugador = async (nombre, password) => {
        try {
            // Llama al helper loginJugadorHelper y pasa la función setJugador como callback
            const result = await loginJugadorHelper(nombre, password, (name, id) => {
                setJugador({ name, id }); // Establece el jugador en el contexto
            });
            return result; // Retorna el resultado del login
        } catch (err) {
            console.error('Login de jugador fallido:', err);
            return null; // O un valor que indique error
        }
    };
    // Maneja el logout
    const logoutUser = () => {
        try {
            logoutUserHelper(setUser);
            
        } catch (err) {
            console.error('Logout failed:', err);
        }
    };
    const logoutJugador = () => {
        try {
            logoutJugadorHelper(setJugador);
            
        } catch (err) {
            console.error('Logout failed:', err);
        }
    };

    return (
        <UserContext.Provider value={{ user, loginUser, logoutUser, jugador, loginJugador, logoutJugador }}>
            {children}
        </UserContext.Provider>
    );
};
