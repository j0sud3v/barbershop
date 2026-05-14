import { useEffect } from "react";
import { motion } from "motion/react";
import { NavLink } from "react-router-dom";
const NavbarHidden = () => {

  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return ( 
    <motion.div 
        className="fixed w-full h-screen bg-[rgba(0,0,0)] top-0 left-0 grid place-content-center"
        initial={ {x: "100%"} }
        animate={{ x: 0} }
        exit={ {x: "100%"} }
          transition={{
            duration: 0.5,
            ease: [0.22, 1, 0.36, 1]
        }}
        >
      <ul className='text-white flex flex-col items-center justify-center diploma gap-4 text-5xl'>
        <NavLink to='/'>
          Inicio
        </NavLink>
        <NavLink to='/'>
          Servicios
        </NavLink>
        <NavLink to='/'>
          Cursos
        </NavLink>
      </ul>
    </motion.div>
  )
}

export default NavbarHidden;