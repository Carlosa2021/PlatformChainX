import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPageNew from './pages/LandingPageNew';
import './styles.css';

const App = () => {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LandingPageNew />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;