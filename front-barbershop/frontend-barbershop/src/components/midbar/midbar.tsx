import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLocationDot,
  faPhone,
  faHistory
} from "@fortawesome/free-solid-svg-icons";
import { useContext } from "react";
import { Context } from "../../Context/Context";
import MidBarModal from "../modals/midbarmodals/MidBarModal";

const titles: Record<string, string> = {
  location: "Ubicación",
  contact: "Contacto",
  schedule: "Horario"
};

const descriptions: Record<string, string> = {
  location: "Nos ubicamos en Guayaquil, Ecuador 🇪🇨",
  contact: "Escribenos al +593 99 999 9999 📞",
  schedule: "Abrimos de 9am - 10pm 🕒"
};


const Midbar = () => {
  const context = useContext(Context);

  if (!context) {
    throw new Error("Midbar must be used within an AppProvider");
  }

  const { modalMBOpen , setModalMBOpen } = context;

  return (
    <>
    <div className="bg-black w-full py-20 text-white anthelion flex flex-col lg:flex-row gap-20 lg:gap-0 items-center justify-around text-4xl">

      <div
        className="flex flex-col items-center justify-center gap-2 cursor-pointer"
        onClick={() =>
          setModalMBOpen({ open: true, type: "location" })
        }
      >
        <FontAwesomeIcon icon={faLocationDot} />
        <span>Ubicación</span>
      </div>

      <div
        className="flex flex-col items-center justify-center gap-2 cursor-pointer"
        onClick={() =>
          setModalMBOpen({ open: true, type: "contact" })
        }
      >
        <FontAwesomeIcon icon={faPhone} />
        <span>Contacto</span>
      </div>

      <div
        className="flex flex-col items-center justify-center gap-2 cursor-pointer"
        onClick={() =>
          setModalMBOpen({ open: true, type: "schedule" })
        }
      >
        <FontAwesomeIcon icon={faHistory} />
        <span>Horario</span>
      </div>

    </div>

    {modalMBOpen?.open && (
    <MidBarModal
        title={titles[modalMBOpen.type]}
        description={descriptions[modalMBOpen.type]}
    />
    )}
    
    </>
  );
};

export default Midbar;