import React, { useContext } from 'react'
import "./right.scss"
import { context } from '../ContextFun'
function Right() {
  let {findUser} = useContext(context)
  return (
    <div className='right'>
      <h2>Friends Requests</h2>
    </div>
  )
}

export default Right