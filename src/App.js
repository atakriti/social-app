import React from "react";
import {Routes,Route} from "react-router-dom"
import "./style.scss"
import Register from "./Regsiter/Register";
import Home from "./Home/Home";
function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Register/>}/>
        <Route path="/home" element={<Home/>}/>
      </Routes>
     
    </div>
  );
}

export default App;
