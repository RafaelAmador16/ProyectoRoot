import { useUser } from "../components/context/UserProvider";
import LigaNoTerminada from "../components/LigaNoTerminada";
import LigaTerminada from "../components/LigaTerminada";
import NavigationButtons from "../components/NavigationButtons";

const MisLigas = () => {
  const { user, jugador } = useUser();
  
  return (
    <>
      <div className="ligas-section">
        <LigaNoTerminada />
        <LigaTerminada />
      </div>
      <NavigationButtons />
      <div className="animacion-conejos">
        <img src="./img/Alianza.png" className="foto-Alianza1" />
        <img src="./img/Alianza.png" className="foto-Alianza2" />
        <img src="./img/Vagabundo.png" className="foto-Vagabundo1" />

      </div>
    </>

  );
};

export default MisLigas;
