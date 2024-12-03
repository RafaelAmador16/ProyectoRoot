import { Link } from "react-router-dom";

const NavigationButtons = () => {
  return (
    <div className="navigation-buttons">
      <Link to="/" className="button1 home-button">
        Volver a Inicio
      </Link>
      <Link to={-1} className="button1 back-button">
        Volver a la Página Anterior
      </Link>
    </div>
  );
};

export default NavigationButtons;