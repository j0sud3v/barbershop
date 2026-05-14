import { faUser } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

type MessageUserType = {
    message: React.ReactNode
}

const MessageUser = ({message} : MessageUserType) => {
  return (
        <div className='flex gap-2 justify-end'>
            <div className='bg-black/50 text-white p-2.5 rounded-lg max-w-[80%] self-start'>
                {message}
            </div>
            <span className='font-semibold text-white bg-black/50 w-7 h-7 display flex items-center justify-center p-5 rounded-full gap-2 text-[18px]'>
                <FontAwesomeIcon icon={faUser}/> 
            </span>
            
 
        </div>
  )
}

export default MessageUser
