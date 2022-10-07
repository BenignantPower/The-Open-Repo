"use strict";

const { BrandDetails } = require("./models/brand");
const { SearchResponse } = require("./models/search_response");
const { SearchRequest } = require("./models/search_request");
const { ProductAvailablity } = require("./models/product_availability");

var brandMap = {};

/**
 * get brand
 * @param {string} id
 * @return {BrandDetails}
 */
var get = (id) => {
  return brandMap[id];
};

/**
 * Add brand detail
 * @param {BrandDetails} brandDetails
 * @return {boolean} true if add is successful else false
 */
var add = (brandDetails) => {
  const brand_id = brandDetails.id;
  if (brand_id == null || get(brand_id)) return false;

  brandMap[brand_id] = brandDetails;
  return true;
};

/**
 * Add {ProductAvailablity} to given brandId
 * @param {string} brandId
 * @param {ProductAvailablity} productAvailablity
 * @return {boolean} true if add is successful else false
 */
var addAvailability = (brandId, productAvailablity) => {
  if (brandId == null || productAvailablity == null || get(brandId) == null || get(brandId) === "undefined") return false;

  const brandProductAvailablities = brandMap[brandId].productAvailabilities;
  for (let i = 0; i < brandProductAvailablities.length; i++) {
    let object = brandProductAvailablities[i];
    if (object.id === productAvailablity.id) {
      return false;
    }
  }
  brandMap[brandId].productAvailabilities.push(productAvailablity);
  return true;
};

/**
 * Update {ProductAvailablity} to given brandId
 * @param {string} brandId
 * @param {ProductAvailablity} productAvailablity
 * @return {boolean} true if update is successful else false
 */
var updateAvailability = (brandId, productAvailablity) => {
  if (brandId == null || get(brandId) == null || get(brandId) === "undefined")
    return false;
  for (var key of Object.keys(productAvailablity)) {
    if (key == null) return false;
  }
  const brandProductAvailablities = brandMap[brandId].productAvailabilities;
  for (let i = 0; i < brandProductAvailablities.length; i++) {
    let object = brandProductAvailablities[i];
    if (object.id === productAvailablity.id) {
      brandMap[brandId].productAvailabilities[i] = productAvailablity;
      return true;
    }
  }
  return false;
};

/**
 * Remove {ProductAvailablity} to given brandId
 * @param {string} brandId
 * @param {ProductAvailablity} productAvailablity
 * @return {boolean} true if remove is successful else false
 */
var removeAvailability = (brandId, productAvailablity) => {
  if (brandId == null || get(brandId) == null) return false;
  const brandProductAvailablities = brandMap[brandId].productAvailabilities;
  for (let i = 0; i < brandProductAvailablities.length; i++) {
    let object = brandProductAvailablities[i];
    if (object.id === productAvailablity.id) {
      brandMap[brandId].productAvailabilities.splice(i, 1);
      return true;
    }
  }
  return false;
};

/**
 * bookProduct does the booking of a product for given categoryType type and subCategoryType
 * @param {string} brandId
 * @param {string} categoryType
 * @param {string} subCategoryType
 * @return {boolean} true if booking is successful else false
 */
var bookProduct = (brandId, categoryType, subCategoryType) => {
  if (
    brandId == null ||
    get(brandId) == null ||
    get(brandId) == undefined ||
    categoryType == null ||
    subCategoryType == null
  )
    return false;

  const brand = get(brandId);

  if (brand.categoryType.includes(categoryType))
    if (brand.subCategoryType.includes(subCategoryType)) {
      const products_avails = brand.productAvailabilities;
      for (let i = 0; i < products_avails.length; i++) {
        if (
          products_avails[i].categoryType == categoryType &&
          products_avails[i].subCategoryType == subCategoryType
        ) {
          if(products_avails[i].availableQuantityCount > 0){
              products_avails[i].availableQuantityCount-=1;
              products_avails[i].bookedQuantityCount += 1;
              return true;
          }
        }
      }
    }
  return false;
};

/**
 * Search function searches for brand details for given categoryType and subCategoryType
 * @param {string} categoryType
 * @param {string} subCategoryType
 * @return {SearchResponse} which matches the criteria
 */
var search = (categoryType, subCategoryType) => {
  if (categoryType == null || subCategoryType == null)
    return new SearchResponse(0, []);

  let searchResults = [];
  for (let key in brandMap) {
    let value = brandMap[key];

    if (
      value.categoryType.includes(categoryType) &&
      value.subCategoryType.includes(subCategoryType)
    ) {
      searchResults.push(value);
    }
  }
  return new SearchResponse(searchResults.length, searchResults);
};

/**
 * SearchList function searches for brand details for given categoryType and subCategoryType (accept array for search request)
 * @param {SearchRequest[]} searchRequest
 * @return {SearchResponse} searchResponse
 */
var searchList = (searchRequest) => {
  const initial_search = [];
  const unique_searches = new Set();
  for (let i = 0; i < searchRequest.length; i++) {
    initial_search.push(
      search(searchRequest[i].categoryType, searchRequest[i].subCategoryType)
    );
  }
  for (let i = 0; i < initial_search.length; i++) {
    const results = initial_search[i].results;
    for (let j = 0; j < results.length; j++) {
      unique_searches.add(results[j]);
    }
  }
  const response = [...unique_searches];
  return new SearchResponse(response.length, response);
};

module.exports = {
  get: get,
  add: add,
  addAvailability: addAvailability,
  updateAvailability: updateAvailability,
  removeAvailability: removeAvailability,
  bookProduct: bookProduct,
  search: search,
  searchList: searchList,
};
