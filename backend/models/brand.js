"use strict";

const { ProductAvailability } = require("./product_availability");

class Brand {

    /**
    * @param {string} id
    * @param {string} name
    * @param {string[]} categoryType
    * @param {string[]} subCategoryType
    * @param {ProductAvailability[]} productAvailabilities
    */
    constructor(id, name, categoryType, subCategoryType, productAvailabilities) {
        this.id = id;
        this.name = name;
        this.categoryType = categoryType;
        this.subCategoryType = subCategoryType;
        this.productAvailabilities = productAvailabilities;
    }

}

module.exports.Brand = Brand;



const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    orderItems : [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'OrderItem',
        required: true,
    }],
    shippingAddress1: {
        type: String
    },
    shippingAddress2: {
        type: String
    },
    city: {
        type: String,
        required: true
    },
    zip: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true,
        default: 'Pending'
    },
    totalPrice: {
        type: Number
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    dateOrdered: {
        type: Date,
        dafault: Date.now
    }
})


orderSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

orderSchema.set('toJSON', {
    virtuals: true,
});

module.exports = mongoose.model('Order', orderSchema);

