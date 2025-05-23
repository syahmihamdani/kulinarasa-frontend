import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Clock, Users, ChevronLeft, Bookmark, BookmarkCheck, Share2, Star, StarHalf, Pencil, Trash2, X } from 'lucide-react'
import Navbar from './elements/Navbar'

export default function RecipePage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [recipe, setRecipe] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [reviews, setReviews] = useState([])
  const [newReview, setNewReview] = useState({
    rating: 5,
    review_text: '',
  })
  const [submittingReview, setSubmittingReview] = useState(false)
  const [reviewSuccess, setReviewSuccess] = useState(false)
  const [reviewError, setReviewError] = useState(null)
  const [currentUserId, setCurrentUserId] = useState(null)
  const [editingReviewId, setEditingReviewId] = useState(null)
  const [editReview, setEditReview] = useState({
    id: null,
    rating: 5,
    review_text: '',
  })
  const [deletingReviewId, setDeletingReviewId] = useState(null)
  const [actionLoading, setActionLoading] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [bookmarkLoading, setBookmarkLoading] = useState(false)

  // Get current user ID from localStorage
  useEffect(() => {
    try {
      const userData = localStorage.getItem('user')
      if (userData) {
        const user = JSON.parse(userData)
        setCurrentUserId(user.id) // Assuming the user object has an 'id' field
      }
    } catch (error) {
      console.error('Error parsing user data from localStorage:', error)
    }
  }, [])

  // Check if recipe is bookmarked
  useEffect(() => {
    if (currentUserId && recipe) {
      checkIfBookmarked()
    }
  }, [currentUserId, recipe])

  const checkIfBookmarked = () => {
    try {
      const savedRecipesData = localStorage.getItem(`savedRecipes_${currentUserId}`)
      if (savedRecipesData) {
        const savedRecipeIds = JSON.parse(savedRecipesData)
        setIsBookmarked(savedRecipeIds.includes(recipe.id))
      } else {
        setIsBookmarked(false)
      }
    } catch (error) {
      console.error('Error checking bookmark status:', error)
      setIsBookmarked(false)
    }
  }

  // Handle bookmark/unbookmark
  const handleBookmarkToggle = () => {
    if (!currentUserId) {
      setReviewError('You must be logged in to save recipes.')
      setTimeout(() => setReviewError(null), 3000)
      return
    }

    setBookmarkLoading(true)
    
    try {
      const savedRecipesData = localStorage.getItem(`savedRecipes_${currentUserId}`)
      let savedRecipeIds = savedRecipesData ? JSON.parse(savedRecipesData) : []
      
      if (isBookmarked) {
        // Remove from bookmarks
        savedRecipeIds = savedRecipeIds.filter(recipeId => recipeId !== recipe.id)
        setIsBookmarked(false)
      } else {
        // Add to bookmarks
        if (!savedRecipeIds.includes(recipe.id)) {
          savedRecipeIds.push(recipe.id)
        }
        setIsBookmarked(true)
      }
      
      localStorage.setItem(`savedRecipes_${currentUserId}`, JSON.stringify(savedRecipeIds))
      
      // Show success message
      setReviewSuccess(true)
      setTimeout(() => setReviewSuccess(false), 2000)
      
    } catch (error) {
      console.error('Error toggling bookmark:', error)
      setReviewError('Failed to save recipe. Please try again.')
      setTimeout(() => setReviewError(null), 3000)
    } finally {
      setBookmarkLoading(false)
    }
  }

  // Handle share functionality
  const handleShare = async () => {
    const recipeUrl = window.location.href
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: recipe.name,
          text: recipe.caption || `Check out this recipe: ${recipe.name}`,
          url: recipeUrl,
        })
      } catch (error) {
        console.error('Error sharing:', error)
        fallbackShare(recipeUrl)
      }
    } else {
      fallbackShare(recipeUrl)
    }
  }

  const fallbackShare = (url) => {
    // Copy to clipboard as fallback
    navigator.clipboard.writeText(url).then(() => {
      setReviewSuccess(true)
      setTimeout(() => setReviewSuccess(false), 2000)
    }).catch(() => {
      setReviewError('Failed to copy recipe link')
      setTimeout(() => setReviewError(null), 3000)
    })
  }

  useEffect(() => {
    setLoading(true)
    
    // Fetch recipe details
    fetch(`https://kulinarasa-backend.vercel.app/recipe/${id}`)
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
          // After recipe loads successfully, fetch reviews
          fetchReviews(data.payload.id)
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
  
  // Fetch reviews for this recipe
  const fetchReviews = (recipeId) => {
    fetch(`https://kulinarasa-backend.vercel.app/review/byrecipe/${recipeId}`)
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.payload)) {
          setReviews(data.payload)
        } else {
          console.error("Failed to fetch reviews")
        }
      })
      .catch(err => {
        console.error("Error fetching reviews:", err)
      })
  }

  const handleGoBack = () => {
    navigate('/home') // Go back to previous page
  }

  // Handle review form input changes
  const handleReviewChange = (e) => {
    const { name, value } = e.target
    setNewReview(prev => ({
      ...prev,
      [name]: name === 'rating' ? parseInt(value) : value
    }))
  }

  // Handle edit review form input changes
  const handleEditReviewChange = (e) => {
    const { name, value } = e.target
    setEditReview(prev => ({
      ...prev,
      [name]: name === 'rating' ? parseInt(value) : value
    }))
  }

  // Start editing a review
  const handleStartEdit = (review) => {
    setEditingReviewId(review.id)
    setEditReview({
      id: review.id,
      rating: review.rating,
      review_text: review.review_text
    })
  }

  // Cancel editing a review
  const handleCancelEdit = () => {
    setEditingReviewId(null)
    setEditReview({
      id: null,
      rating: 5,
      review_text: ''
    })
  }

  // Save edited review
  const handleSaveEdit = (e) => {
    e.preventDefault()
    
    setActionLoading(true)
    
    fetch('https://kulinarasa-backend.vercel.app/review/update', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(editReview)
    })
      .then(res => res.json())
      .then(data => {
        setActionLoading(false)
        if (data.success) {
          // Update the review in the local state
          setReviews(prevReviews => 
            prevReviews.map(review => 
              review.id === editReview.id ? { ...review, ...editReview } : review
            )
          )
          setEditingReviewId(null)
          // Show success message temporarily
          setReviewSuccess(true)
          setTimeout(() => setReviewSuccess(false), 3000)
        } else {
          setReviewError(data.message || 'Failed to update review')
          setTimeout(() => setReviewError(null), 3000)
        }
      })
      .catch(err => {
        setActionLoading(false)
        setReviewError('Error updating review. Please try again.')
        setTimeout(() => setReviewError(null), 3000)
        console.error('Error updating review:', err)
      })
  }

  // Confirm delete review
  const handleConfirmDelete = (reviewId) => {
    setDeletingReviewId(reviewId)
  }

  // Cancel delete review
  const handleCancelDelete = () => {
    setDeletingReviewId(null)
  }

  // Delete review
  const handleDeleteReview = (reviewId) => {
    setActionLoading(true)
    
    fetch(`https://kulinarasa-backend.vercel.app/review/delete/${reviewId}`, {
      method: 'DELETE'
    })
      .then(res => res.json())
      .then(data => {
        setActionLoading(false)
        if (data.success) {
          // Remove the deleted review from the local state
          setReviews(prevReviews => prevReviews.filter(review => review.id !== reviewId))
          setDeletingReviewId(null)
          // Show success message temporarily
          setReviewSuccess(true)
          setTimeout(() => setReviewSuccess(false), 3000)
        } else {
          setReviewError(data.message || 'Failed to delete review')
          setTimeout(() => setReviewError(null), 3000)
        }
      })
      .catch(err => {
        setActionLoading(false)
        setReviewError('Error deleting review. Please try again.')
        setTimeout(() => setReviewError(null), 3000)
        console.error('Error deleting review:', err)
      })
  }

  // Submit new review
  const handleSubmitReview = (e) => {
    e.preventDefault()
    
    // Check if user is logged in
    if (!currentUserId) {
      setReviewError('You must be logged in to leave a review.')
      return
    }
    
    setSubmittingReview(true)
    setReviewError(null)
    setReviewSuccess(false)
    
    const reviewData = {
      recipe_id: recipe.id,
      user_id: currentUserId,
      rating: newReview.rating,
      review_text: newReview.review_text
    }
    
    fetch('https://kulinarasa-backend.vercel.app/review/create/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(reviewData)
    })
      .then(res => res.json())
      .then(data => {
        setSubmittingReview(false)
        if (data.success) {
          setReviewSuccess(true)
          setNewReview({ rating: 5, review_text: '' })
          // Refresh reviews
          fetchReviews(recipe.id)
        } else {
          setReviewError(data.message || 'Failed to submit review')
        }
      })
      .catch(err => {
        setSubmittingReview(false)
        setReviewError('Error submitting review. Please try again.')
        console.error('Error submitting review:', err)
      })
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

  // Render star rating
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

  // Check if a review was created by the current user
  const isReviewOwner = (review) => {
    return currentUserId && review.user_id === currentUserId;
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

  // Calculate average rating
  const calculateAverageRating = () => {
    if (!reviews || reviews.length === 0) return 0;
    const sum = reviews.reduce((total, review) => total + review.rating, 0);
    return (sum / reviews.length).toFixed(1);
  }
  
  const averageRating = calculateAverageRating();

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
              <button 
                onClick={handleBookmarkToggle}
                disabled={bookmarkLoading}
                className={`p-2 rounded-full shadow transition-colors ${
                  isBookmarked 
                    ? 'bg-kulinarasa-darkblue text-white' 
                    : 'bg-white text-kulinarasa-darkblue hover:bg-kulinarasa-darkblue hover:text-white'
                } ${bookmarkLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                title={isBookmarked ? 'Remove from saved' : 'Save recipe'}
              >
                {bookmarkLoading ? (
                  <div className="w-5 h-5 border-2 border-current border-t-transparent animate-spin rounded-full"></div>
                ) : isBookmarked ? (
                  <BookmarkCheck size={20} />
                ) : (
                  <Bookmark size={20} />
                )}
              </button>
              <button 
                onClick={handleShare}
                className="bg-white p-2 rounded-full shadow hover:bg-gray-50 transition-colors"
                title="Share recipe"
              >
                <Share2 size={20} className="text-kulinarasa-darkblue" />
              </button>
            </div>
          </div>

          <div className="p-6">
            {/* Name */}
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-kulinarasa-darkblue font-kulinarasa">{recipe.name}</h1>
                {reviews.length > 0 && (
                  <div className="flex items-center mt-1">
                    <div className="flex mr-1">
                      {renderStars(parseFloat(averageRating))}
                    </div>
                    <span className="text-sm text-gray-600">
                      {averageRating} ({reviews.length} {reviews.length === 1 ? 'review' : 'reviews'})
                    </span>
                  </div>
                )}
              </div>
              <div className="flex flex-col items-end">
                <div className="text-sm px-2 py-1 rounded bg-kulinarasa-lightblue bg-opacity-20 text-kulinarasa-darkblue">
                  {recipe.is_public ? 'Public Recipe' : 'Private Recipe'}
                </div>
                {isBookmarked && (
                  <div className="flex items-center gap-1 mt-1 text-xs text-kulinarasa-darkblue">
                    <BookmarkCheck size={12} />
                    <span>Saved</span>
                  </div>
                )}
              </div>
            </div>
            
            {/* Caption */}
            <p className="mt-2 text-gray-700">{recipe.caption}</p>
            
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

            {/* Reviews Section */}
            <div className="mt-20">
              <h2 className="text-xl font-semibold text-kulinarasa-darkblue mb-4">Reviews</h2>
              
              {/* Status Messages */}
              {reviewSuccess && (
                <div className="mb-4 p-3 bg-green-100 text-green-700 rounded flex justify-between items-center">
                  <span>
                    {isBookmarked && !reviewError ? 'Recipe saved successfully!' : 'Action completed successfully!'}
                  </span>
                  <button onClick={() => setReviewSuccess(false)} className="text-green-700">
                    <X size={16} />
                  </button>
                </div>
              )}
              
              {reviewError && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded flex justify-between items-center">
                  <span>{reviewError}</span>
                  <button onClick={() => setReviewError(null)} className="text-red-700">
                    <X size={16} />
                  </button>
                </div>
              )}
              
              {/* Review Form - Only show if user is logged in */}
              {currentUserId ? (
                <div className="bg-gray-50 p-4 rounded-lg mb-6">
                  <h3 className="text-lg font-medium text-kulinarasa-darkblue mb-3">Leave a Review</h3>
                  <form onSubmit={handleSubmitReview}>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                      <div className="flex items-center">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <label key={star} className="mr-2 cursor-pointer">
                            <input
                              type="radio"
                              name="rating"
                              value={star}
                              checked={newReview.rating === star}
                              onChange={handleReviewChange}
                              className="sr-only"
                            />
                            <Star 
                              className={`w-6 h-6 ${newReview.rating >= star ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                            />
                          </label>
                        ))}
                      </div>
                    </div>
                    <div className="mb-4">
                      <label htmlFor="review_text" className="block text-sm font-medium text-gray-700 mb-1">
                        Your Review
                      </label>
                      <textarea
                        id="review_text"
                        name="review_text"
                        rows={3}
                        value={newReview.review_text}
                        onChange={handleReviewChange}
                        placeholder="Share your thoughts about this recipe..."
                        className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-kulinarasa-darkblue bg-white text-black focus:border-kulinarasa-darkblue"
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={submittingReview || !newReview.review_text}
                      className={`px-4 py-2 rounded text-white ${
                        submittingReview || !newReview.review_text 
                        ? 'bg-gray-400 cursor-not-allowed' 
                        : 'bg-kulinarasa-darkblue hover:bg-opacity-90'
                      }`}
                    >
                      {submittingReview ? 'Submitting...' : 'Submit Review'}
                    </button>
                  </form>
                </div>
              ) : (
                <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg mb-6">
                  <p className="text-yellow-800">
                    Please log in to leave a review for this recipe.
                  </p>
                </div>
              )}
              
              {/* Existing Reviews */}
              <div className="space-y-4">
                {reviews.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No reviews yet. Be the first to review this recipe!</p>
                ) : (
                  reviews.map((review) => (
                    <div key={review.id} className="bg-white p-4 rounded-lg shadow">
                      {editingReviewId === review.id ? (
                        /* Edit Review Form */
                        <form onSubmit={handleSaveEdit} className="bg-gray-50 p-4 rounded-lg">
                          <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                            <div className="flex items-center">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <label key={star} className="mr-2 cursor-pointer">
                                  <input
                                    type="radio"
                                    name="rating"
                                    value={star}
                                    checked={editReview.rating === star}
                                    onChange={handleEditReviewChange}
                                    className="sr-only"
                                  />
                                  <Star 
                                    className={`w-6 h-6 ${editReview.rating >= star ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                                  />
                                </label>
                              ))}
                            </div>
                          </div>
                          <div className="mb-4">
                            <label htmlFor="edit_review_text" className="block text-sm font-medium text-gray-700 mb-1">
                              Your Review
                            </label>
                            <textarea
                              id="edit_review_text"
                              name="review_text"
                              rows={3}
                              value={editReview.review_text}
                              onChange={handleEditReviewChange}
                              className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-kulinarasa-darkblue bg-white text-black focus:border-kulinarasa-darkblue"
                              required
                            />
                          </div>
                          <div className="flex gap-2">
                            <button
                              type="submit"
                              disabled={actionLoading}
                              className={`px-4 py-2 rounded text-white ${
                                actionLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-kulinarasa-darkblue hover:bg-opacity-90'
                              }`}
                            >
                              {actionLoading ? 'Saving...' : 'Save Changes'}
                            </button>
                            <button
                              type="button"
                              onClick={handleCancelEdit}
                              className="px-4 py-2 rounded border bg-white border-gray-300 text-gray-700 hover:bg-gray-100"
                            >
                              Cancel
                            </button>
                          </div>
                        </form>
                      ) : (
                        /* Review Display */
                        <>
                          <div className="flex justify-between items-start">
                            <div className="flex items-center">
                              <div className="flex mr-2">
                                {renderStars(review.rating)}
                              </div>
                              <p className="text-sm text-gray-600">User #{review.user_id}</p>
                            </div>
                            <div className="flex items-center">
                              <p className="text-xs text-gray-400 mr-2">
                                {new Date(review.created_at).toLocaleDateString()}
                              </p>
                              
                              {/* Edit/Delete buttons - Only show for the review author */}
                              {isReviewOwner(review) && (
                                <div className="flex gap-2">
                                  <button 
                                    onClick={() => handleStartEdit(review)}
                                    className="text-white bg-kulinarasa-orange hover:bg-kulinarasa-brown"
                                    title="Edit review"
                                  >
                                    <Pencil size={16} />
                                  </button>
                                  
                                  <button 
                                    onClick={() => handleConfirmDelete(review.id)}
                                    className="text-white bg-kulinarasa-orange hover:bg-red-800"
                                    title="Delete review"
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                          <p className="text-gray-800 mt-2">{review.review_text}</p>
                          
                          {/* Delete confirmation - Only show when delete is clicked */}
                          {deletingReviewId === review.id && (
                            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded">
                              <p className="text-red-700 mb-2">Are you sure you want to delete this review?</p>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleDeleteReview(review.id)}
                                  disabled={actionLoading}
                                  className={`px-3 py-1 rounded text-white ${
                                    actionLoading ? 'bg-gray-400' : 'bg-red-600 hover:bg-red-700'
                                  }`}
                                >
                                  {actionLoading ? 'Deleting...' : 'Yes, Delete'}
                                </button>
                                <button
                                  onClick={handleCancelDelete}
                                  className="px-3 py-1 rounded border border-gray-300 bg-white text-gray-700 hover:bg-gray-100"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}