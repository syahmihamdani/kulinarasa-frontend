import { useEffect, useState } from 'react'
import { Home, Search, PlusCircle, Bookmark, LogOut } from "lucide-react";
import { useNavigate } from 'react-router-dom';

function Navbar() {
  const [showSearch, setShowSearch] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem('user');
    setIsLoggedIn(!!user);
  }, []);

  const handleProtectedAction = (path) => {
    if (!isLoggedIn) {
      // Redirect ke login dengan pesan
      navigate('/login');
      return;
    }
    // Jika sudah login, bisa akses halaman
    navigate(path);
  };

  return (
    <nav className="bg-white shadow p-4 flex justify-between items-center">
      <a href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
        <img src="/logo.png" alt="Kulinarasa Logo" className="h-8 w-8 object-contain" />
        <span className="text-2xl font-extrabold text-kulinarasa-orange font-kulinarasa">
          Kulinarasa
        </span>
      </a>
      
      <div className="space-x-4 flex items-center">
        <div className="relative">
          <button
            onClick={(e) => {
              e.preventDefault();
              setShowSearch(!showSearch);
            }}
            className="text-gray-700 hover:text-white hover:bg-kulinarasa-orange rounded-2xl p-2 bg-white"
          >
            <Search className="w-5 h-5" />
          </button>

          <div
            className={`absolute right-10 top-1/2 transform -translate-y-1/2 transition-all duration-300 ease-in-out ${showSearch ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
              }`}
          >
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-64 px-4 mr-2 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-kulinarasa-orange bg-white placeholder-gray-500 text-black"
            />
          </div>
        </div>

        {/* Home button */}
        <a href="/home" className="text-gray-700 hover:text-white hover:bg-kulinarasa-orange rounded-2xl p-2">
          <Home className="w-5 h-5" />
        </a>

        {/* Add Recipe button */}
        <button 
          onClick={() => handleProtectedAction('/add')}
          className="text-gray-700 hover:text-white hover:bg-kulinarasa-orange rounded-2xl p-2 bg-white"
        >
          <PlusCircle className="w-5 h-5" />
        </button>

        {/* Saved/Bookmark button */}
        <button
          onClick={() => handleProtectedAction('/saved')}
          className="text-gray-700 hover:text-white hover:bg-kulinarasa-orange rounded-2xl p-2 bg-white"
        >
          <Bookmark className="w-5 h-5" />
        </button>

        {/* Login/Logout button */}
        {isLoggedIn ? (
          <a href="/" 
             onClick={() => localStorage.removeItem('user')}
             className="text-gray-700 hover:text-white hover:bg-kulinarasa-orange rounded-2xl p-2"
          >
            <LogOut className="w-5 h-5" />
          </a>
        ) : (
          <a href="/login" className="text-gray-700 hover:text-white hover:bg-kulinarasa-orange rounded-2xl px-4 py-2">
            Login
          </a>
        )}
      </div>
    </nav>
  )
}

export default Navbar
