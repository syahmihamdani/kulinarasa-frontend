const express = require('express');
const router = express.Router();
const recipeController = require('../controllers/recipe.controller');
// ...existing imports...

const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Get user data from localStorage
    const user = localStorage.getItem('user');
    if (!user) {
        setError('Please login first');
        navigate('/login');
        return;
    }

    try {
        // Create form data
        const submissionData = new FormData();
        // ...existing form data...

        // Send to backend with authorization header
        const response = await axios.post('http://localhost:3000/recipe/create', 
            submissionData, 
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': user // Send user data in header
                }
            }
        );

        setSuccess('Recipe created successfully!');
        setTimeout(() => setSuccess(''), 2000);
        navigate('/home');
    } catch (err) {
        console.error(err);
        if (err.response?.status === 401) {
            setError('Please login first');
            navigate('/login');
        } else {
            setError(err.response?.data?.message || err.message || 'Failed to create recipe');
        }
    } finally {
        setLoading(false);
    }
};const authenticateUser = require('../middleware/auth.middleware');
const cloudinary = require('cloudinary').v2;
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Protected routes (need authentication)
router.post('/create', authenticateUser, upload.single('image'), recipeController.createRecipe);
router.post('/save', authenticateUser, recipeController.saveRecipe);
router.get('/saved/:userId', authenticateUser, recipeController.getSavedRecipes);
router.delete('/unsave', authenticateUser, recipeController.unsaveRecipe);

// Public routes (no authentication needed)
router.get('/public', recipeController.getPublicRecipes);
router.get('/:id', recipeController.getRecipeById);

module.exports = router;