import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import ContextFun from "./ContextFun";
import { BrowserRouter } from "react-router-dom";
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <ContextFun>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </ContextFun>
);
