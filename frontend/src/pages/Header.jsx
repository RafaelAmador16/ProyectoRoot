import { Link } from 'react-router-dom';
import { useUser } from '../components/context/UserProvider';

const Header = () => {
    const { user, logoutUser, jugador, logoutJugador } = useUser();

    return (
        <header>
            <div>
                <img src='/img/logo.jpg' alt='Proyecto Root' className='logo-cabecera' />
            </div>
            <div>
                <Link to="/">Home</Link>&nbsp;&nbsp;
                {user ? (
                    <>
                        <span>Bienvenido, {user.username}</span>&nbsp;&nbsp;
                        <Link to={"/"}><button onClick={logoutUser}>Logout</button></Link>
                    </>
                ) : (
                    jugador ? (
                        <>
                            <span>Bienvenido, {jugador.name}</span>&nbsp;&nbsp;
                            <Link to={"/"}><button onClick={logoutJugador}>Logout</button></Link>
                        </>
                    ) : (
                        <>
                            <Link to="/register">Register</Link>&nbsp;&nbsp;
                            <Link to="/login">Login</Link>
                        </>
                    )
                )}
            </div>
        </header>
    );
};

export default Header;