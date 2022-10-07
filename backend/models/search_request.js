"use strict";

const { CategoryType } = require("../constants/category_type"); 
const { SubCategoryType } = require("../constants/sub_category_type"); 

class SearchRequest {

    /**
    * @param {CategoryType} categoryType
    * @param {SubCategoryType} subCategoryType
    */
    constructor(categoryType, subCategoryType) {
        this.categoryType = categoryType;
        this.subCategoryType = subCategoryType;
    }
}

module.exports.SearchRequest = SearchRequest;
