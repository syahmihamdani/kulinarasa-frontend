import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, StarHalf, User, Book, MessageSquare } from 'lucide-react';
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
        const userResponse = await fetch(`http://localhost:3000/user/${id}`);
        if (!userResponse.ok) {
          throw new Error('Failed to fetch user data');
        }
        const userData = await userResponse.json();
        setUser(userData.success && userData.payload ? userData.payload : userData);

        // Fetch user reviews
        const reviewsResponse = await fetch(`http://localhost:3000/review/byuser/${id}`);
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

        // Note: There's no API endpoint yet for user recipes
        // This is where you would fetch user recipes in the future
        setRecipes([]);
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
          className={`px-6 py-3 text-lg font-medium${
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
          className={`px-6 py-3 text-lg font-medium${
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
                      {review.created_at && new Date(review.created_at).toLocaleDateString()}
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
        </div>
      )}
    </div>
  );
};

export default ProfilePage;