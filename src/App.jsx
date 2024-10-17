import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginComponent from './components/LoginComponent';
import DashboardComponent from './components/DashboardComponent';
import VehiculoDetailComponent from './components/VehiculoDetailComponent';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginComponent />} />
        <Route path="/dashboard" element={<DashboardComponent />} />
        <Route path="/vehiculo/:vehiId" element={<VehiculoDetailComponent />} />
      </Routes>
    </Router>
  );
}

export default App;
