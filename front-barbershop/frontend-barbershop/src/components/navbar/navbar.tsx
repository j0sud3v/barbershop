import { useState, useContext, useEffect, startTransition } from 'react'
import logo from '../../assets/logo.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faInstagram, faFacebook } from '@fortawesome/free-brands-svg-icons'
import { faBars } from '@fortawesome/free-solid-svg-icons'
import NavbarHidden from '../navbarHidden/navbarHidden'
import { AnimatePresence } from 'motion/react'
import { NavLink, useNavigate } from 'react-router-dom'
import { Context } from '../../Context/Context'
import { API_URL, authFetch } from '../../config/api'
import type { RolType } from '../../types/ContextType/ContextType'

type UsuarioMe = {
  id: number
  email: string
  rol: RolType
  nombres?: string | null
  nombre?: string | null
  name?: string | null
}


const Navbar = () => {

    const [ menuHiddenOpen , setMenuHiddenOpen ] = useState(false)
    const navigate = useNavigate()
    const context = useContext(Context);
    const { 
            inSession, 
            setInSession, 
            nombreUsuarioEnSesion, 
            setNombreUsuarioEnSesion,
            rolUserEnSesion,
            setRolUserEnSesion
          } = context

    useEffect(() => {
      if (!inSession) {
        startTransition(() => setNombreUsuarioEnSesion(null))
        startTransition(() => setRolUserEnSesion(undefined))
        return
      }
      let cancelled = false
      ;(async () => {
        try {
          const r = await authFetch(`${API_URL}/auth/me`)
          const data = (await r.json().catch(() => ({}))) as {
            error?: string
            usuario?: UsuarioMe
            user?: UsuarioMe
          }
          const u = data.usuario ?? data.user
          if (cancelled || !r.ok || !u || typeof u.email !== 'string') return
          setNombreUsuarioEnSesion(data.usuario?.nombre ?? null)
          setRolUserEnSesion(data.usuario?.rol)
        } catch { 
          /* red o respuesta inválida */
        }
      })()
      return () => {
        cancelled = true
      }
    }, [inSession, setNombreUsuarioEnSesion, setRolUserEnSesion])

    const handleLogout = async () => {
      try {
        await authFetch(`${API_URL}/auth/logout`, { method: "POST" })
      } finally {
        setInSession(false)
        setNombreUsuarioEnSesion(null)
        navigate("/")
      }
    }


  return (
    <div className='w-full mt-3 absolute md:fixed top-0 left-0 z-50 '>
      <nav className='w-full py-5 lg:py-1 bg-black gap-0 sm:gap-10 text-white flex items-center justify-between px-4 diploma flex-col lg:flex-row'>
        
        <div className='flex items-center justify-between w-full lg:w-auto'>
          <span className='text-4xl'>
            <img src={logo} alt="" className='w-20' />
          </span>

          <button 
            className='lg:hidden text-3xl text-white focus:outline-none z-60'
            onClick={() => setMenuHiddenOpen(prev => !prev)}
            >
            <FontAwesomeIcon icon={faBars} />
          </button>
        </div>

        <ul className='hidden lg:flex flex-col items-center justify-center gap-14 md:items-start md:justify-start lg:flex-row'>
          <li className='cursor-pointer hover:text-gray-300'>
            <a href="#" className='text-4xl'>Inicio</a>
          </li>
          <li className='cursor-pointer hover:text-gray-300'>
            <a href="#" className='text-4xl'>Servicios</a>
          </li>
          {rolUserEnSesion === 'admin' &&
            <li className='cursor-pointer hover:text-gray-300'>
              <a href="#" className='text-4xl'>Citas</a>
            </li>
          }

          <li className='cursor-pointer hover:text-gray-300'>
            <a href="#" className='text-4xl'>Cursos</a>
          </li>
        </ul>
        
        <div className='flex flex-col items-center justify-center sm:flex-row gap-5 text-4xl'>
          <div>
            <FontAwesomeIcon icon={faInstagram} />
            <FontAwesomeIcon icon={faFacebook} />
          </div>

          <div className="anthelion flex gap-3 text-lg sm:text:2xl items-center justify-center">
            {inSession ? (
              <div className='flex flex-col-reverse items-center sm:flex-row sm:items-start gap-3'>
                <button
                type="button"
                onClick={handleLogout}
                className="underline cursor-pointer border-0 text-inherit font-inherit flex lg:fixed items-center justify-center top-20 rounded-sm w-40 right-3 bg-amber-900"
              >
                Cerrar sesión
              </button>
              <span
                className="text-base max-w-48 truncate"
                title={nombreUsuarioEnSesion || undefined}
              >
                Sesion: {nombreUsuarioEnSesion}
              </span>
              </div>

            ) : (
              <>
                <NavLink to='/login'>
                  Inicia Sesion
                </NavLink>

                <NavLink to='/register'>
                  Registrate
                </NavLink>
              </>
            )}
          
        </div>
        </div>

        
        
      </nav>
      <AnimatePresence mode="wait">
        {menuHiddenOpen && <NavbarHidden />}
      </AnimatePresence>
    </div>
  )
}

export default Navbar