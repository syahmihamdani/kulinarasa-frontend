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

exports.deleteRecipe = async (req, res) => {
    try {
        const recipe = await recipeRepository.deleteRecipe(req.params.id);
        if (!recipe) {
            return baseResponse(res, false, 400, "Failed to delete recipe", null);
        }
        return baseResponse(res, true, 200, "Recipe deleted", recipe);
    } catch (error) {
        return baseResponse(res, false, 500, "An error occurred while deleting recipe", error);
    }
}

exports.searchRecipe = async (req, res) => {
    try {
        const recipes = await recipeRepository.searchRecipe(req.params.word);
        if (!recipes) {
            return baseResponse(res, false, 400, "Recipe not found", null);
        }
        return baseResponse(res, true, 200, "Recipes retrieved", recipes);
    } catch (error) {
        return baseResponse(res, false, 500, "An error occurred while searching recipe", error);
    }
}

exports.getRecipeByUserId = async (req, res) => {
    try {
        const recipes = await recipeRepository.getRecipeByUserId(req.params.id);
        if (!recipes) {
            return baseResponse(res, false, 400, "Failed to get recipes by user id", null);
        }
        return baseResponse(res, true, 200, "Recipes retrieved", recipes);
    } catch (error) {
        return baseResponse(res, false, 500, "An error occurred while retrieving recipes by user id", error);
    }
}

exports.updateRecipeText = async (req, res) => {
    try {
        const recipe = await recipeRepository.updateRecipeText(req.body);
        if (!recipe) {
            return baseResponse(res, false, 400, "Failed to update recipe", null);
        }
        return baseResponse(res, true, 200, "Recipe updated", recipe);
    } catch (error) {
        return baseResponse(res, false, 500, "An error occurred while updating recipe", error);
    }
}

exports.updateRecipeImage = async (req, res) => {
    try {
        const recipe = await recipeRepository.updateRecipeImage(req.body, req.file);
        if (!recipe) {
            return baseResponse(res, false, 400, "Failed to update recipe", null);
        }
        return baseResponse(res, true, 200, "Recipe updated", recipe);
    } catch (error) {
        return baseResponse(res, false, 500, "An error occurred while updating recipe", error);
    }
}