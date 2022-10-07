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
