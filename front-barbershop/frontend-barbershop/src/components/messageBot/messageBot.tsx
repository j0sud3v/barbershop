// import React from 'react'
import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRobot } from '@fortawesome/free-solid-svg-icons'
type messageType = {
    message: React.ReactNode
}
const MessageBot = ({message} : messageType) => {
  return (
        <div className='flex gap-2'>
            <span className='font-semibold text-white bg-gray-500 w-7 h-7 display flex items-center justify-center p-5 rounded-full gap-2 text-[18px]'>
                <FontAwesomeIcon icon={faRobot}/> 
            </span>
            <div className='bg-gray-500 text-white p-2.5 rounded-lg max-w-[80%] flex items-center min-h-[36px] min-w-[50px]'>
                {message}
            </div>
 
        </div>
  )
}

export default MessageBot
