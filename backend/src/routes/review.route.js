const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/review.controller');

router.post('/create', reviewController.createReview);
router.get("/byrecipe/:id", reviewController.getByRecipeId);
router.get("/byuser/:id", reviewController.getByUserId);
router.put("/update", reviewController.updateReview);
router.delete("/delete/:id", reviewController.deleteReview);

module.exports = router;