import { useEffect, useState } from "react";
import { useUser } from "../components/context/UserProvider";
import { useNavigate } from "react-router-dom";

const LoginJugador = () => {
    const [nombre, setNombre] = useState('');
    const [password, setPassword] = useState('');
    const { loginJugador, user, jugador } = useUser();
    const navigate = useNavigate();

    useEffect(() => {
        if(user || jugador){
            navigate('/')
        }
    }, [user, jugador])
    
    const handleLogin = async (e) => {
        e.preventDefault(); 
        const result = await loginJugador(nombre, password); 
        
        if (result.success) {
            navigate('/');
        }
      
    }; 

  return (
    <div className="login-form-container">
            <h1 className="form-title">Iniciar sesión</h1>
            <form onSubmit={handleLogin} className="login-form">
                <div className="form-group">
                    <label className="form-label">Nombre de jugador:</label>
                    <input 
                        type="text" 
                        value={nombre} 
                        onChange={(e) => setNombre(e.target.value)} 
                        className="form-input" 
                        placeholder="Nombre de jugador" 
                    />
                </div>
                <div className="form-group">
                    <label className="form-label">Contraseña:</label>
                    <input 
                        type="password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        className="form-input" 
                        placeholder="Introduce tu contraseña" 
                    />
                </div>
                <button type="submit" className="form-button">Iniciar sesión</button>
            </form>
        </div>
  )
}

export default LoginJugador