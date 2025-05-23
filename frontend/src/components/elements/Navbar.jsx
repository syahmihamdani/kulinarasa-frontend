import { useEffect, useState } from 'react'
import { Home, Search, PlusCircle, Bookmark, LogOut, User, X } from "lucide-react";
import { useNavigate } from 'react-router-dom'

function Navbar() {
  const [showSearch, setShowSearch] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [userId, setUserId] = useState(null)
  const [userName, setUserName] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    // Get user ID from local storage when component mounts
    try {
      const userData = localStorage.getItem('user')
      if (userData) {
        const parsedUser = JSON.parse(userData)
        setUserId(parsedUser.id || parsedUser._id) // Handle different possible ID formats
        setUserName(parsedUser.name)
      }
    } catch (error) {
      console.error("Error retrieving user data from local storage:", error)
    }
  }, [])

  const handleProfileClick = (e) => {
    e.preventDefault()
    if (userId) {
      navigate(`/profile/${userId}`)
    } else {
      // Navigate to a default profile page if no user ID is found
      navigate('/profile')
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/search/${encodeURIComponent(searchQuery.trim())}`)
      setShowSearch(false)
      setSearchQuery("")
    }
  }

  const handleSearchKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch(e)
    }
    if (e.key === 'Escape') {
      setShowSearch(false)
      setSearchQuery("")
    }
  }

  const toggleSearch = (e) => {
    e.preventDefault()
    setShowSearch(!showSearch)
    if (!showSearch) {
      setSearchQuery("")
    }
  }

  // Close search when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showSearch && !event.target.closest('.search-container')) {
        setShowSearch(false)
        setSearchQuery("")
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showSearch])

  return (
    <nav className="bg-white shadow p-4 flex justify-between items-center relative">
      <div className="flex items-center space-x-2">
        <img src="/logo.png" alt="Kulinarasa Logo" className="h-8 w-8 object-contain" />
        <span className="text-2xl font-extrabold text-kulinarasa-orange font-kulinarasa">
          Kulinarasa
        </span>
      </div>
      <div className="space-x-4 flex items-center">
        <div className="relative search-container">
          <button
            onClick={toggleSearch}
            className="text-gray-700 hover:text-white hover:bg-kulinarasa-orange rounded-2xl p-2 bg-white transition-colors"
          >
            {showSearch ? <X className="w-5 h-5" /> : <Search className="w-5 h-5" />}
          </button>

          <div
            className={`absolute right-0 top-full mt-2 transition-all duration-300 ease-in-out z-50 ${
              showSearch ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
            }`}
          >
            <form onSubmit={handleSearch} className="flex bg-white shadow-lg rounded-lg border p-2">
              <input
                type="text"
                placeholder="Search recipes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearchKeyPress}
                className="w-64 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-kulinarasa-orange bg-white placeholder-gray-500 text-black"
                autoFocus={showSearch}
              />
              <button
                type="submit"
                className="ml-2 px-4 py-2 bg-kulinarasa-orange text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50"
                disabled={!searchQuery.trim()}
              >
                Search
              </button>
            </form>
          </div>
        </div>

        <a href="/home" className="text-gray-700 hover:text-white hover:bg-kulinarasa-orange rounded-2xl p-2 transition-colors">
          <Home className="w-5 h-5" />
        </a>
        <a href="/add" className="text-gray-700 hover:text-white hover:bg-kulinarasa-orange rounded-2xl p-2 transition-colors">
          <PlusCircle className="w-5 h-5" />
        </a>
        <a href="/saved" className="text-gray-700 hover:text-white hover:bg-kulinarasa-orange rounded-2xl p-2 transition-colors">
          <Bookmark className="w-5 h-5" />
        </a>
        <button 
          onClick={handleProfileClick}
          className="flex items-center space-x-2 text-gray-700 hover:text-white bg-transparent hover:bg-kulinarasa-orange rounded-2xl px-3 py-2 transition-colors"
        >
          <User className="w-5 h-5" />
          {userName && <span className="text-sm font-medium truncate max-w-24">{userName}</span>}
        </button>   
        <a href="/" className="text-gray-700 hover:text-white hover:bg-kulinarasa-orange rounded-2xl p-2 transition-colors">
          <LogOut className="w-5 h-5" />
        </a>
      </div>
    </nav>
  )
}

export default Navbar