import React, { useContext, useEffect, useState } from 'react'
import "./right.scss"
import { context } from '../ContextFun'
import avatar from "../images/avatar.png";

function Right() {
  let {findUser,users} = useContext(context)
  let filterd = []
 
  for(let i = 0; i < users?.length; i++){
    let user = users[i]
    for(let j = 0; j < findUser?.friendsRequests?.length; j++){
      let id = findUser?.friendsRequests[j]
      if(id === user?.id){
        filterd.push(user)
       break;
      }
    }
  }
  
 

  return (
    <div className='right'>
      {filterd.length === 0 && (
      <h2>No Friends requests</h2>
      )}
      {filterd?.map(item => (
        <div className="singleRequest">
          <a><img src={item?.photoURL === null ? avatar : item?.photoURL} alt="" /></a>
          <h3>{item.displayName}</h3>
          <button>Accept</button>
          <button className='rej-btn'>Reject</button>
        </div>
      ))}
      

    </div>
  )
}

export default Right