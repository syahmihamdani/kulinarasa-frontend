const express = require('express');
const router = express.Router();
const recipeController = require('../controllers/recipe.controller');

router.post('/create', recipeController.createRecipe);
router.get('/public', recipeController.getPublicRecipes);
router.get('/:id', recipeController.getRecipeById);

module.exports = router;