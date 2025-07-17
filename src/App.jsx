// src/App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './Header'; // <-- 1. Import komponen Header
import IdeasPage from './ideasPage'; // Pastikan path import benar

// Buat komponen sementara untuk halaman lain
const WorkPage = () => <h1 className="pt-20 text-center">Work Page</h1>;
const AboutPage = () => <h1 className="pt-20 text-center">About Page</h1>;
const CareersPage = () => <h1 className="pt-20 text-center">Careers Page</h1>;
const ContactPage = () => <h1 className="pt-20 text-center">Contact Page</h1>;

function App() {
  return (
    <div>
      <Header />
      <Routes>
        <Route path="/" element={<IdeasPage />} />
        <Route path="/ideas" element={<IdeasPage />} />
        <Route path="/work" element={<WorkPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/careers" element={<CareersPage />} />
        <Route path="/contact" element={<ContactPage />} />
        {/* Tambahkan rute lain jika perlu */}
      </Routes>
    </div>
  );
}

export default App;