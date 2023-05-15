import React from 'react'
import {BiHomeAlt} from "react-icons/bi"
import {BsFillChatFill} from "react-icons/bs"
import {FiUsers} from "react-icons/fi"
import {MdPermMedia} from "react-icons/md"
import {CgProfile} from "react-icons/cg"
import {AiFillSetting} from "react-icons/ai"
import "./left.scss"
function Left() {
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
        {
            title:"profile",
            logo: CgProfile
        },
        {
            title:"settings",
            logo: AiFillSetting
        }
    ]
  return (
    <div className='left'>
        <ul>
            {lists.map((item,i) => (
                <li key={i}><item.logo/> <h4>{item.title[0].toUpperCase() + item.title.slice(1)}</h4></li>
            ))}
        </ul>
    </div>
  )
}

export default Left