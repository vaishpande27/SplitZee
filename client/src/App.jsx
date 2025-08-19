import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import TransactionsPage from "./pages/Transactions";
import { useState } from "react";

function App() {

  return (
    <>
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/groups/:groupId/transactions" element={<TransactionsPage />} />
      </Routes>
    </Router>
    </>
  );
}

export default App;
