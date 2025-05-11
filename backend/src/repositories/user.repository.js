const db = require("../database/pg.database");
const baseResponse = require("../utils/baseResponse.util");

exports.registerUser = async (user, hash) => {
    try {
        const res = await db.query(
        "INSERT INTO users (email, password, name) VALUES ($1, $2, $3) RETURNING *",
        [user.email, hash, user.name]
        );
        return res.rows[0];
    } catch (error) {
        console.log("Error creating user", error);
    }
};

exports.loginUser = async (user) => {
    try {
        const res = await db.query("SELECT * FROM users WHERE email = $1", [user.email]);
        return res.rows[0];
    } catch (error) {
        console.log("Error logging in", error);
    }
};

exports.findUser = async (id) => {
    try{
        const res = await db.query("SELECT * FROM users WHERE id = $1", [id]);
        return res.rows[0];
    }catch(error){
        console.log("Error getting user", error);
    }
};