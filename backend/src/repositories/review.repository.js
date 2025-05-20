const db = require("../database/pg.database");
const baseResponse = require("../utils/baseResponse.util");

exports.createReview = async (review) => {
    try {
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

exports.updateReview = async (review) => {
    try {
        const res = await db.query(
            "UPDATE reviews SET rating = $1, review_text = $2 WHERE id = $3 RETURNING *",
            [review.rating, review.review_text, review.id]
        );
        return res.rows[0];
    } catch (error) {
        console.log("Error updating review", error);
    }
}

exports.deleteReview = async (id) => {
    try {
        console.log(id);
        const res = await db.query(
            "DELETE FROM reviews WHERE id = $1 RETURNING *", [id]
        );
        return res.rows[0];
    } catch (error) {
        console.log("Error deleting review", error);
    }
}