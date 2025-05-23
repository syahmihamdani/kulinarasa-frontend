import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Home, Search, PlusCircle, Bookmark, LogOut, Loader2 } from "lucide-react";
import Navbar from './elements/Navbar'

export default function HomePage() {
  const [recipes, setRecipes] = useState([])
  const [showSearch, setShowSearch] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    setIsLoading(true)
    setError(null)
    
    fetch('https://kulinarasa-backend.vercel.app/recipe/public')
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`)
        }
        return res.json()
      })
      .then(data => {
        console.log("Fetched data:", data);
        if (data.success && Array.isArray(data.payload)) {
          setRecipes(data.payload)
        } else {
          console.error("Invalid response format:", data)
          setError("Invalid response format")
        }
      })
      .catch(err => {
        console.error('Error fetching recipes', err)
        setError('Failed to load recipes. Please try again later.')
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [])

  const handleRecipeClick = (recipeId) => {
    navigate(`/recipe/${recipeId}`)
  }

  const LoadingSkeleton = () => (
    <div className="bg-white rounded-lg shadow p-4 animate-pulse">
      <div className="h-40 w-full bg-gray-200 rounded mb-4"></div>
      <div className="h-6 bg-gray-200 rounded mb-2"></div>
      <div className="h-4 bg-gray-200 rounded mb-2"></div>
      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <h1 className='text-black text-left pl-8 my-5 font-kulinarasa text-4xl'>Public Recipes</h1>
      
      <div className="p-6 pt-1">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {/* Show 6 skeleton cards while loading */}
            {Array.from({ length: 6 }).map((_, index) => (
              <LoadingSkeleton key={index} />
            ))}
          </div>
        ) : error ? (
          <div className="text-center col-span-full">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
              <p className="text-red-600 mb-4">{error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
              >
                Try Again
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {recipes.length === 0 ? (
              <div className="text-center col-span-full">
                <p className="text-gray-500 text-lg">No public recipes available.</p>
              </div>
            ) : (
              recipes.map(recipe => (
                <div 
                  key={recipe.id} 
                  className="bg-white rounded-lg shadow p-4 hover:shadow-md transition cursor-pointer"
                  onClick={() => handleRecipeClick(recipe.id)}
                >
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
        )}
      </div>
    </div>
  )
}