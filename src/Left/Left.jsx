import React, { useEffect, useState } from 'react'
import {BiHomeAlt} from "react-icons/bi"
import {BsFillChatFill} from "react-icons/bs"
import {FiUsers} from "react-icons/fi"
import {MdPermMedia} from "react-icons/md"

import "./left.scss"
import { useLocation, useNavigate,useParams } from 'react-router-dom'
function Left() {
    const navigate = useNavigate()
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
    <div className='left'>
        <ul>
            {lists.map((item,i) => (
                <li  className={item.title === selectedItem ? 'list listEffect':'list'} onClick={() => handleClick(item)} key={i}><item.logo/> <h4>{item.title[0].toUpperCase() + item.title.slice(1)}</h4></li>
            ))}
        </ul>
    </div>
  )
}

export default Left