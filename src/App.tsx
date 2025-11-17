import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Welcome from "./pages/Welcome";
import Dashboard from "./pages/Dashboard";
import HelpFAQ from "./pages/HelpFAQ";
import NotFound from "./pages/NotFound";
import { LanguageProvider } from "./contexts/LanguageContext";

export default function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-gray-50 text-gray-900">
          <header className="p-4 bg-white shadow">
            <div className="container mx-auto flex items-center justify-between">
              <h1 className="font-bold">Surakshitam Secure Vault</h1>
              <nav className="space-x-4">
                <Link to="/" className="hover:underline">Home</Link>
                <Link to="/dashboard" className="hover:underline">Dashboard</Link>
                <Link to="/help" className="hover:underline">Help</Link>
              </nav>
            </div>
          </header>

          <main className="container mx-auto p-6">
            <Routes>
              <Route path="/" element={<Welcome />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/help" element={<HelpFAQ />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </LanguageProvider>
  );
}
