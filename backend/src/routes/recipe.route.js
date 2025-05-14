const express = require('express');
const router = express.Router();
const recipeController = require('../controllers/recipe.controller');
const cloudinary = require('cloudinary').v2;
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/create', upload.single('image'), recipeController.createRecipe);
router.get('/public', recipeController.getPublicRecipes);
router.get('/:id', recipeController.getRecipeById);

module.exports = router;