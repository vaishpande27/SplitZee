import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import { useState } from "react";


function App() {

//   let [counter,setcounter]=useState(0);
// function addvalue(){
//   setcounter(counter+1)
// }
// function remvalue(){
//   setcounter(counter-1)
// }
  return (
    <>
    {/* <h2> Hooks</h2>
    <h3>{counter}</h3>
    <button onClick={addvalue}>+</button>
    <button onClick={remvalue}>-</button> */}
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
    </>
  );
}

export default App;
