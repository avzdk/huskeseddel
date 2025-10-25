import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import Navigation from './components/Navigation';
import IndkoebslistePage from './components/IndkoebslistePage';
import VarerPage from './components/VarerPage';
import KategorierPage from './components/KategorierPage';
import './App.css';

function App() {
  return (
    <div className="App">
      <Navigation />
      <Container className="mt-4">
        <Routes>
          <Route path="/" element={<IndkoebslistePage />} />
          <Route path="/varer" element={<VarerPage />} />
          <Route path="/kategorier" element={<KategorierPage />} />
        </Routes>
      </Container>
    </div>
  );
}

export default App;