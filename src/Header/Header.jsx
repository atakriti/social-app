import React from 'react'
import { useNavigate } from 'react-router-dom'
import "./header.scss"
import {AiOutlineLogout} from "react-icons/ai"
function Header() {
  let navigate = useNavigate()
  return (
    <header>
        <div className="logo">
            <a><img src={require("../images/anwar-logo.jpg")} alt="" /></a>
            <h3>Anwar Takriti</h3>
        </div>
        <div onClick={() => navigate("/")} className="header-right">
            <AiOutlineLogout/>
            <h3>Sign out</h3>
        </div>
    </header>
  )
}

export default Header