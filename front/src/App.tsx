import "./App.css";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";

import { Routes, Route, BrowserRouter } from "react-router-dom";


function App() {
  return (
    <>
    <BrowserRouter>
        <Routes>
          <Route path="/register" element={<Register />}/>
          <Route path="/" element={<Login />}/>   
        </Routes>
    </BrowserRouter>
    </>
  )
}

export default App;
