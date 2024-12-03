import { Link } from "react-router-dom"
import EstadisticasLigaJugadores from "../components/EstadisticasLigaJugadores"
import EstadisticasLigasRoles from "../components/EstadisticasLigasRoles"
import NavigationButtons from "../components/NavigationButtons"

const EstadisticasLiga = () => {
  return (
    <div>
        <EstadisticasLigasRoles />
        <hr />
        <EstadisticasLigaJugadores />
        <NavigationButtons />
    </div>
  )
}

export default EstadisticasLiga