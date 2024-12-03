import { Link } from "react-router-dom";
import "./css/error.css"
const ErrorPage = () => {
  return (
    <div className="error-page">
      <h2>Error: Página no encontrada</h2>
      <Link to={"/"}>
        <p>Pulse aquí para volver al inicio</p>
      </Link>
    </div>
  );
};

export default ErrorPage;