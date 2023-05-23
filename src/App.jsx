import React, { useContext } from "react";
import { Routes, Route,useNavigate } from "react-router-dom";
import "./style.scss";
import Register from "./Regsiter/Register";
import Home from "./Home/Home";
import { context } from "./ContextFun";
import Header from "./Header/Header";
import Left from "./Left/Left";
function App() {
  const navigate = useNavigate()
  const { user } = useContext(context);
  return (
    <div className="home">
      <Header/>
      <div className="home-container">
      <Left/>
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/home" element={<Home />} />
       
      </Routes>
      </div>
      
    </div>
  );
}

export default App;
