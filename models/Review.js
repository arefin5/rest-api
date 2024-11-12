const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    listId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'List',
        required: true
    },
    avgRating: {
        type: Number,
        min: 0,
        max: 5
    },
    amenitiesRating: { type: Number, min: 0, max: 5, required: true },
    communicationRating: { type: Number, min: 0, max: 5, required: true },
    loremIpsumRating: { type: Number, min: 0, max: 5, required: true },
    hygieneRating: { type: Number, min: 0, max: 5, required: true },
    locationOfProperty: { type: Number, min: 0, max: 5, required: true },
    user: [
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



const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
