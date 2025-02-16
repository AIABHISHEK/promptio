import React from 'react';
import { Toaster } from 'react-hot-toast';
import { Sparkles } from 'lucide-react';
import { LandingPage } from './components/LandingPage';
import { ProfilePage } from './components/ProfilePage';
import { ThemeToggler } from './components/ThemeToggler';
import { PromptsPage } from './components/PromptsPage';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Toaster position="top-center" />
        
        <nav className="bg-white shadow-sm">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <div className="flex items-center">
              <Sparkles className="h-8 w-8 text-blue-500" />
              <span className="ml-2 text-xl font-bold text-gray-900">PromptShare</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/" className="text-gray-700 hover:text-gray-900">Home</Link>
              <Link to="/profile" className="text-gray-700 hover:text-gray-900">Profile</Link>
              <ThemeToggler />
            </div>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/prompts" element={<PromptsPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;