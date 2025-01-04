import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-2xl font-display font-bold text-primary">
            HackathonHub
          </Link>
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/mentors" className="nav-link">Mentors</Link>
            <Link to="/about" className="nav-link">About</Link>
            <Link to="/news" className="nav-link">News</Link>
            <Link to="/gallery" className="nav-link">Gallery</Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/login" className="nav-link">Login</Link>
            <Link to="/register" className="btn-primary">
              Join Now
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}