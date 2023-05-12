import React from 'react'
import Left from '../Left/Left'
import Mid from '../Mid/Mid'
import Right from '../Right/Right'
import "./home.scss"
import Header from '../Header/Header'
function Home() {
  return (
    <div className='home'>
        <Header/>
       <div className='home-container'>
         <Left/>
         <Mid/>
         <Right/>
       </div>
    </div>
  )
}

export default Home