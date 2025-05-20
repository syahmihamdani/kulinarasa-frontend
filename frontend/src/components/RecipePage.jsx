import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Clock, Users, ChevronLeft, Bookmark, Share2 } from 'lucide-react'
import Navbar from './elements/Navbar'

export default function RecipePage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [recipe, setRecipe] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    setLoading(true)
    fetch(`http://localhost:3000/recipe/${id}`)
      .then(res => {
        if (!res.ok) {
          throw new Error('Recipe not found')
        }
        return res.json()
      })
      .then(data => {
        console.log("Fetched recipe:", data)
        if (data.success && data.payload) {
          setRecipe(data.payload)
        } else {
          setError('Invalid data format received')
        }
        setLoading(false)
      })
      .catch(err => {
        console.error('Error fetching recipe:', err)
        setError(err.message || 'Failed to load recipe')
        setLoading(false)
      })
  }, [id])

  const handleGoBack = () => {
    navigate(-1) // Go back to previous page
  }

  // Helper function to format ingredients as an array even if it's a string
  const getIngredientsArray = () => {
    if (Array.isArray(recipe.ingredients)) {
      return recipe.ingredients;
    } else if (typeof recipe.ingredients === 'string') {
      // Split string by newlines to create array
      return recipe.ingredients.split('\n').filter(line => line.trim() !== '');
    }
    return [];
  }

  // Helper function to format procedure steps as an array even if it's a string
  const getProcedureArray = () => {
    if (Array.isArray(recipe.procedure)) {
      return recipe.procedure;
    } else if (typeof recipe.procedure === 'string') {
      // Split string by newlines to create array
      return recipe.procedure.split('\n').filter(line => line.trim() !== '');
    }
    return [];
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="p-6 flex justify-center items-center">
          <p className="text-xl text-gray-600">Loading recipe...</p>
        </div>
      </div>
    )
  }

  if (error || !recipe) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="p-6">
          <button 
            onClick={handleGoBack}
            className="flex items-center text-kulinarasa-darkblue mb-4"
          >
            <ChevronLeft size={20} />
            <span>Back</span>
          </button>
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <p className="text-red-500 text-lg">{error || 'Recipe not found'}</p>
            <button 
              onClick={handleGoBack}
              className="mt-4 bg-kulinarasa-darkblue text-white px-4 py-2 rounded"
            >
              Return to recipes
            </button>
          </div>
        </div>
      </div>
    )
  }

  const ingredientsArray = getIngredientsArray();
  const procedureArray = getProcedureArray();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto p-6">
        <button 
          onClick={handleGoBack}
          className="flex items-center text-white mb-4"
        >
          <ChevronLeft size={20} />
          <span className='text-white'>Back to recipes</span>
        </button>

        {/* Recipe Header */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="relative">
            <img 
              src={recipe.image_url || '/placeholder.jpg'} 
              alt={recipe.name}
              className="w-full h-64 object-cover"
              onError={(e) => {
                console.log(`Image failed to load:`, recipe.image_url);
                e.target.src = '/placeholder.jpg';
              }}
            />
            <div className="absolute top-4 right-4 flex gap-2">
              <button className="bg-white p-2 rounded-full shadow">
                <Bookmark size={20} className="text-kulinarasa-darkblue" />
              </button>
              <button className="bg-white p-2 rounded-full shadow">
                <Share2 size={20} className="text-kulinarasa-darkblue" />
              </button>
            </div>
          </div>

          <div className="p-6">
            {/* Name */}
            <div className="flex justify-between items-start">
              <h1 className="text-3xl font-bold text-kulinarasa-darkblue font-kulinarasa">{recipe.name}</h1>
              <div className="flex flex-col items-end">
                <div className="text-sm px-2 py-1 rounded bg-kulinarasa-lightblue bg-opacity-20 text-kulinarasa-darkblue">
                  {recipe.is_public ? 'Public Recipe' : 'Private Recipe'}
                </div>
              </div>
            </div>
            
            {/* Caption */}
            <p className="mt-5 text-gray-700">{recipe.caption}</p>
            
            {/* Author and Food Type */}
            <div className="flex flex-wrap justify-between mt-4">
              <div className="text-sm text-gray-600">
                <span className="font-semibold">Author ID:</span> {recipe.author_id}
              </div>
              {recipe.food_type && (
                <div className="text-sm text-kulinarasa-orange bg-gray-100 px-3 py-1 rounded-full">
                  {recipe.food_type}
                </div>
              )}
            </div>
            
            {/* Divider */}
            <div className="border-t border-gray-200 my-6"></div>

            {/* Two-column layout for Ingredients and Procedure */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column - Ingredients */}
              <div className="mt-4">
                <h2 className="text-xl font-semibold text-kulinarasa-darkblue mb-4">Ingredients</h2>
                <div className="bg-gray-50 p-4 rounded-lg h-full">
                  {ingredientsArray.length > 0 ? (
                    <ul className="space-y-2">
                      {ingredientsArray.map((ingredient, index) => (
                        <li key={index} className="flex items-start">
                          <span className="inline-block w-6 text-center mr-2 text-kulinarasa-darkblue font-medium">
                            {index + 1}.
                          </span>
                          <span className="text-black">{ingredient}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500">No ingredients information available</p>
                  )}
                </div>
              </div>

              {/* Right Column - Procedure */}
              <div className="mt-4">
                <h2 className="text-xl font-semibold text-kulinarasa-darkblue mb-4">Procedure</h2>
                <div className="bg-gray-50 p-4 rounded-lg h-full">
                  {procedureArray.length > 0 ? (
                    <ol className="space-y-4">
                      {procedureArray.map((step, index) => (
                        <li key={index} className="flex">
                          <span className="inline-block w-6 text-center mr-2 font-bold text-kulinarasa-darkblue">
                            {index + 1}.
                          </span>
                          <span className="text-black">{step}</span>
                        </li>
                      ))}
                    </ol>
                  ) : (
                    <p className="text-gray-500">No procedure information available</p>
                  )}
                </div>
              </div>
            </div>

            {/* Recipe Details */}
            <div className="mt-20 bg-kulinarasa-lightblue bg-opacity-10 p-4 rounded-lg">
              <h2 className="text-lg font-semibold text-kulinarasa-darkblue mb-2">Recipe Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-4 text-sm text-black">
                <div>
                  <span className="font-medium">ID:</span> {recipe.id}
                </div>
                <div>
                  <span className="font-medium">Author ID:</span> {recipe.author_id}
                </div>
                <div>
                  <span className="font-medium">Food Type:</span> {recipe.food_type || 'N/A'}
                </div>
                <div>
                  <span className="font-medium">Public:</span> {recipe.is_public ? 'Yes' : 'No'}
                </div>
                <div className="col-span-2">
                  <span className="font-medium">Image URL:</span> 
                  <span className="text-xs break-all">
                    {recipe.image_url || 'No image URL'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}