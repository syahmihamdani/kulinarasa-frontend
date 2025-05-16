const baseResponse = require('../utils/baseResponse.util');
const reviewRepository = require('../repositories/review.repository');

exports.createReview = async (req, res) => {
    try{
        console.log(req.body);
        const review = await reviewRepository.createReview(req.body);
        if (!review) {
            return baseResponse(res, false, 400, "Failed to upload review", null);
        }
        return baseResponse(res, true, 201, "Review uploaded", review);
    } catch (error) {
        return baseResponse(res, false, 500, "An error occurred while creating review", error);
    }
}

exports.getByRecipeId = async (req, res) => {
    try{   
        const reviews = await reviewRepository.getByRecipeId(req.params.id);
        if (!reviews) {
            return baseResponse(res, false, 400, "Failed to get reviews", null);
        }
        return baseResponse(res, true, 200, "Reviews retrieved", reviews);
    } catch (error) {
        return baseResponse(res, false, 500, "An error occurred while getting review by recipe id", error);
    }
}

exports.getByUserId = async (req, res) => {
    try{   
        const reviews = await reviewRepository.getByUserId(req.params.id);
        if (!reviews) {
            return baseResponse(res, false, 400, "Failed to get reviews", null);
        }
        return baseResponse(res, true, 200, "Reviews retrieved", reviews);
    } catch (error) {
        return baseResponse(res, false, 500, "An error occurred while getting review by user id", error);
    }
}