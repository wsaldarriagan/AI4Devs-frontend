import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import RecruiterDashboard from './components/RecruiterDashboard';
import AddCandidate from './components/AddCandidateForm'; 
import Positions from './components/Positions'; 
import KanbanBoardPosition from './components/kanbanBoardPosition';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RecruiterDashboard />} />
        <Route path="/add-candidate" element={<AddCandidate />} /> {/* Agrega esta línea */}
        <Route path="/positions" element={<Positions />} />
        <Route path="/kanbanPosition/:positionId" element={<KanbanBoardPosition />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;