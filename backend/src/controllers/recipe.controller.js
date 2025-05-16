const baseResponse = require('../utils/baseResponse.util');
const recipeRepository = require('../repositories/recipe.repository');

exports.createRecipe = async (req, res) => {
    try{
        console.log(req.body);
        console.log(req.file);
        const recipe = await recipeRepository.createRecipe(req.body, req.file);
        if (!recipe) {
            return baseResponse(res, false, 400, "Failed to upload recipe", null);
        }
        return baseResponse(res, true, 201, "Recipe uploaded", recipe);
    } catch (error) {
        return baseResponse(res, false, 500, "An error occurred while uploading recipe", error);
    }
}

exports.getPublicRecipes = async (req, res) => {
    try {
        const recipes = await recipeRepository.getPublicRecipes();
        if (!recipes) {
            return baseResponse(res, false, 400, "Failed to get public recipes", null);
        }
        return baseResponse(res, true, 200, "Public recipes retrieved", recipes);
    } catch (error) {
        return baseResponse(res, false, 500, "An error occurred while retrieving public recipes", error);
    }
}

exports.getRecipeById = async (req, res) => {
    try {
        const recipe = await recipeRepository.getRecipeById(req.params.id);
        if (!recipe) {
            return baseResponse(res, false, 400, "Failed to get recipe", null);
        }
        return baseResponse(res, true, 200, "Recipe retrieved", recipe);
    } catch (error) {
        return baseResponse(res, false, 500, "An error occurred while retrieving recipe", error);
    }
}