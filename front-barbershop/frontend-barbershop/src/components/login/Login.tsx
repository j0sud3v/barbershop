import { useContext, useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faUnlock, faScissors, faEnvelope } from "@fortawesome/free-solid-svg-icons"
import imageBackground from '../../assets/back-login.png'
import Input from "../inputPassword/Input"
import { motion } from "motion/react"
import { NavLink, useNavigate } from "react-router-dom"
import { Context } from "../../Context/Context"
import { API_URL, authFetch } from "../../config/api"

const Login = () => {
  const navigate = useNavigate()
  const { setInSession } = useContext(Context)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [messageTone, setMessageTone] = useState<"success" | "error">("error")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage("")

    if (!email.trim() || !password) {
      setMessageTone("error")
      setMessage("Completa correo y contraseña")
      return
    }

    try {
      setLoading(true)
      const res = await authFetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      })

      let data: { ok?: boolean; error?: string; usuario?: { id: number; email: string; rol: string } }
      try {
        data = await res.json()
      } catch {
        setMessageTone("error")
        setMessage("Respuesta inválida del servidor")
        return
      }

      if (res.ok && data.ok && data.usuario) {
        setMessageTone("success")
        setMessage(`Bienvenido, ${data.usuario.email}`)
        setInSession(true)
        setTimeout(() => navigate("/"), 600)
        return
      }

      setMessageTone("error")
      setMessage(
        data.error || (res.status === 401 ? "Credenciales inválidas" : "No se pudo iniciar sesión")
      )
    } catch {
      setMessageTone("error")
      setMessage("Error de conexión")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="w-full min-h-screen bg-cover bg-no-repeat text-white anthelion font-light"
      style={{
        background: `linear-gradient(rgba(0,0,0,.85),rgba(0,0,0,65)), url(${imageBackground})`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <motion.div className="bg-black w-full  lg:w-[45%] min-h-screen absolute left-0 p-5 sm:p-10"
            initial={{ x: 300 }}
            animate={{ x: 0 }}    
            transition={{ duration: 0.5 }}
            >
        <form className="w-full" onSubmit={handleSubmit}>
          <span className="diploma flex justify-center text-5xl sm:text-8xl relative top-25 sm:top-0">Barbershop</span>

          <motion.div 
            initial={{ x: 300 }} 
            animate={{ x: 0 }}    
            transition={{ duration: 0.5 }}
            className="h-170 grid place-items-center scale-[.8] sm:scale-[1] w-full sm:w-auto"
            >
            <div className="w-fit grid gap-4">
              <h3 className="text-3xl sm:text-5xl my-3 text-center ff-fors">Inicia Sesion</h3>
              <div className="flex flex-col gap-2">
                <label className="text-2xl sm:text-3xl flex items-center justify-start gap-2">
                  <FontAwesomeIcon icon={faEnvelope} className="text-2xl"/>
                  Correo
                </label>
                <Input
                  placeholder="Ingresa tus email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                type="submit"
                disabled={loading}
                className="bg-[#2b2b2b] py-2 flex items-center justify-center text-xl gap-3 cursor-pointer hover:bg-[#2b2b2b]/50 mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ cursor: loading ? "not-allowed" : "pointer" }}
              >
                <FontAwesomeIcon icon={faScissors} />
                {loading ? "Entrando..." : "Inicia sesion"}
                <FontAwesomeIcon icon={faScissors} style={{transform: 'rotate(180deg)'}}/>
              </button>

              {message && (
                <span
                  className={
                    messageTone === "success"
                      ? "text-green-400 text-sm text-center"
                      : "text-red-400 text-sm text-center"
                  }
                >
                  {message}
                </span>
              )}

              <div className="text-center py-3">
                No tienes cuenta? <NavLink to='/register' className='underline'>Registrate Aqui</NavLink>
              </div>
            </div>
            
          </motion.div>
        </form>
      </motion.div>
    </div>
  )
}

export default Login;