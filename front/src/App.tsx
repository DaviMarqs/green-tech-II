import "./App.css";
import { Esqueci } from "./pages/Esqueci Senha";
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
          <Route path="/forgot" element={<Esqueci />}/> 
        </Routes>
    </BrowserRouter>
    </>
  )
}

export default App;
