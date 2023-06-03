import React, { useContext, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useMediaQuery } from 'react-haiku';
import "./header.scss"
import {AiOutlineLogout} from "react-icons/ai"
import {FaUserFriends} from "react-icons/fa"
import {signOut} from "firebase/auth"
import { auth } from '../firebase'
import { context } from '../ContextFun'
import {MdNotifications, MdPermMedia} from "react-icons/md"

import avatar from "../images/avatar.png" 
import { BiHomeAlt } from 'react-icons/bi'
import { FiUsers } from 'react-icons/fi'
import { BsFillChatFill } from 'react-icons/bs'
function Header() {
  const breakpoint = useMediaQuery('(max-width: 900px)');
  let navigate = useNavigate()
  const {user,findUser} = useContext(context)
  const signout = async () => {
    await signOut(auth).then(() => navigate("/"))
  }

    let location = useLocation();
    const lists = [
        {
            title:"home",
            logo: BiHomeAlt
        },
        {
            title:"people",
            logo: FiUsers
        },
        {
            title:"chat",
            logo: BsFillChatFill
        },
        {
            title:"media",
            logo: MdPermMedia
        },
    ]
    let [selectedItem,setSelectedItem] = useState(location.pathname.replace("/",""))
    let handleClick = (item) => {
        navigate(`/${item?.title}`)
        setSelectedItem(item?.title)
    }




  return (
    <div className='header'>
    <header>
        <div className="logo">
            <a><img src={user?.photoURL === null ? avatar : user?.photoURL} alt="" /></a>
            <h3>{user?.displayName}</h3>
        </div>
        <div className="header-right-co">
      {findUser?.chat?.some(cha => cha?.messages?.some(item => item?.isRecived === false)) && <MdNotifications onClick={() => navigate("/chat")} className='not'/> }
      {findUser?.friendsRequests.length > 0 && <FaUserFriends onClick={() => navigate("/people")} className='not'/>}
           <div onClick={signout} className='header-right'>
             <AiOutlineLogout/>
             <h3>Sign out</h3>
           </div>
        </div>
    </header>
    {breakpoint && (
 <nav>
 <div className="navcontainer">
 {lists.map((item,i) => (
             <li  className={item.title === selectedItem ? 'list_ listEffect_':'list_'} onClick={() => handleClick(item)} key={i}><item.logo/></li>
         ))}
 </div>
 </nav>
    )}
   
    </div>
  )
}

export default Header