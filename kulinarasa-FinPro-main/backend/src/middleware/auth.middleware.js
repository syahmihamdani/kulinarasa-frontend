const baseResponse = require('../utils/baseResponse.util');

const authenticateUser = (req, res, next) => {
    try {
        const user = req.headers.authorization;
        
        if (!user) {
            return baseResponse(res, false, 401, "Authentication required. Please login.");
        }

        // Verify if user exists in localStorage
        const userData = JSON.parse(user);
        if (!userData.id) {
            return baseResponse(res, false, 401, "Invalid authentication. Please login again.");
        }

        req.user = userData;
        next();
    } catch (error) {
        return baseResponse(res, false, 401, "Authentication failed. Please login again.");
    }
};

module.exports = authenticateUser;