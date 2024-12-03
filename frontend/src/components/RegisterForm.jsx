import { useEffect, useState } from 'react'
import CryptoJS from 'crypto-js'  // Importamos crypto-js para encriptar la contraseña
import { useUser } from './context/UserProvider'
import { useNavigate } from 'react-router-dom'

const RegisterForm = () => {
    const [nombre, setNombre] = useState("")
    const [password, setPassword] = useState("")
    const [password2, setPassword2] = useState("")
    const { user, jugador } = useUser();
    const navigate = useNavigate();

    useEffect(() => {
        if(user || jugador){
            navigate('/')
        }
    }, [user, jugador])
    

    const handleChangeNombre = (e) => {
        setNombre(e.target.value)
    }
    const handleChangePassword = (e) => {
        setPassword(e.target.value)
    }
    const handleChangePassword2 = (e) => {
        setPassword2(e.target.value)
    }

    const handleRegistrar = async (e) => {
        e.preventDefault()

        if (password !== password2) {
            alert("Las contraseñas no coinciden")
            return
        }

        const encryptedPassword = CryptoJS.SHA256(password).toString()

        const userData = {
            username: nombre,
            password: encryptedPassword,
        }

        try {
            const response = await fetch("http://127.0.0.1:8000/api/users", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(userData),
            })

            if (response.ok) {
                const data = await response.json()
                alert("Usuario registrado con éxito!")
                console.log(data)
            } else {
                const errorData = await response.json()
                alert("Error al registrar usuario: " + errorData.message)
            }
        } catch (error) {
            console.error("Error de red:", error)
            alert("Hubo un error al intentar registrar el usuario.")
        }
    }

    return (
        <div className="login-form-container">
            <h1 className="register-form-title">Registro de Usuario</h1>
            <form onSubmit={handleRegistrar}>
                <div className="form-group">
                    <input 
                        className="form-input" 
                        type="text" 
                        value={nombre} 
                        onChange={handleChangeNombre} 
                        name="user" 
                        placeholder="Nombre de usuario" 
                    />
                </div>
                <div className="form-group">
                    <input 
                        className="form-input" 
                        type="password" 
                        value={password} 
                        onChange={handleChangePassword} 
                        name="password" 
                        placeholder="Contraseña" 
                    />
                </div>
                <div className="form-group">
                    <input 
                        className="form-input" 
                        type="password" 
                        value={password2} 
                        onChange={handleChangePassword2} 
                        name="password2" 
                        placeholder="Confirmar Contraseña" 
                    />
                </div>
                <button className="form-button" type="submit">Registrar</button>
            </form>
        </div>
    );
}

export default RegisterForm