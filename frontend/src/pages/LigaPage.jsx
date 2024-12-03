import { Link } from "react-router-dom"

const LigaPage = () => {
  return (
    <div>
      <h1>Página de Ligas</h1>
      <ul>
        <li>
          <Link to="/ligas-terminadas">Ver ligas terminadas</Link>
        </li>
        <li>
          <Link to="/liga-actual">Ver liga actual</Link>
        </li>
      </ul>
    </div>
  )
}

export default LigaPage