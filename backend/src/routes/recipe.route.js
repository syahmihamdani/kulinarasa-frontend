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
router.delete('/delete/:id', recipeController.deleteRecipe);
router.get('/search/:word', recipeController.searchRecipe);
router.get('/byuser/:id', recipeController.getRecipeByUserId);
router.put("/update/text", recipeController.updateRecipeText);
router.put("/update/image", upload.single('image'), recipeController.updateRecipeImage);

module.exports = router;