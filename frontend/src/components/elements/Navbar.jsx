import { useEffect, useState } from 'react'
import { Home, Search, PlusCircle, Bookmark, LogOut } from "lucide-react";


function Navbar() {
  const [showSearch, setShowSearch] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <nav className="bg-white shadow p-4 flex justify-between items-center">
      <div className="flex items-center space-x-2">
        <img src="/logo.png" alt="Kulinarasa Logo" className="h-8 w-8 object-contain" />
        <span className="text-2xl font-extrabold text-kulinarasa-orange font-kulinarasa">
          Kulinarasa
        </span>
      </div>
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

        <a href="/home" className="text-gray-700 hover:text-white hover:bg-kulinarasa-orange rounded-2xl p-2">
          <Home className="w-5 h-5" />
        </a>
        <a href="/add" className="text-gray-700 hover:text-white hover:bg-kulinarasa-orange rounded-2xl p-2">
          <PlusCircle className="w-5 h-5" />
        </a>
        <a href="/saved" className="text-gray-700 hover:text-white hover:bg-kulinarasa-orange rounded-2xl p-2">
          <Bookmark className="w-5 h-5" />
        </a>
        <a href="/" className="text-gray-700 hover:text-white hover:bg-kulinarasa-orange rounded-2xl p-2">
          <LogOut className="w-5 h-5" />
        </a>
      </div>
    </nav>
  )
}

export default Navbar
