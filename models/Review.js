const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    listId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'List',
        required: true
    },
    overallRating: {
        // Calculated from the average of category ratings
        type: Number,
        min: 0,
        max: 5
    },
    categories: {
        amenities: { type: Number, min: 0, max: 5, required: true },
        communication: { type: Number, min: 0, max: 5, required: true },
        loremIpsum: { type: Number, min: 0, max: 5, required: true },
        hygiene: { type: Number, min: 0, max: 5, required: true },
        locationOfProperty: { type: Number, min: 0, max: 5, required: true }
    },
    user:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
    ],
    reviewText: {
        type: String,
        default: ''
    }
});

// Automatically calculate the overall rating before saving the review
reviewSchema.pre('save', function (next) {
    const categories = this.categories;
    
    // Calculate the average rating from categories
    const avgRating = (
        categories.amenities +
        categories.communication +
        categories.loremIpsum +
        categories.hygiene +
        categories.locationOfProperty
    ) / 5;
    
    // Assign the calculated average to overallRating
    this.overallRating = avgRating;

    next();
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
