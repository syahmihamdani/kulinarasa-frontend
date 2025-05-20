import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, StarHalf, User, Book, MessageSquare, Clock } from 'lucide-react';
import Navbar from './elements/Navbar';

const ProfilePage = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('reviews');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        // Fetch user data
        const userResponse = await fetch(`https://kulinarasa-backend.vercel.app/user/${id}`);
        if (!userResponse.ok) {
          throw new Error('Failed to fetch user data');
        }
        const userData = await userResponse.json();
        setUser(userData.success && userData.payload ? userData.payload : userData);

        // Fetch user reviews
        const reviewsResponse = await fetch(`https://kulinarasa-backend.vercel.app/review/byuser/${id}`);
        if (!reviewsResponse.ok) {
          throw new Error('Failed to fetch user reviews');
        }
        const reviewsData = await reviewsResponse.json();
        
        // Handle different response formats
        if (reviewsData.success && Array.isArray(reviewsData.payload)) {
          setReviews(reviewsData.payload);
        } else if (Array.isArray(reviewsData)) {
          setReviews(reviewsData);
        } else if (reviewsData && typeof reviewsData === 'object') {
          setReviews(reviewsData.reviews || Object.values(reviewsData) || []);
        } else {
          setReviews([]);
        }

        // Fetch user recipes
        const recipesResponse = await fetch(`https://kulinarasa-backend.vercel.app/recipe/byuser/${id}`);
        if (!recipesResponse.ok) {
          throw new Error('Failed to fetch user recipes');
        }
        const recipesData = await recipesResponse.json();
        
        // Handle different response formats for recipes
        if (recipesData.success && Array.isArray(recipesData.payload)) {
          setRecipes(recipesData.payload);
        } else if (Array.isArray(recipesData)) {
          setRecipes(recipesData);
        } else if (recipesData && typeof recipesData === 'object') {
          setRecipes(recipesData.recipes || Object.values(recipesData) || []);
        } else {
          setRecipes([]);
        }
      } catch (err) {
        setError(err.message);
        setReviews([]);
        setRecipes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [id]);

  // Render star rating similar to RecipePage
  const renderStars = (rating) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 >= 0.5
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`star-${i}`} className="w-4 h-4 fill-yellow-400 text-yellow-400" />)
    }
    
    if (hasHalfStar) {
      stars.push(<StarHalf key="half-star" className="w-4 h-4 fill-yellow-400 text-yellow-400" />)
    }
    
    const emptyStars = 5 - stars.length
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="w-4 h-4 text-gray-300" />)
    }
    
    return stars
  }

  // Format date helper
  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString();
  };

  // Truncate text helper
  const truncateText = (text, maxLength = 100) => {
    if (!text || text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl font-semibold text-kulinarasa-darkblue">Loading profile...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 my-4">
        <p className="text-red-600">{error}</p>
        <p className="mt-2">Please try again later or contact support.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      {/* User Profile Section - Centered with profile pic on top */}
      <div className="bg-white shadow rounded-lg mb-6 mt-6 p-6">
        <div className="flex flex-col items-center text-center">
          <div className="bg-kulinarasa-lightblue rounded-full w-24 h-24 flex items-center justify-center mb-4">
            <User size={40} className="text-kulinarasa-darkblue" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-kulinarasa-darkblue">{user?.name}</h1>
            <p className="text-gray-600">{user?.email}</p>
            <p className="text-sm text-gray-500 mt-2">User ID: {user?.id}</p>
          </div>
        </div>
      </div>

      {/* Centered Tabs Navigation with underline only for active */}
      <div className="flex justify-center mb-6 text-black">
        <button
          onClick={() => setActiveTab('reviews')}
          className={`px-6 py-3 text-lg font-medium ${
            activeTab === 'reviews'
              ? 'text-black bg-transparent underline underline-offset-8'
              : 'text-black bg-transparent'
          }`}
        >
          <div className="flex items-center">
            <MessageSquare size={18} className="mr-2" />
            Reviews ({Array.isArray(reviews) ? reviews.length : 0})
          </div>
        </button>
        <button
          onClick={() => setActiveTab('recipes')}
          className={`px-6 py-3 text-lg font-medium ${
            activeTab === 'recipes'
              ? 'text-black bg-transparent underline underline-offset-8'
              : 'text-black bg-transparent'
          }`}
        >
          <div className="flex items-center">
            <Book size={18} className="mr-2" />
            Recipes ({Array.isArray(recipes) ? recipes.length : 0})
          </div>
        </button>
      </div>

      {/* Content based on active tab */}
      {activeTab === 'reviews' ? (
        <div className="bg-white shadow rounded-lg p-6 max-w-4xl mx-auto">
          <h2 className="text-xl font-semibold mb-4 text-kulinarasa-darkblue font-kulinarasa text-left">User Reviews</h2>

          {!Array.isArray(reviews) || reviews.length === 0 ? (
            <p className="text-gray-500 py-4 text-center">No reviews yet.</p>
          ) : (
            <div className="space-y-4">
              {reviews.map((review, index) => (
                <div 
                  key={index} 
                  className="bg-gray-50 p-4 rounded-lg shadow mb-4"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center">
                      <div className="flex mr-2">
                        {renderStars(review.rating)}
                      </div>
                      <Link to={`/recipe/${review.recipe_id}`} className="text-sm text-kulinarasa-darkblue hover:underline">
                        Recipe #{review.recipe_id}
                      </Link>
                    </div>
                    <p className="text-xs text-gray-400">
                      {formatDate(review.created_at)}
                    </p>
                  </div>
                  <p className="text-gray-800 text-left">{review.review_text}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white shadow rounded-lg p-6 max-w-4xl mx-auto">
          <h2 className="text-xl font-semibold mb-4 text-kulinarasa-darkblue font-kulinarasa text-left">User Recipes</h2>
          
          {!Array.isArray(recipes) || recipes.length === 0 ? (
            <p className="text-gray-500 py-4 text-center">No recipes yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {recipes.map((recipe, index) => (
                <Link 
                  to={`/recipe/${recipe.id}`} 
                  key={index}
                  className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="relative h-48 bg-gray-200">
                    {recipe.image_url ? (
                      <img 
                        src={recipe.image_url} 
                        alt={recipe.name} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full bg-kulinarasa-lightblue">
                        <Book size={48} className="text-kulinarasa-darkblue" />
                      </div>
                    )}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                      <h3 className="text-white font-semibold text-lg">{recipe.name}</h3>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <span className="bg-kulinarasa-lightblue text-kulinarasa-darkblue px-2 py-1 rounded text-xs">
                          {recipe.food_type || 'Other'}
                        </span>
                      </div>
                      <div className="flex items-center text-gray-500 text-xs">
                        <Clock size={14} className="mr-1" />
                        {formatDate(recipe.created_at)}
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm mb-3">
                      {truncateText(recipe.caption, 80)}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        {recipe.average_rating ? (
                          <div className="flex items-center">
                            <div className="flex">
                              {renderStars(recipe.average_rating)}
                            </div>
                            <span className="ml-1 text-sm text-gray-600">
                              ({recipe.total_reviews || 0})
                            </span>
                          </div>
                        ) : (
                          <span className="text-xs text-gray-500">No ratings yet</span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProfilePage;