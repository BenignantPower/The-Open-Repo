"use strict";

const { CategoryType } = require("../constants"); 
const { SubCategoryType } = require("../constants"); 

class ProductAvailability {

    /**
    * @param {number} ID
    * @param {CategoryType} categoryType
    * @param {SubCategoryType} subCategoryType
    * @param {number} availableQuantityCount
    * @param {number} bookedQuantityCount
    */
    constructor(id ,categoryType , subCategoryType , availableQuantityCount , bookedQuantityCount) {
        this.id = id;
        this.categoryType = categoryType;
        this.subCategoryType = subCategoryType;
        this.availableQuantityCount = availableQuantityCount;
        this.bookedQuantityCount = bookedQuantityCount;
    }
}

module.exports.ProductAvailability = ProductAvailability;