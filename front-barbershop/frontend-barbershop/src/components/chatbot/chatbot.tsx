import { useContext, useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRobot } from "@fortawesome/free-solid-svg-icons";
import { motion } from "motion/react";
import { Context } from "../../Context/Context";
import MessageBot from "../messageBot/messageBot";
import MessageUser from "../messageUser/MessageUser";
import SelectBot from "../selectbot/SelectBot";
import TypingDots from "../typingdots/TypingDots";
import { flow } from "../../services/flow";
import { crearCita, CitaDuplicadaError } from "../../services/citasService";
import type { Option } from "../../types/stepsTypes";

type Message =
  | { from: "bot"; content: React.ReactNode }
  | { from: "user"; content: string };

type CitaDraft = {
  fecha?: string;
  hora?: string;
  cliente_id?: number;
  servicio_id?: number;
};

const ChatBot = () => {
  const context = useContext(Context);
  const { setChatOpen, inSession, nombreUsuarioEnSesion } = context;

  const [currentNodeId, setCurrentNodeId] = useState("start");
  const [messages, setMessages] = useState<Message[]>([
    { from: "bot", content: flow.start.message },
  ]);
  const [cita, setCita] = useState<CitaDraft>({});
  const currentNode = flow[currentNodeId];
  const lastNodeRef = useRef<string | null>("start");

  useEffect(() => {
    if (!currentNode || lastNodeRef.current === currentNodeId) return;

    lastNodeRef.current = currentNodeId;

    const delay = Math.min(2000, currentNode.message.length * 30);

    setMessages((prev) => [...prev, { from: "bot", content: <TypingDots /> }]);

    const timer = setTimeout(async () => {
      if (currentNodeId === "confirm") {
        try {
          const payload = {
            fecha: cita.fecha ?? new Date().toISOString().slice(0, 10),
            hora: cita.hora ?? "10:00 AM",
            servicio_id: cita.servicio_id ?? 1,
          };

          const data = await crearCita(payload);

          const saludo = nombreUsuarioEnSesion
            ? `${nombreUsuarioEnSesion}, tu`
            : "Tu";
          setMessages((prev) => [
            ...prev.slice(0, -1),
            {
              from: "bot",
              content: `${saludo} cita ha sido creada (id: ${data.id}) para el ${payload.fecha} a las ${payload.hora}`,
            },
          ]);

          setCita({});
        } catch (err) {
          if (err instanceof CitaDuplicadaError) {
            const detalle = err.cita
              ? ` (fecha: ${err.cita.fecha}, hora: ${err.cita.hora})`
              : "";
            setMessages((prev) => [
              ...prev.slice(0, -1),
              {
                from: "bot",
                content: `Ya tienes una cita pendiente${detalle}. No puedes agendar otra hasta cancelarla.`,
              },
            ]);
          } else {
            const msg = err instanceof Error ? err.message : "Error desconocido";
            setMessages((prev) => [
              ...prev.slice(0, -1),
              { from: "bot", content: `No se pudo crear la cita: ${msg}` },
            ]);
          }
        }
        return;
      }

      setMessages((prev) => [
        ...prev.slice(0, -1),
        { from: "bot", content: currentNode.message },
      ]);
    }, delay);

    return () => clearTimeout(timer);
  }, [currentNodeId, currentNode, cita, nombreUsuarioEnSesion]);

  const handleOption = (option: Option) => {
    setMessages((prev) => [...prev, { from: "user", content: option.label }]);

    if (currentNodeId === "today_time") {
      const hoy = new Date().toISOString().slice(0, 10);
      setCita((prev) => ({ ...prev, fecha: hoy, hora: option.label }));
    }

    setCurrentNodeId(option.next);
  };

  return (
    <motion.div
      className="fixed right-4 bottom-4 lg:w-80 w-[68%] md:w-96 h-105 rounded-4xl shadow-xl flex flex-col overflow-auto lg:overflow-hidden"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="bg-gray-600 text-white p-4 flex justify-between">
        <span className="flex items-center gap-2">
          <FontAwesomeIcon icon={faRobot} />
          BarberBot
        </span>

        <button onClick={() => setChatOpen(false)}>&times;</button>
      </div>

      {inSession ? (
        <>
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-3 bg-gray-50">
            {messages.map((msg, i) =>
              msg.from === "bot" ? (
                <MessageBot key={i} message={msg.content} />
              ) : (
                <MessageUser key={i} message={msg.content} />
              ),
            )}

            {currentNode?.options?.map((opt, i) => (
              <SelectBot
                key={i}
                buttonValue={opt.label}
                iconValue={undefined}
                onClick={() => handleOption(opt)}
              />
            ))}

            {currentNode?.input === "date" && (
              <input
                type="date"
                className="border p-2 rounded-lg w-full"
                onChange={(e) => {
                  const value = e.target.value;

                  setMessages((prev) => [
                    ...prev,
                    { from: "user", content: `${value}` },
                  ]);

                  setCita((prev) => ({
                    ...prev,
                    fecha: value,
                    hora: prev.hora ?? "10:00 AM",
                  }));

                  setCurrentNodeId(currentNode.next!);
                }}
              />
            )}
          </div>
        </>
      ) : (
        <span className="m-auto anthelion">
          Inicia sesion para hablar con chat bot
        </span>
      )}
    </motion.div>
  );
};

export default ChatBot;
