import ChatBot from "./components/chatbot/chatbot"
import Navbar from "./components/navbar/navbar"
import Presentation from "./components/presentation/presentation"
import Midbar from "./components/midbar/midbar"
import PearlBot from "./components/pearlBot/pearlBot"

import RenderCardServices from "./components/renderCardServices/RenderCardServices"
import { useContext, useEffect } from "react"
import { Context } from "./Context/Context"
function App() {
  const context = useContext(Context);
  const { chatOpen } = context;
  if (!context) return <div>Cargando...</div>; 

// eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    if (chatOpen === false) {
      document.body.classList.add('no-scroll');
    } else {
      document.body.classList.remove('no-scroll');
    }

    return () => {
      document.body.classList.remove('no-scroll');
    };
  }, [chatOpen]);

  return (
    <>
      <Navbar />
      <Presentation />
      <Midbar />
      <RenderCardServices />

      {
        chatOpen ?
          <ChatBot />
                  :
          <PearlBot />
      }

    </>
  )
}

export default App