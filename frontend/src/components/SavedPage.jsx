import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Clock, Users, Bookmark, BookmarkCheck, Trash2, Search, Filter } from 'lucide-react'
import Navbar from './elements/Navbar'

export default function SavedPage() {
  const navigate = useNavigate()
  const [savedRecipes, setSavedRecipes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [currentUserId, setCurrentUserId] = useState(null)

  // Get current user ID from localStorage
  useEffect(() => {
    try {
      const userData = localStorage.getItem('user')
      if (userData) {
        const user = JSON.parse(userData)
        setCurrentUserId(user.id)
      } else {
        // Redirect to login if no user found
        navigate('/login')
        return
      }
    } catch (error) {
      console.error('Error parsing user data from localStorage:', error)
      navigate('/login')
      return
    }
  }, [navigate])

  // Load saved recipes from localStorage
  useEffect(() => {
    if (!currentUserId) return

    setLoading(true)
    try {
      const savedRecipesData = localStorage.getItem(`savedRecipes_${currentUserId}`)
      if (savedRecipesData) {
        const savedRecipeIds = JSON.parse(savedRecipesData)
        // Fetch recipe details for each saved recipe ID
        fetchSavedRecipes(savedRecipeIds)
      } else {
        setSavedRecipes([])
        setLoading(false)
      }
    } catch (error) {
      console.error('Error loading saved recipes:', error)
      setError('Failed to load saved recipes')
      setLoading(false)
    }
  }, [currentUserId])

  // Fetch recipe details for saved recipe IDs
  const fetchSavedRecipes = async (recipeIds) => {
    if (recipeIds.length === 0) {
      setSavedRecipes([])
      setLoading(false)
      return
    }

    try {
      const recipePromises = recipeIds.map(id =>
        fetch(`https://kulinarasa-backend.vercel.app/recipe/${id}`)
          .then(res => {
            if (!res.ok) throw new Error(`Recipe ${id} not found`)
            return res.json()
          })
          .then(data => {
            if (data.success && data.payload) {
              return { ...data.payload, savedAt: new Date().toISOString() }
            }
            throw new Error(`Invalid data for recipe ${id}`)
          })
          .catch(err => {
            console.error(`Error fetching recipe ${id}:`, err)
            return null // Return null for failed requests
          })
      )

      const recipes = await Promise.all(recipePromises)
      // Filter out null values (failed requests)
      const validRecipes = recipes.filter(recipe => recipe !== null)
      
      setSavedRecipes(validRecipes)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching saved recipes:', error)
      setError('Failed to load some saved recipes')
      setLoading(false)
    }
  }

  // Remove recipe from saved list
  const handleUnsaveRecipe = (recipeId) => {
    try {
      const savedRecipesData = localStorage.getItem(`savedRecipes_${currentUserId}`)
      if (savedRecipesData) {
        const savedRecipeIds = JSON.parse(savedRecipesData)
        const updatedIds = savedRecipeIds.filter(id => id !== recipeId)
        localStorage.setItem(`savedRecipes_${currentUserId}`, JSON.stringify(updatedIds))
        
        // Update local state
        setSavedRecipes(prev => prev.filter(recipe => recipe.id !== recipeId))
      }
    } catch (error) {
      console.error('Error removing saved recipe:', error)
    }
  }

  // Navigate to recipe detail page
  const handleViewRecipe = (recipeId) => {
    navigate(`/recipe/${recipeId}`)
  }

  // Filter recipes based on search term and filter type
  const filteredRecipes = savedRecipes.filter(recipe => {
    const matchesSearch = recipe.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         recipe.caption?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesFilter = filterType === 'all' || 
                         recipe.food_type?.toLowerCase() === filterType.toLowerCase()
    
    return matchesSearch && matchesFilter
  })

  // Get unique food types for filter dropdown
  const foodTypes = [...new Set(savedRecipes.map(recipe => recipe.food_type).filter(Boolean))]

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-6xl mx-auto p-6">
          <div className="flex justify-center items-center py-12">
            <p className="text-xl text-gray-600">Loading saved recipes...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-6xl mx-auto p-6">
          <h1 className="text-3xl font-bold text-kulinarasa-darkblue mb-6 font-kulinarasa">Saved Recipes</h1>
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <p className="text-red-500 text-lg">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-4 bg-kulinarasa-darkblue text-white px-4 py-2 rounded hover:bg-opacity-90"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl text-kulinarasa-darkblue font-kulinarasa">Saved Recipes</h1>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <BookmarkCheck size={16} />
            <span>{savedRecipes.length} {savedRecipes.length === 1 ? 'recipe' : 'recipes'} saved</span>
          </div>
        </div>

        {/* Search and Filter */}
        {savedRecipes.length > 0 && (
          <div className="bg-white rounded-lg shadow p-4 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search Input */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search saved recipes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-kulinarasa-darkblue focus:border-kulinarasa-darkblue bg-white text-black"
                />
              </div>
              
              {/* Filter Dropdown */}
              {foodTypes.length > 0 && (
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="pl-10 pr-8 py-2 border border-gray-300 rounded-md focus:ring-kulinarasa-darkblue focus:border-kulinarasa-darkblue bg-white text-black"
                  >
                    <option value="all">All Types</option>
                    {foodTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Recipes Grid */}
        {savedRecipes.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <Bookmark size={48} className="mx-auto text-gray-300 mb-4" />
            <h2 className="text-xl font-semibold text-gray-700 mb-2">No Saved Recipes Yet</h2>
            <p className="text-gray-500 mb-6">
              Start exploring recipes and save your favorites to see them here!
            </p>
            <button
              onClick={() => navigate('/home')}
              className="bg-kulinarasa-darkblue text-white px-6 py-2 rounded hover:bg-opacity-90"
            >
              Browse Recipes
            </button>
          </div>
        ) : filteredRecipes.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <Search size={48} className="mx-auto text-gray-300 mb-4" />
            <h2 className="text-xl font-semibold text-gray-700 mb-2">No Recipes Found</h2>
            <p className="text-gray-500">
              Try adjusting your search terms or filters.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRecipes.map((recipe) => (
              <div key={recipe.id} className="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition-shadow">
                {/* Recipe Image */}
                <div className="relative">
                  <img
                    src={recipe.image_url || '/placeholder.jpg'}
                    alt={recipe.name}
                    className="w-full h-48 object-cover cursor-pointer"
                    onClick={() => handleViewRecipe(recipe.id)}
                    onError={(e) => {
                      e.target.src = '/placeholder.jpg'
                    }}
                  />
                  
                  {/* Unsave Button */}
                  <button
                    onClick={() => handleUnsaveRecipe(recipe.id)}
                    className="absolute top-3 right-3 bg-white p-2 rounded-full shadow hover:bg-red-50 transition-colors"
                    title="Remove from saved"
                  >
                    <Trash2 size={16} className="text-red-500" />
                  </button>

                  {/* Recipe Type Badge */}
                  {recipe.food_type && (
                    <div className="absolute top-3 left-3 bg-kulinarasa-orange text-white text-xs px-2 py-1 rounded-full">
                      {recipe.food_type}
                    </div>
                  )}
                </div>

                {/* Recipe Info */}
                <div className="p-4">
                  <h3 
                    className="font-semibold text-kulinarasa-darkblue mb-2 cursor-pointer hover:text-opacity-80 line-clamp-2"
                    onClick={() => handleViewRecipe(recipe.id)}
                  >
                    {recipe.name}
                  </h3>
                  
                  {recipe.caption && (
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {recipe.caption}
                    </p>
                  )}

                  {/* Recipe Meta */}
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center gap-3">
                      {recipe.prep_time && (
                        <div className="flex items-center gap-1">
                          <Clock size={12} />
                          <span>{recipe.prep_time}min</span>
                        </div>
                      )}
                      {recipe.servings && (
                        <div className="flex items-center gap-1">
                          <Users size={12} />
                          <span>{recipe.servings}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <BookmarkCheck size={12} className="text-kulinarasa-darkblue" />
                      <span>Saved</span>
                    </div>
                  </div>

                  {/* View Recipe Button */}
                  <button
                    onClick={() => handleViewRecipe(recipe.id)}
                    className="w-full mt-4 bg-kulinarasa-darkblue text-white py-2 rounded hover:bg-opacity-90 transition-colors"
                  >
                    View Recipe
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}