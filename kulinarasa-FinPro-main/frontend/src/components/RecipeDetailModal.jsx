import { X } from "lucide-react";

export default function RecipeDetailModal({ recipe, onClose }) {
  if (!recipe) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header with close button */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-2xl font-bold text-kulinarasa-darkblue">{recipe.name}</h2>
          <button 
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Image */}
          <div className="mb-6">
            <img
              src={recipe.image_url || '/placeholder.jpg'}
              alt={recipe.name}
              className="w-full h-64 object-cover rounded-lg"
            />
          </div>

          {/* Recipe Info */}
          <div className="space-y-6">
            {/* Author and Type */}
            <div className="flex justify-between items-center">
              <p className="text-gray-600">by {recipe.author_name}</p>
              <span className="bg-kulinarasa-orange/10 text-kulinarasa-orange px-3 py-1 rounded-full text-sm">
                {recipe.food_type}
              </span>
            </div>

            {/* Caption */}
            <div>
              <h3 className="text-lg font-semibold mb-2">Description</h3>
              <p className="text-gray-600">{recipe.caption}</p>
            </div>

            {/* Ingredients */}
            <div>
              <h3 className="text-lg font-semibold mb-2">Ingredients</h3>
              <ul className="list-disc list-inside text-gray-600">
                {recipe.ingredients?.split('\n').map((ingredient, index) => (
                  <li key={index}>{ingredient}</li>
                ))}
              </ul>
            </div>

            {/* Procedure */}
            <div>
              <h3 className="text-lg font-semibold mb-2">Instructions</h3>
              <ol className="list-decimal list-inside text-gray-600">
                {recipe.procedure?.split('\n').map((step, index) => (
                  <li key={index} className="mb-2">{step}</li>
                ))}
              </ol>
            </div>

            {/* Rating */}
            {recipe.average_rating && (
              <div className="flex items-center gap-2">
                <span className="text-lg">⭐</span>
                <span>{Number(recipe.average_rating).toFixed(1)}</span>
                <span className="text-gray-500">({recipe.total_reviews} reviews)</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}