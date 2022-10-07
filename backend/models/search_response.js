"use strict";
const { Brand } = require("./brand");

class SearchResponse {

    /**
    * @param {number} totalCount
    * @param {Brand[]} results
    */
    constructor(totalCount, results) {
        this.totalCount = totalCount;
        this.results = results;
    }
}

module.exports.SearchResponse = SearchResponse;