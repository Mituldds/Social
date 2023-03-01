import React from 'react'
import './Showfile.scss'

const Showfile = ({src}) => {
  return (
    <div className='show-file'>
        <img src={src} alt="" />
    </div>
  )
}

export default Showfile