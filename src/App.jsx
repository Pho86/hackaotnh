import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import StockPet from "./components/StockPet";
import Home from "./components/Home";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/stockpet" element={<StockPet />} />
      </Routes>
    </Router>
  );
}

export default App;
