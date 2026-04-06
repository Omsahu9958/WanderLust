const Joi = require("joi");

const listingSchema = Joi.object({
    listing: Joi.object({
        title: Joi.string().required().messages({
            "string.empty": "Title is required",
        }),
        description: Joi.string().required(),
        location: Joi.string().required().messages({
            "string.empty": "Location is required",
        }),
        country: Joi.string(),
        price: Joi.number().required().min(0),
    }).required(),
}).unknown(true);

const reviewSchema = Joi.object({
    review: Joi.object({
        comment: Joi.string().required(),
        rating: Joi.number().required().min(1).max(5),
    }).required(),
}).unknown(true);

module.exports = { listingSchema, reviewSchema };