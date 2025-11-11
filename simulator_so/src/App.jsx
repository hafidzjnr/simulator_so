import React from "react";
import { Routes, Route, Outlet } from "react-router-dom";
import Navbar from '../components/Navbar'
import HomePage from '../pages/HomePage'
import InstructionPage from '../pages/InstructionPage'
import SimulatorPage from '../pages/SimulatorPage'
import AboutPage from '../pages/AboutPage'
import './styles/App.css'

const AppLayout = () => {
  return (
    <div className="app-container">
      <Navbar />
      <div className="page-content">
        <Outlet />
      </div>
    </div>
  )
}

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        <Route index element={<HomePage />} />
        <Route path="instruction" element={<InstructionPage />} />
        <Route path="simulator" element={<SimulatorPage />} />
        <Route path="about" element={<AboutPage />} />
      </Route>
    </Routes>
  );
};

export default App;