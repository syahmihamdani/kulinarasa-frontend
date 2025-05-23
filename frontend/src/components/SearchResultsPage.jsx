import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Star, Clock, User, Search } from 'lucide-react'
import Navbar from './elements/Navbar'

function SearchResults() {
    const { q } = useParams(); // Get search query from URL params
    const [recipes, setRecipes] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const navigate = useNavigate()

    useEffect(() => {
        if (q) {
            searchRecipes(q)
        } else {
            setLoading(false)
        }
    }, [q])

    const searchRecipes = async (query) => {
        try {
            setLoading(true)
            setError(null)

            const response = await fetch(`https://kulinarasa-backend.vercel.app/recipe/search/${q}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            })

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            const data = await response.json()

            if (data.success) {
                setRecipes(data.payload || [])
            } else {
                setError(data.message || 'Failed to search recipes')
                setRecipes([])
            }
        } catch (err) {
            console.error('Search error:', err)
            setError('An error occurred while searching recipes')
            setRecipes([])
        } finally {
            setLoading(false)
        }
    }

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        })
    }

    const formatRating = (rating) => {
        return rating ? parseFloat(rating).toFixed(1) : '0.0'
    }

    const handleRecipeClick = (recipeId) => {
        navigate(`/recipe/${recipeId}`)
    }

    if (loading) {
        return (
            <div>
                <Navbar />
                <div className="container mx-auto min-h-screen bg-white px-4 py-8">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-kulinarasa-orange mx-auto"></div>
                        <p className="mt-4 text-gray-600">Searching recipes...</p>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className='bg-white'>
            <Navbar />
            <div className="container mx-auto min-h-screen bg-white px-6 py-4">
                <div className="mb-6">
                    <div className="flex items-center space-x-2 mb-2">
                        <Search className="w-5 h-5 text-kulinarasa-orange" />
                        <h1 className="text-2xl text-gray-800 font-kulinarasa">Search Results</h1>
                    </div>
                    <p className="text-gray-600">
                        {q && `Results for "${q}"`}
                        {recipes.length > 0 && ` (${recipes.length} ${recipes.length === 1 ? 'recipe' : 'recipes'} found)`}
                    </p>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                        {error}
                    </div>
                )}

                {recipes.length === 0 && !error && (
                    <div className="text-center py-12">
                        <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h2 className="text-xl font-semibold text-gray-600 mb-2">No recipes found</h2>
                        <p className="text-gray-500">
                            {q ? `No recipes match "${q}". Try different keywords.` : 'Enter a search term to find recipes.'}
                        </p>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {recipes.map((recipe) => (
                        <div
                            key={recipe.id}
                            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                            onClick={() => handleRecipeClick(recipe.id)}
                        >
                            <div className="relative">
                                <img
                                    src={recipe.image_url || '/placeholder-recipe.jpg'}
                                    alt={recipe.name}
                                    className="w-full h-48 object-cover"
                                    onError={(e) => {
                                        e.target.src = '/placeholder-recipe.jpg'
                                    }}
                                />
                                <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded text-xs font-medium text-gray-700">
                                    {recipe.food_type || 'Recipe'}
                                </div>
                            </div>

                            <div className="p-4">
                                <h3 className="font-bold text-lg text-gray-800 mb-2 line-clamp-2">
                                    {recipe.name}
                                </h3>

                                {recipe.caption && (
                                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                                        {recipe.caption}
                                    </p>
                                )}

                                <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                                    <div className="flex items-center space-x-1">
                                        <User className="w-4 h-4" />
                                        <span>{recipe.author_name}</span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                        <Clock className="w-4 h-4" />
                                        <span>{formatDate(recipe.created_at)}</span>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-1">
                                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                        <span className="text-sm font-medium">
                                            {formatRating(recipe.average_rating)}
                                        </span>
                                        <span className="text-xs text-gray-500">
                                            ({recipe.total_reviews} {recipe.total_reviews === '1' ? 'review' : 'reviews'})
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default SearchResults