import React, { useState } from "react";
import { Link } from "react-router-dom";
import Login from "@/pages/auth/Login";
import RegisterDialog from "@/pages/auth/RegisterDialog";

export default function Navbar() {
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [showRegisterDialog, setShowRegisterDialog] = useState(false);

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200 dark:bg-gray-900/80 dark:border-gray-800">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-2xl font-display font-bold text-primary">
            HackathonHub
          </Link>
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/public/mentors" className="nav-link">Mentors</Link>
            <Link to="/about" className="nav-link">About</Link>
            <Link to="/public/news" className="nav-link">News</Link>
            <Link to="/public/gallery" className="nav-link">Gallery</Link>
            <Link to="/public/faq" className="nav-link">FAQ</Link>
          </div>
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setShowLoginDialog(true)} 
              className="nav-link"
            >
              Login
            </button>
            <button 
              onClick={() => setShowRegisterDialog(true)}
              className="btn-primary"
            >
              Join Now
            </button>
          </div>
        </div>
      </div>
      <Login isOpen={showLoginDialog} onClose={() => setShowLoginDialog(false)} />
      <RegisterDialog isOpen={showRegisterDialog} onClose={() => setShowRegisterDialog(false)} />
    </nav>
  );
}