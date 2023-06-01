import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import "./header.scss"
import {AiOutlineLogout} from "react-icons/ai"
import {signOut} from "firebase/auth"
import { auth } from '../firebase'
import { context } from '../ContextFun'
import {MdNotifications} from "react-icons/md"

import avatar from "../images/avatar.png" 
function Header() {
  let navigate = useNavigate()
  const {user,findUser} = useContext(context)
  const signout = async () => {
    await signOut(auth).then(() => navigate("/"))
  }
  return (
    <header>
        <div className="logo">
            <a><img src={user?.photoURL === null ? avatar : user?.photoURL} alt="" /></a>
            <h3>{user?.displayName}</h3>
        </div>
        <div onClick={signout} className="header-right-co">
      {findUser?.chat?.some(cha => cha?.messages?.some(item => item?.isRecived === false)) && <MdNotifications className='not'/> }

           <div className='header-right'>
             <AiOutlineLogout/>
             <h3>Sign out</h3>
           </div>
        </div>
    </header>
  )
}

export default Header