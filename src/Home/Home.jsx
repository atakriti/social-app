import React, { useEffect } from "react";
import Mid from "../Mid/Mid";
import Right from "../Right/Right";
import "./home.scss";
function Home() {
  let noti = () => {
    Notification.requestPermission().then(prem => {
      if(prem === "granted"){
        new Notification(
          "Example notification",{
            body:"Hello",
            
          }
        )
      }
    })
  }
useEffect(() => {
  noti()
},[])




  return (
    <div className="home">
      <div className="home-container">
        <Mid />
        <Right />
      </div>
    </div>
  );
}

export default Home;
