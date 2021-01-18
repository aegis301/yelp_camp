const mongoose = require('mongoose') // require mongoose
const Schema = mongoose.Schema; // save Schema expression to shorten ref
const Review = require('./review')

// define Campground Schema
const CampgroundSchema = new Schema ({
    title: String,
    images: [
        {
            url: String,
            filename: String
        }
    ],
    price: Number,
    description: String,
    location: String,
    author: { 
        type: Schema.Types.ObjectId,
        ref: 'User'
     },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
});

CampgroundSchema.post('findOneAndDelete', async function (doc) {
    if(doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})

// convert Schema to model and export it when required
module.exports = mongoose.model('Campground', CampgroundSchema);
