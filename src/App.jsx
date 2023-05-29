import React, { useContext } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import "./style.scss";
import Register from "./Regsiter/Register";
import Home from "./Home/Home";
import { context } from "./ContextFun";
import Header from "./Header/Header";
import Left from "./Left/Left";
import People from "./People/People";
import Media from "./Media/Media";
import Chat from "./Chat/Chat";
function App() {
  let location = useLocation();

  return (
    <div className="home">
      {/* Render it everywhere except root */}
      {location.pathname !== "/" && <Header />}
      <div className="home-container">
        {location.pathname !== "/" && <Left />}

        <Routes>
          <Route exact path="/" element={<Register />} />
          <Route path="/home" element={<Home />} />
          <Route path="/people" element={<People />} />
          <Route path="/media" element={<Media />} />
          <Route path="/chat" element={<Chat />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
