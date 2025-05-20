import { useEffect, useState } from 'react'
import { Home, Search, PlusCircle, Bookmark, LogOut, User } from "lucide-react";

function Navbar() {
  const [showSearch, setShowSearch] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [userId, setUserId] = useState(null)
  const [userName, setUserName] = useState(null)
  const [searchResults, setSearchResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  // Mock navigate function since we can't use react-router-dom
  const navigate = (path, options) => {
    console.log(`Navigating to ${path}`, options)
    // In a real app, this would use react-router's navigate
  }

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

  // Handle search submission
  const handleSearch = async (e) => {
    if (e) {
      e.preventDefault()
    }
    
    if (!searchQuery.trim()) return
    
    setIsSearching(true)
    
    try {
      const response = await fetch(`https://kulinarasa-backend.vercel.app/recipe/search/${encodeURIComponent(searchQuery)}`)
      
      if (!response.ok) {
        throw new Error('Search failed')
      }
      
      const data = await response.json()
      
      if (data.success) {
        // Navigate to search results page with the results
        navigate('/search-results', { state: { results: data.data, query: searchQuery } })
      } else {
        console.error('Search failed:', data.message)
      }
    } catch (error) {
      console.error('Error searching recipes:', error)
    } finally {
      setIsSearching(false)
    }
  }

  // Handle enter key press in search input
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  return (
    <nav className="bg-white shadow p-4 flex justify-between items-center">
      <div className="flex items-center space-x-2">
        <img src="/api/placeholder/32/32" alt="Kulinarasa Logo" className="h-8 w-8 object-contain" />
        <span className="text-2xl font-extrabold text-orange-500 font-sans">
          Kulinarasa
        </span>
      </div>
      <div className="space-x-4 flex items-center">
        <div className="relative">
          <button
            onClick={(e) => {
              e.preventDefault();
              setShowSearch(!showSearch);
              if (showSearch && searchQuery.trim()) {
                handleSearch(e);
              }
            }}
            className="text-gray-700 hover:text-white hover:bg-orange-500 rounded-2xl p-2 bg-white"
            aria-label="Search"
          >
            {isSearching ? (
              <div className="w-5 h-5 border-t-2 border-orange-500 rounded-full animate-spin"></div>
            ) : (
              <Search className="w-5 h-5" />
            )}
          </button>

          <div
            className={`absolute right-0 top-full mt-2 transition-all duration-300 ease-in-out ${
              showSearch ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
            }`}
          >
            <div className="flex items-center">
              <input
                type="text"
                placeholder="Search recipes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyPress}
                className="w-64 px-4 py-2 border border-gray-300 rounded-l-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white placeholder-gray-500 text-black"
                autoFocus={showSearch}
              />
              <button 
                onClick={handleSearch}
                className="px-4 py-2 bg-orange-500 text-white rounded-r-lg hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                Search
              </button>
            </div>
          </div>
        </div>

        <a href="/home" className="text-gray-700 hover:text-white hover:bg-orange-500 rounded-2xl p-2">
          <Home className="w-5 h-5" />
        </a>
        <a href="/add" className="text-gray-700 hover:text-white hover:bg-orange-500 rounded-2xl p-2">
          <PlusCircle className="w-5 h-5" />
        </a>
        <a href="/saved" className="text-gray-700 hover:text-white hover:bg-orange-500 rounded-2xl p-2">
          <Bookmark className="w-5 h-5" />
        </a>
        <button 
          onClick={handleProfileClick}
          className="flex items-center space-x-2 text-gray-700 hover:text-white bg-transparent hover:bg-orange-500 rounded-2xl px-3 py-2"
        >
          <User className="w-5 h-5" />
          {userName && <span className="text-sm font-medium">{userName}</span>}
        </button>   
        <a href="/" className="text-gray-700 hover:text-white hover:bg-orange-500 rounded-2xl p-2">
          <LogOut className="w-5 h-5" />
        </a>
      </div>
    </nav>
  )
}

export default Navbar