import { useState, useEffect } from 'react';
import { useUser } from '../components/context/UserProvider'; 
import { useNavigate } from 'react-router-dom';
import { addJugadorToAPI } from '../helper/jugadoresHelper';
import { useJugadores } from './context/JugadoresProvider';
import Swal from 'sweetalert2'; 
import "../pages/css/otros.css";
import CryptoJS from 'crypto-js';
import NavigationButtons from './NavigationButtons';

const JugadoresForm = () => {
    const { user } = useUser(); 
    const { addJugador } = useJugadores(); 
    const [nombre, setNombre] = useState('');
    const [password, setPassword] = useState(''); // Estado para la contraseña
    const [creador, setCreador] = useState(user ? user.id : 0); 
    const navigate = useNavigate(); 

    // Si no hay un user autenticado, redirige a la página de inicio ('/')
    useEffect(() => {
        if (!user) {
            navigate('/'); 
        }
    }, [user, navigate]); 

    const handleChangeNombre = (e) => {
        setNombre(e.target.value);
    };

    const handleChangePassword = (e) => {
        setPassword(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (nombre && password && creador) {
            const nuevoJugador = { 
                name: nombre, 
                password: CryptoJS.SHA256(password).toString(),
                creator: `/api/users/${creador}` 
            }; 
            try {
                await addJugador(nuevoJugador);
                Swal.fire({
                    icon: 'success',
                    title: 'Jugador agregado',
                    text: `El jugador "${nombre}" se agregó correctamente.`,
                    confirmButtonText: 'Aceptar'
                });
                setNombre('');
                setPassword(''); // Limpia el campo de contraseña
            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error al agregar',
                    text: 'Hubo un problema al agregar el jugador. Por favor, inténtalo de nuevo.',
                    confirmButtonText: 'Aceptar'
                });
                console.error('Error al agregar jugador:', error);
            }
        } else {
            Swal.fire({
                icon: 'warning',
                title: 'Campos vacíos',
                text: 'Por favor, complete todos los campos antes de enviar.',
                confirmButtonText: 'Aceptar'
            });
            console.error('Nombre, contraseña o creador no válidos:', nombre, password, creador);
        }
    };

    return (
        <>
            <div className="form-container">
                <h1 className="form-title">Agregar Jugador</h1>
                <form onSubmit={handleSubmit} className="jugador-form">
                    <div className="form-group">
                        <label htmlFor="nombre" className="form-label">Nombre del Jugador</label>
                        <input
                            type="text"
                            name="nombre"
                            id="nombre"
                            placeholder="Ingrese el nombre del jugador"
                            value={nombre}
                            onChange={handleChangeNombre}
                            required
                            className="form-input"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password" className="form-label">Contraseña</label>
                        <input
                            type="password"
                            name="password"
                            id="password"
                            placeholder="Ingrese la contraseña"
                            value={password}
                            onChange={handleChangePassword}
                            required
                            className="form-input"
                        />
                    </div>
                    <input
                        type="hidden"
                        name="creator_id"
                        value={creador}
                    />
                    <button type="submit" className="form-button">Agregar Jugador</button>
                </form>
            </div>
            <NavigationButtons />
        </>
    );
};

export default JugadoresForm;
