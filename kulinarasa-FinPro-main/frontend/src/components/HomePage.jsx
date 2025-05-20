import { useEffect, useState } from 'react'
import { Plus, MessageSquare, Bookmark } from "lucide-react";
import Navbar from './elements/Navbar'
import { useNavigate } from 'react-router-dom';
import RecipeDetailModal from './RecipeDetailModal';

export default function HomePage() {
  const [recipes, setRecipes] = useState([])
  const [showSearch, setShowSearch] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedRecipe, setSelectedRecipe] = useState(null)
  const [isSaved, setIsSaved] = useState({});
  const navigate = useNavigate();

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

  const handleAddRecipe = () => {
    const user = localStorage.getItem('user');
    if (!user) {
      navigate('/login');
      return;
    }
    navigate('/add');
  };

  const handleRecipeClick = async (recipeId) => {
    try {
      const response = await fetch(`http://localhost:3000/recipe/${recipeId}`);
      const data = await response.json();
      if (data.success) {
        setSelectedRecipe(data.payload);
      }
    } catch (error) {
      console.error('Error fetching recipe details:', error);
    }
  };

  const handleSaveRecipe = async (e, recipeId) => {
    e.stopPropagation(); // Prevent triggering recipe click
    const user = localStorage.getItem('user');
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/recipe/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': user
        },
        body: JSON.stringify({ recipeId })
      });

      const data = await response.json();
      if (data.success) {
        setIsSaved(prev => ({
          ...prev,
          [recipeId]: !prev[recipeId]
        }));
      }
    } catch (error) {
      console.error('Error saving recipe:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {/* Add Recipe Button Card */}
          <button 
            onClick={handleAddRecipe}
            className="bg-white rounded-lg shadow p-4 hover:shadow-md transition flex flex-col h-[400px] items-center justify-center group hover:bg-kulinarasa-orange/10"
          >
            <div className="rounded-full bg-kulinarasa-orange/20 p-6 group-hover:bg-kulinarasa-orange/30">
              <Plus className="w-12 h-12 text-kulinarasa-orange" />
            </div>
            <p className="text-xl font-semibold text-kulinarasa-orange mt-4">Add New Recipe</p>
          </button>

          {/* Existing Recipe Cards */}
          {recipes.length === 0 ? (
            <p className="text-center col-span-full text-gray-500">No public recipes available.</p>
          ) : (
            recipes.map(recipe => (
              <div 
                key={recipe.id} 
                className="bg-white rounded-lg shadow p-4 hover:shadow-md transition flex flex-col h-[400px]"
              >
                {/* Content Area */}
                <div 
                  className="cursor-pointer flex-1"
                  onClick={() => handleRecipeClick(recipe.id)}
                >
                  <div className="aspect-w-16 aspect-h-9 mb-4">
                    <img
                      src={recipe.image_url || '/placeholder.jpg'}
                      alt={recipe.name}
                      className="h-48 w-full object-cover rounded"
                    />
                  </div>
                  <div>
                    <h3 className="text-xl text-kulinarasa-darkblue font-semibold">{recipe.name}</h3>
                    <p className="text-sm text-gray-600 line-clamp-3">{recipe.caption}</p>
                    <p className="text-xs text-gray-400 mt-2">by {recipe.author_name}</p>
                  </div>
                </div>

                {/* Action Buttons - Now consistently at bottom */}
                <div className="flex justify-between items-center mt-auto pt-4 border-t">
                  {/* Discussion Button */}
                  <button 
                    className="flex items-center gap-1 text-sm bg-kulinarasa-orange text-white px-4 py-2 rounded-lg hover:bg-kulinarasa-brown transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      // Handle discussion click
                    }}
                  >
                    <MessageSquare size={16} />
                    Discussion
                  </button>

                  {/* Save Button */}
                  <button 
                    className={`flex items-center gap-1 text-sm px-4 py-2 rounded-lg transition-colors ${
                      isSaved[recipe.id] 
                        ? 'bg-kulinarasa-brown text-white' 
                        : 'bg-kulinarasa-orange text-white hover:bg-kulinarasa-brown'
                    }`}
                    onClick={(e) => handleSaveRecipe(e, recipe.id)}
                  >
                    <Bookmark size={16} className={isSaved[recipe.id] ? 'fill-current' : ''} />
                    {isSaved[recipe.id] ? 'Saved' : 'Save'}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Recipe Detail Modal */}
      {selectedRecipe && (
        <RecipeDetailModal 
          recipe={selectedRecipe} 
          onClose={() => setSelectedRecipe(null)} 
        />
      )}
    </div>
  )
}
