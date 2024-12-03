import Cookies from 'js-cookie';
import CryptoJS from 'crypto-js';

export const loginUserHelper = async (nombre, password, setUserCallback) => {
    const encryptedPassword = CryptoJS.SHA256(password).toString();

    try {
        const response = await fetch('http://127.0.0.1:8000/api/users', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            const users = await response.json();
            const userArray = users.member;

            const user = userArray.find(user => 
                user.username.trim() === nombre.trim() && user.password === encryptedPassword
            );

            if (user) {
                setUserCallback(user.username, user.id); 

                const userData = { username: user.username, id: user.id };
                Cookies.set('user', JSON.stringify(userData), { expires: 1 }); 

                return { success: true }; 
            } else {
                console.error('Nombre de usuario o contraseña incorrectos.');
                return { success: false }; 
            }
        } else {
            console.error('Error al obtener los usuarios.');
            return { success: false };
        }
    } catch (error) {
        console.error('Error de red:', error);
        console.error('Hubo un problema al conectar con el servidor.');
        return { success: false };
    }
};

export const logoutUserHelper = (setUser) => {
    setUser(null);
    Cookies.remove('user');
};

export const getStoredUser = () => {
    const storedUser = Cookies.get('user'); 
    if (storedUser) {
        const userData = JSON.parse(storedUser); 
        return userData; 
    }
    return null; 
};