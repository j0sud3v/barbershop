import { useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faUser, faUnlock, faScissors, faEnvelope } from "@fortawesome/free-solid-svg-icons"
import imageBackground from '../../assets/back-register.png'
import Input from "../inputPassword/Input"
import CofirmCode from "../ConfirmCode/CofirmCode"
import { motion } from 'motion/react'
import { NavLink, useNavigate } from "react-router-dom"
import { API_URL, authFetch } from "../../config/api"

const Register = () => {
  const navigate = useNavigate();
  const [nombres , setNombres] = useState("")
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorEmail, setErrorEmail] = useState("");
  const [errorNombres, setErrorNombres] = useState("");
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");
  const [verifyMessageTone, setVerifyMessageTone] = useState<"success" | "error">("success");
  const [loading, setLoading] = useState(false);
  const [codeSent, setCodeSent] = useState(false);

  const validarEmail = (value: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(value);
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);

    if (!validarEmail(value)) {
      setErrorEmail("Correo inválido");
    } else {
      setErrorEmail("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const emailNormalizado = email.trim();

    if (!nombres.trim()) {
      setErrorNombres("Ingresa tu nombre");
      return;
    }
    setErrorNombres("");

    if (!validarEmail(emailNormalizado)) {
      setErrorEmail("Correo inválido");
      return;
    }

    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), 20000);

    try {
      setLoading(true);
      setMessage("");
      setCodeSent(false);
      setVerifyMessageTone("success");

      const res = await authFetch(`${API_URL}/auth/send-code`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email: emailNormalizado }),
        signal: controller.signal,
      });

      const data = await res.json().catch(() => ({})) as {
        ok?: boolean;
        error?: string;
        message?: string;
      };

      if (res.ok && data.ok) {
        setMessage(data.message || "Código enviado a tu correo");
        setCodeSent(true);
      } else {
        setVerifyMessageTone("error");
        setMessage(data.error || data.message || "Error al enviar código");
        setCodeSent(false);
      }

    } catch (error) {
      setVerifyMessageTone("error");
      const isAbortError = error instanceof Error && error.name === "AbortError";
      setMessage(isAbortError ? "La petición tardó demasiado. Revisa el backend o intenta de nuevo." : "Error de conexión: " + String(error));
      setCodeSent(false);
    } finally {
      window.clearTimeout(timeoutId);
      setLoading(false);
    }
  };
  const handleVerify = async () => {
    if (!nombres.trim()) {
      setVerifyMessageTone("error");
      setMessage("Ingresa tu nombre antes de verificar el código");
      return;
    }

    if (!password.trim()) {
      setVerifyMessageTone("error");
      setMessage("Ingresa una contraseña antes de verificar el código");
      return;
    }

    try {
      setLoading(true);
      setMessage("");
      setVerifyMessageTone("success");

      const verifyRes = await authFetch(`${API_URL}/auth/verify-code`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });
      const verifyData = await verifyRes.json();

      if (!verifyRes.ok || !verifyData.ok) {
        setVerifyMessageTone("error");
        setMessage(verifyData.error || "Código incorrecto");
        return;
      }

      const createRes = await authFetch(`${API_URL}/usuarios`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          nombres: nombres.trim(),
          rol: "cliente",
        }),
      });
      const createData = await createRes.json();

      if (!createRes.ok) {
        setVerifyMessageTone("error");
        setMessage(createData.error || "No se pudo crear el usuario");
        return;
      }

      setVerifyMessageTone("success");
      setMessage(createData.message || "Cuenta creada ✅");
      setTimeout(() => navigate("/login"), 1200);
    } catch (error) {
      setVerifyMessageTone("error");
      setMessage("Error de conexión: " + String(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="w-full min-h-screen bg-cover bg-no-repeat text-white ff-fors font-light"
      style={{
        background: `linear-gradient(rgba(0,0,0,.65),rgba(0,0,0,65)), url(${imageBackground})`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <motion.div 
        className="bg-black w-full  lg:w-[45%] min-h-screen absolute right-0 p-5 sm:p-10"
        initial={{ x: -300 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.5 }}
        >
        <form className="w-full" onSubmit={handleSubmit}>
          <span className="diploma flex text-5xl sm:text-8xl relative top-25 sm:top-0 justify-center">Barbershop</span>

          <motion.div className="h-170 grid place-items-center scale-[.8] sm:scale-[1] w-full sm:w-auto"
               initial={{ x: -300 }}
               animate={{ x: 0 }} 
               transition={{ duration: 0.5 }}     
                >
            
            <div className="w-fit grid gap-4">
                <h3 className="text-3xl sm:text-5xl my-3 text-center ff-fors">Registrate</h3>

              <div className="flex flex-col gap-2">
                <label className="text-2xl sm:text-3xl flex items-center justify-start gap-2">
                  <FontAwesomeIcon icon={faUser} className="text-2xl"/>
                  Nombres
                </label>
                <Input 
                    placeholder="Ingresa tus nombres" 
                    type="text" 
                    value={nombres}
                    onChange={(e) => {
                      setNombres(e.target.value);
                      setErrorNombres("");
                    }}
                    />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-2xl sm:text-3xl flex items-center justify-start gap-2">
                  <FontAwesomeIcon icon={faEnvelope} className="text-2xl"/>
                  Correo
                </label>
                <Input
                  placeholder="Ingresa tus email"
                  type="email"
                  onChange={(e) => handleEmailChange(e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-2xl sm:text-3xl flex items-center justify-start gap-2">
                  <FontAwesomeIcon icon={faUnlock} className="text-2xl"/>
                  Password
                </label>
                <Input
                  placeholder="Ingresa tu contraseña"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <button
                className="bg-[#2b2b2b] py-2 flex items-center justify-center text-xl gap-3 cursor-pointer hover:bg-[#2b2b2b]/50 mt-4"
                style={{ cursor: loading ? "not-allowed" : "pointer" }}
                disabled={loading}
              >
                <FontAwesomeIcon icon={faScissors} />
                {loading ? "Enviando..." : "Registrarse"}
                <FontAwesomeIcon icon={faScissors} style={{transform: 'rotate(180deg)'}}/>
              </button>

              <div className="text-center py-3">
                Ya tienes cuenta? <NavLink to='/login' className='underline'>Inicia sesion</NavLink>
              </div>

              {codeSent && (
                <CofirmCode
                  code={code}
                  setCode={setCode}
                  onVerify={handleVerify}
                  loading={loading}
                  message={message}
                  messageTone={verifyMessageTone}
                />
              )}

              {errorNombres && (
                <span className="text-red-500 text-sm text-center">{errorNombres}</span>
              )}

              {errorEmail && (
                <span className="text-red-500 text-sm text-center">{errorEmail}</span>
              )}

              {!codeSent && message && (
                <span
                  className={
                    verifyMessageTone === "error"
                      ? "text-red-400 text-sm text-center"
                      : "text-green-400 text-sm text-center"
                  }
                >
                  {message}
                </span>
              )}

            </div>
          </motion.div>
        </form>
      </motion.div>
    </div>
  )
}

export default Register;