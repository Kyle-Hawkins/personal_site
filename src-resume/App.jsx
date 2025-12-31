import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import About from './pages/About';
import Resume from './pages/Resume';
import Demos from './pages/Demos';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<About />} />
          <Route path="/resume" element={<Resume />} />
          <Route path="/demos" element={<Demos />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
