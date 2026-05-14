// import React from 'react'
import { motion } from "motion/react"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useContext } from 'react'
import { Context } from '../../Context/Context'
import { faRobot } from '@fortawesome/free-solid-svg-icons'
const PearlBot = () => {

    const context = useContext(Context);
    if (!context) {
        return <div>Cargando...</div>; 
    }

  const { setChatOpen } = context;

  return (
    <motion.div 
        className='fixed right-0 bottom-0 p-7 overflow-hidden'
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                whileHover={{ scale: 1 }}
                whileTap={{ scale: 0.90 }}
        >
        <div 
            className='w-15 h-15 flex items-center justify-center cursor-pointer text-white bg-gray-600 rounded-full'
            onClick={() => setChatOpen(true)}
        >
            <FontAwesomeIcon icon={faRobot}/>
        </div>
    </motion.div>
  )
}

export default PearlBot
