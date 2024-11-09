
import React from "react";
import { BrowserRouter as Router, Route, Routes, NavLink } from "react-router-dom";
import { FCFS } from "./components/FCFS";
import { RoundRobin } from "./components/RoundRobin";
import { SJF } from "./components/SJF";
import { SRTF } from "./components/SRTF";
import './App.css';

function App() {
  return (
    <Router>
      <div className="container mt-5">
        <h1 className="text-center mb-4">OS Scheduling Algorithms Simulation</h1>
        <nav className="mb-4">
          <NavLink to="/" className="btn btn-primary mr-2">FCFS</NavLink>
          <NavLink to="/roundrobin" className="btn btn-primary mr-2">Round Robin</NavLink>
          <NavLink to="/sjf" className="btn btn-primary mr-2">SJF</NavLink>
          <NavLink to="/srtf" className="btn btn-primary">SRTF</NavLink>
        </nav>
        <Routes>
          <Route path="/" element={<FCFS />} />
          <Route path="/roundrobin" element={<RoundRobin />} />
          <Route path="/sjf" element={<SJF />} />
          <Route path="/srtf" element={<SRTF />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
