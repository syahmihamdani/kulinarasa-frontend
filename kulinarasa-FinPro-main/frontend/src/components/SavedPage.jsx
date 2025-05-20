import { useEffect, useState } from 'react'
import Navbar from './elements/Navbar'
import RecipeDetailModal from './RecipeDetailModal';
import { useNavigate } from 'react-router-dom';

export default function SavedPage() {
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (!user) {
      navigate('/login');
      return;
    }

    // Fetch saved recipes (akan diimplementasikan nanti)
    fetchSavedRecipes();
  }, [navigate]);

  const fetchSavedRecipes = async () => {
    const user = JSON.parse(localStorage.getItem('user'));
    try {
      const response = await fetch(`http://localhost:3000/recipe/saved/${user.id}`, {
        headers: {
          'Authorization': localStorage.getItem('user')
        }
      });
      const data = await response.json();
      if (data.success) {
        setSavedRecipes(data.payload);
      }
    } catch (error) {
      console.error('Error fetching saved recipes:', error);
    }
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold text-kulinarasa-darkblue mb-6">Saved Recipes</h1>
        
        {savedRecipes.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No saved recipes yet.</p>
            <a 
              href="/home" 
              className="mt-4 inline-block px-6 py-2 bg-kulinarasa-orange text-white rounded-lg hover:bg-kulinarasa-brown"
            >
              Explore Recipes
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {savedRecipes.map(recipe => (
              <div 
                key={recipe.id} 
                className="bg-white rounded-lg shadow p-4 hover:shadow-md transition flex flex-col h-[400px] cursor-pointer"
                onClick={() => handleRecipeClick(recipe.id)}
              >
                <div className="aspect-w-16 aspect-h-9 mb-4">
                  <img
                    src={recipe.image_url || '/placeholder.jpg'}
                    alt={recipe.name}
                    className="h-48 w-full object-cover rounded"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl text-kulinarasa-darkblue font-semibold">{recipe.name}</h3>
                  <p className="text-sm text-gray-600 line-clamp-3">{recipe.caption}</p>
                  <p className="text-xs text-gray-400 mt-2">by {recipe.author_name}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedRecipe && (
        <RecipeDetailModal 
          recipe={selectedRecipe} 
          onClose={() => setSelectedRecipe(null)} 
        />
      )}
    </div>
  );
}