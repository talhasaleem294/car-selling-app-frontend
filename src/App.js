import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import VehicleForm from './components/VehicleForm';

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route exact path="/" element={<Login />} />
          <Route exact path="/vehicle" element={<VehicleForm />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
