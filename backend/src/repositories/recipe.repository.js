const db = require("../database/pg.database");
const baseResponse = require("../utils/baseResponse.util");
const cloudinary = require('cloudinary').v2;
const multer = require('multer');

exports.createRecipe = async (recipe, image) => {
    try {
        console.log(recipe);
        let imageB64 = null;
        if(image){
            imageB64 = `data:${image.mimetype};base64,${image.buffer.toString('base64')}`;
        }
        const url = await cloudinary.uploader.upload(imageB64, {
            resource_type: "image",
            public_id: "image",
            notification_url: "http:/localhost:3000/recipe/create"
        }); 
        const res = await db.query(
            "INSERT INTO recipes (name, caption, image_url, author_id, food_type, procedure, is_public, ingredients) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *",
            [recipe.name, recipe.caption, url.secure_url, recipe.author_id, recipe.food_type, recipe.procedure, recipe.is_public, recipe.ingredients]
        );
        return res.rows[0];
    } catch (error) {
        console.log("Error creating recipe", error);
    }
}

//digunakan untuk overview recipe 
exports.getPublicRecipes = async () => {
    try{
        const res = await db.query("SELECT recipes.id, recipes.name, caption, image_url, users.name AS author_name, food_type,  recipes.created_at, COUNT(reviews.id) AS total_reviews, AVG(reviews.rating) AS average_rating FROM recipes LEFT JOIN reviews ON recipes.id = reviews.recipe_id JOIN users ON recipes.author_id = users.id WHERE is_public = true GROUP BY recipes.id, users.name ORDER BY average_rating DESC");
        return res.rows;
    } catch (error) {
        console.log("Error creating recipe", error);
    }
}

exports.getRecipeById = async (id) => {
    try{
        const res = await db.query("SELECT recipes.id, recipes.name, caption, image_url, users.name AS author_name, food_type, ingredients, procedure, is_public, recipes.created_at, COUNT(reviews.id) AS total_reviews, AVG(reviews.rating) AS average_rating FROM recipes LEFT JOIN reviews ON recipes.id = reviews.recipe_id JOIN users ON recipes.author_id = users.id WHERE recipes.id = $1 GROUP BY recipes.id, users.name", [id]);
        return res.rows[0];
    } catch (error) {
        console.log("Error creating recipe", error);
    }
}