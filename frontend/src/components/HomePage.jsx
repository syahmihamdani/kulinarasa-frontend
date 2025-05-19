import { useEffect, useState } from 'react'
import { Home, Search, PlusCircle, Bookmark, LogOut } from "lucide-react";

export default function HomePage() {
  const [recipes, setRecipes] = useState([])
  const [showSearch, setShowSearch] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    fetch('http://localhost:3000/recipe/public')
      .then(res => res.json())
      .then(data => {
        console.log("Fetched data:", data);
        if (data.success && Array.isArray(data.payload)) {
          setRecipes(data.payload)
        } else {
          console.error("Invalid response format:", data)
        }
      })
      .catch(err => console.error('Error fetching recipes', err))
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-kulinarasa-orange">Kulinarasa</h1>
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



      <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {recipes.length === 0 ? (
          <p className="text-center col-span-full text-gray-500">No public recipes available.</p>
        ) : (
          recipes.map(recipe => (
            <div key={recipe.id} className="bg-white rounded-lg shadow p-4 hover:shadow-md transition">
              <img
                src={recipe.image_url || '/placeholder.jpg'}
                alt={recipe.name}
                className="h-40 w-full object-cover rounded"
              />
              <h3 className="mt-2 text-xl text-kulinarasa-darkblue font-semibold">{recipe.name}</h3>
              <p className="text-sm text-gray-600">{recipe.caption?.slice(0, 100)}...</p>
              <p className="text-xs text-gray-400 mt-2">by {recipe.author_name}</p>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
