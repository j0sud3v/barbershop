import React from 'react'
import image from '../../assets/back.png'

const Presentation = () => {
  return (
    <div
      className="w-full min-h-screen bg-cover bg-center flex items-center justify-center text-white text-center px-4"
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,.65), rgba(0,0,0,65)), url(${image})`
      }}
    >
      <span className="diploma text-4xl sm:text-6xl md:text-8xl lg:text-9xl">
        BarberShop
      </span>
    </div>
  )
}

export default Presentation