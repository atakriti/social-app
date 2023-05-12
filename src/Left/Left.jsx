import React from 'react'
import {BiHomeAlt} from "react-icons/bi"
import {FiUsers} from "react-icons/fi"
import {MdPermMedia} from "react-icons/md"
import {CgProfile} from "react-icons/cg"
import {AiFillSetting} from "react-icons/ai"
import "./left.scss"
function Left() {
    const lists = [
        {
            title:"Home",
            logo: BiHomeAlt
        },
        {
            title:"People",
            logo: FiUsers
        },
        {
            title:"Media",
            logo: MdPermMedia
        },
        {
            title:"Profile",
            logo: CgProfile
        },
        {
            title:"Settings",
            logo: AiFillSetting
        }
    ]
  return (
    <div className='left'>
        <ul>
            {lists.map((item,i) => (
                <li key={i}><item.logo/> <h4>{item.title}</h4></li>
            ))}
        </ul>
    </div>
  )
}

export default Left