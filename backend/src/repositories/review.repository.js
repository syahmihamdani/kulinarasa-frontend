const db = require("../database/pg.database");
const baseResponse = require("../utils/baseResponse.util");

exports.createReview = async (review) => {
    try {
        console.log(review);
        const res = await db.query(
            "INSERT INTO reviews (recipe_id, user_id, rating, review_text) VALUES ($1, $2, $3, $4) RETURNING *",
            [review.recipe_id, review.user_id, review.rating, review.review_text]
        );
        return res.rows[0]; 
    } catch (error) {
        console.log("Error creating review", error);
    }
}

exports.getByRecipeId = async (id) => {
    try {
        const res = await db.query(
            "SELECT * FROM reviews WHERE recipe_id = $1", [id]
        );
        return res.rows;
    } catch (error) {
        console.log("Error getting review by recipe id", error);
    }
}

exports.getByUserId = async (id) => {
    try {
        const res = await db.query(
            "SELECT * FROM reviews WHERE user_id = $1", [id]
        );
        return res.rows;
    } catch (error) {
        console.log("Error getting review by user id", error);
    }
}