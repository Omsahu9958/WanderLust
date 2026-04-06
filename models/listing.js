const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review");

const listSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: String,
    location: {
        type: String,
        required: true,
    },
    country: String,
    price: {
        type: Number,
        required: true,
    },
    image: {
        filename: {
            type: String,
            default: "listingimage",
        },
        url: {
            type: String,
            default: "https://via.placeholder.com/400?text=No+Image",
            set: (v) => v === "" ? "https://via.placeholder.com/400?text=No+Image" : v,
        }
    },
    images: [
        {
            url: String,
            filename: String,
        }
    ],
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true,
        },
        coordinates: {
            type: [Number],
            required: true,
        }
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review",
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Geospatial index for location queries
listSchema.index({ geometry: "2dsphere" });

// Delete reviews when listing is deleted
listSchema.post("findByIdAndDelete", async function (listing) {
    if (listing) {
        await Review.deleteMany({ _id: { $in: listing.reviews } });
    }
});

module.exports = mongoose.model("Listing", listSchema);