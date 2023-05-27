import React, { useContext } from 'react'
import "./people.scss"
import { context } from '../ContextFun'
import avatar from "../images/avatar.png" 
import {RiUserAddFill} from "react-icons/ri"
function People() {
    let {users} = useContext(context)
  return (
    <div className='people'>
        <div className="people-container">
            {users?.map((item,i) => (
                <div key={i} className="singlePeople">
                    <a><img src={item?.photoURL === null ? avatar : item?.photoURL } alt="" /></a>
                    <h4>{item.displayName}</h4>
                    <button><RiUserAddFill/>Add friend </button>
                </div>
            ))}
        </div>
    </div>
  )
}

export default People