import React, { useContext } from "react";
import { Routes, Route,useNavigate } from "react-router-dom";
import "./style.scss";
import Register from "./Regsiter/Register";
import Home from "./Home/Home";
import { context } from "./ContextFun";
function App() {
  const navigate = useNavigate()
  const { user } = useContext(context);
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/home" element={<Home />} />
       
      </Routes>
    </div>
  );
}

export default App;
