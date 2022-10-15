var chai = require('chai');
var chaiHttp = require('chai-http');
const decache = require('decache');
var should = chai.should();
var expect = chai.expect;
var uuid = require('uuid').v4;
chai.use(chaiHttp);

const Constants = require("../constants");
const { Brand } = require("../models/brand");
const { SearchResponse } = require("../models/search_response");
const { SearchRequest } = require("../models/search_request");
const { ProductAvailability } = require("../models/product_availability");

var skuService = require("../sku_management");


describe('Sku tests', function() {

    beforeEach(function() {
        decache("../sku_management");
        skuService = require("../sku_management");
    });

    it('add Brand Success', (done) => {
        const id = uuid();
        expect(skuService.add(getMockBrand(id, "Brand A"))).to.be.equal(true);
        expect(skuService.add(getMockBrand(id, "Brand B"))).to.be.equal(false);
        done();
	});
    it('Add Availability Failure', (done) => {
        const id = uuid();
        expect(skuService.addAvailability(null, null), "Empty brand and product availability should not be added").to.be.equal(false);
        expect(skuService.addAvailability(null, new ProductAvailability(null, null, null, null, null)), "Empty brand and product availability should not be added").to.be.equal(false);

        const brand = getMockBrand(id);
        const productAvailablity = new ProductAvailability("1",Constants.CategoryType.APPAREL , Constants.SubCategoryType.CLOTHING , 10 , 0);
        expect(skuService.add(brand)).to.be.equal(true);
        expect(skuService.addAvailability(brand.id, productAvailablity)).to.be.equal(true);
        expect(skuService.addAvailability(brand.id, productAvailablity)).to.be.equal(false);
        done();
	});

    it('Update non existing availability', (done) => {
        expect(skuService.updateAvailability("random_id", null)).to.be.equal(false);
        expect(skuService.updateAvailability("random_id", new ProductAvailability(null, null, null, null, null))).to.be.equal(false);

        var brand = getMockBrand();
        let productAvailability1 = new ProductAvailability("1",Constants.CategoryType.APPAREL , Constants.SubCategoryType.CLOTHING , 10 , 0);
        let productAvailability2 = new ProductAvailability("2",Constants.CategoryType.APPAREL , Constants.SubCategoryType.CLOTHING , 10 , 0);

        expect(skuService.add(brand)).to.be.equal(true);
        expect(skuService.updateAvailability(brand.id, productAvailability1), "productAvailability does not exists for the same brand").to.be.equal(false);
        expect(skuService.addAvailability(brand.id, productAvailability1)).to.be.equal(true);
        var fetchedBrand = skuService.get(brand.id);
        expect(fetchedBrand.id).to.be.equal(brand.id);
        expect(fetchedBrand.productAvailabilities.length).to.be.equal(brand.productAvailabilities.length);
        expect(skuService.updateAvailability(brand.id, productAvailability2), "productAvailability does not exists for the same brand").to.be.equal(false);
        done();
	});

    it('Update availability succesfully', (done) => {
        const id = uuid();
        expect(skuService.updateAvailability("random_id", null)).to.be.equal(false);
        const brand = getMockBrand(id);
        let productAvailability1 = new ProductAvailability("1",Constants.CategoryType.APPAREL , Constants.SubCategoryType.CLOTHING , 10, 0);
        let productAvailability2 = new ProductAvailability("2",Constants.CategoryType.APPAREL , Constants.SubCategoryType.CLOTHING , 10, 0);
        let updateProductAvailability2 = new ProductAvailability("2",Constants.CategoryType.APPAREL , Constants.SubCategoryType.CLOTHING , 9, 0);

        expect(skuService.add(brand)).to.be.equal(true);
        expect(skuService.addAvailability(brand.id, productAvailability1)).to.be.equal(true);
        expect(skuService.addAvailability(brand.id, productAvailability2)).to.be.equal(true);
        expect(skuService.updateAvailability(brand.id, updateProductAvailability2)).to.be.equal(true);


        var fetchedBrand = skuService.get(brand.id);
        expect(fetchedBrand.id).to.be.equal(brand.id);
        expect(fetchedBrand.productAvailabilities.length).to.be.equal(brand.productAvailabilities.length);
        done();
	});

    it('Remove non existing availability', (done) => {
        expect(skuService.removeAvailability("random_id", null)).to.be.equal(false);
        expect(skuService.removeAvailability("random_id", new ProductAvailability())).to.be.equal(false);

        const brand = getMockBrand();
        let productAvailability1 = new ProductAvailability("1",Constants.CategoryType.APPAREL , Constants.SubCategoryType.CLOTHING , 10, 0);
        let productAvailability2 = new ProductAvailability("2",Constants.CategoryType.APPAREL , Constants.SubCategoryType.CLOTHING , 10, 0);

        expect(skuService.add(brand)).to.be.equal(true);
        expect(skuService.removeAvailability(brand.id, productAvailability1), "productavailablity does not exists for the same brand").to.be.equal(false);
        expect(skuService.addAvailability(brand.id, productAvailability1)).to.be.equal(true);
        expect(skuService.removeAvailability(brand.id, productAvailability2), "productavailablity does not exists for the same brand").to.be.equal(false);
        done();
	});

    it('Remove availability successfully', (done) => {
        const brand = getMockBrand();
        let productAvailability1 = new ProductAvailability("1",Constants.CategoryType.APPAREL , Constants.SubCategoryType.CLOTHING , 10, 0);
        let productAvailability2 = new ProductAvailability("2",Constants.CategoryType.APPAREL , Constants.SubCategoryType.CLOTHING , 10, 0);

        expect(skuService.add(brand)).to.be.equal(true);
        expect(skuService.addAvailability(brand.id, productAvailability1)).to.be.equal(true);
        expect(skuService.addAvailability(brand.id, productAvailability2)).to.be.equal(true);
        expect(skuService.removeAvailability(brand.id, productAvailability1)).to.be.equal(true);
        expect(skuService.removeAvailability(brand.id, productAvailability2)).to.be.equal(true);

        const fetchedBrand = skuService.get(brand.id);
        expect(fetchedBrand.id).to.be.equal(brand.id);
        expect(fetchedBrand.productAvailabilities.length).to.be.equal(0);
        expect(skuService.removeAvailability(brand.id, productAvailability1), "productavailablity does not exists for the same brand").to.be.equal(false);
        expect(skuService.removeAvailability(brand.id, productAvailability2), "productavailablity does not exists for the same brand").to.be.equal(false);
        expect(skuService.addAvailability(brand.id, productAvailability1)).to.be.equal(true);
        expect(skuService.addAvailability(brand.id, productAvailability2)).to.be.equal(true);
        done();
	});

    it('Book Product failure', (done) => {
        const id = uuid();
        expect(skuService.bookProduct("random_id", null)).to.be.equal(false);
        expect(skuService.bookProduct("random_id", Constants.CategoryType.APPAREL, Constants.SubCategoryType.CLOTHING)).to.be.equal(false);

        const brand = getMockBrand(id);
        let productAvailability1 = new ProductAvailability("1",Constants.CategoryType.BEVERAGES , Constants.SubCategoryType.COFFEE , 10, 0);

        expect(skuService.add(brand)).to.be.equal(true);
        expect(skuService.bookProduct(brand.id, Constants.CategoryType.APPAREL, Constants.SubCategoryType.FOOTWEAR)).to.be.equal(false);
        expect(skuService.bookProduct(brand.id, Constants.CategoryType.BEVERAGES, Constants.SubCategoryType.TEA)).to.be.equal(false);
        expect(skuService.addAvailability(brand.id, productAvailability1)).to.be.equal(true);
        expect(skuService.bookProduct(brand.id, Constants.CategoryType.APPAREL, Constants.SubCategoryType.FOOTWEAR)).to.be.equal(false);
        expect(skuService.bookProduct(brand.id, Constants.CategoryType.APPAREL, Constants.SubCategoryType.CLOTHING)).to.be.equal(false);
        expect(skuService.bookProduct(brand.id, Constants.CategoryType.BEVERAGES, Constants.SubCategoryType.TEA)).to.be.equal(false);
        done();
	});

    it('Book Product Success', (done) => {
        const id = uuid();
        expect(skuService.bookProduct("random_id", null)).to.be.equal(false);
        expect(skuService.bookProduct("random_id", Constants.CategoryType.APPAREL, Constants.SubCategoryType.CLOTHING)).to.be.equal(false);

        const brand = getMockBrand(id);
        let productAvailability1 = new ProductAvailability("1",Constants.CategoryType.BEVERAGES , Constants.SubCategoryType.COFFEE , 10, 0);
        let productAvailability2 = new ProductAvailability("2",Constants.CategoryType.APPAREL , Constants.SubCategoryType.CLOTHING , 1, 0);

        expect(skuService.add(brand)).to.be.equal(true);
        expect(skuService.addAvailability(brand.id, productAvailability1)).to.be.equal(true);
        expect(skuService.bookProduct(brand.id, Constants.CategoryType.APPAREL, Constants.SubCategoryType.CLOTHING)).to.be.equal(false);
        expect(skuService.bookProduct(brand.id, Constants.CategoryType.APPAREL, Constants.SubCategoryType.FOOTWEAR)).to.be.equal(false);
        expect(skuService.bookProduct(brand.id, Constants.CategoryType.BEVERAGES, Constants.SubCategoryType.COFFEE)).to.be.equal(true);
        expect(skuService.addAvailability(brand.id, productAvailability2)).to.be.equal(true);
        expect(skuService.bookProduct(brand.id, Constants.CategoryType.APPAREL, Constants.SubCategoryType.CLOTHING)).to.be.equal(true);
        expect(skuService.bookProduct(brand.id, Constants.CategoryType.APPAREL, Constants.SubCategoryType.CLOTHING)).to.be.equal(false);
        const fetchedBrand = skuService.get(brand.id);
        expect(fetchedBrand.id).to.be.equal(brand.id);
        expect(fetchedBrand.productAvailabilities).to.have.lengthOf.above(0)
        productAvailability1 = fetchedBrand.productAvailabilities.filter(item  => item.id === "1");
        productAvailability2 = fetchedBrand.productAvailabilities.filter(item  => item.id === "2");
        expect(productAvailability1).to.have.lengthOf.above(0)
        expect(productAvailability2).to.have.lengthOf.above(0)
        expect(productAvailability1[0].availableQuantityCount).to.be.equal(9);
        expect(productAvailability2[0].availableQuantityCount).to.be.equal(0);
        done();
	});

    it('search with empty categoryType and empty subCategoryType', (done) => {
        var searchResponse = skuService.search(null, null);
        expect(searchResponse.totalCount).to.be.equal(0);
        expect(searchResponse.results).deep.to.equal([]);
        done();
	});

    it('search with empty categoryType and nonEmpty subCategoryType', (done) => {
        const brand1 = getMockBrand();
        const brand2 = getMockBrand();
        const response1 = skuService.search(null, Constants.SubCategoryType.CLOTHING);
        expect(response1.totalCount).to.be.equal(0);
        expect(response1.results).deep.to.equal([]);
        expect(skuService.add(brand1)).to.be.equal(true);
        const response2 = skuService.search(null, Constants.SubCategoryType.CLOTHING);
        expect(response2.totalCount).to.be.equal(0);
        expect(response2.results).deep.to.equal([]);
        expect(skuService.add(brand2)).to.be.equal(true);
        const response3 = skuService.search(null, Constants.SubCategoryType.CLOTHING);
        expect(response3.totalCount).to.be.equal(0);
        expect(response3.results).deep.to.equal([]);
        done();
	});

    it('search with nonempty categoryType and empty subCategoryType', (done) => {
        const brand1 = getMockBrand();
        const brand2 = getMockBrand();
        const response1 = skuService.search(Constants.CategoryType.APPAREL, null);
        expect(response1.totalCount).to.be.equal(0);
        expect(response1.results).deep.to.equal([]);
        expect(skuService.add(brand1)).to.be.equal(true);
        const response2 = skuService.search(Constants.CategoryType.APPAREL, null);
        expect(response2.totalCount).to.be.equal(0);
        expect(response2.results).deep.to.equal([]);
        expect(skuService.add(brand2)).to.be.equal(true);
        const response3 = skuService.search(Constants.CategoryType.APPAREL, null);
        expect(response3.totalCount).to.be.equal(0);
        expect(response3.results).deep.to.equal([]);
        done();
	});

    it('search categorType and subCategoryType', (done) => {
        var brand1 = new Brand("1", "brand A", [Constants.CategoryType.APPAREL, Constants.CategoryType.BEVERAGES], [Constants.SubCategoryType.CLOTHING, Constants.SubCategoryType.COFFEE], []);
        var brand2 = new Brand("2", "brand B", [Constants.CategoryType.APPAREL, Constants.CategoryType.BEVERAGES], [Constants.SubCategoryType.CLOTHING, Constants.SubCategoryType.COFFEE], []);
        var brand3 = new Brand("3", "brand C", [Constants.CategoryType.BEVERAGES], [Constants.SubCategoryType.COFFEE], []);
        expect(skuService.add(brand1)).to.be.equal(true);
        expect(skuService.add(brand2)).to.be.equal(true);
        expect(skuService.add(brand3)).to.be.equal(true);

        const response1 = skuService.search(Constants.CategoryType.APPAREL, Constants.SubCategoryType.CLOTHING);
        expect(response1.totalCount).to.be.equal(2);
        checkIfContainAllElements(response1.results, [brand1, brand2]);

        const response2 = skuService.search(Constants.CategoryType.APPAREL, Constants.SubCategoryType.FOOTWEAR);
        expect(response2.totalCount).to.be.equal(0);
        expect(response2.results).deep.to.equal([]);


        const response3 = skuService.search(Constants.CategoryType.BEVERAGES, Constants.SubCategoryType.COFFEE);
        expect(response3.totalCount).to.be.equal(3);
        checkIfContainAllElements(response3.results, [brand1, brand2, brand3]);

        const response4 = skuService.search(Constants.CategoryType.BEVERAGES, Constants.SubCategoryType.TEA);
        expect(response4.totalCount).to.be.equal(0);
        expect(response4.results).deep.to.equal([]);

        done();
	});

    it('multi search', (done) => {
        var brand1 = new Brand("1", "brand A", [Constants.CategoryType.APPAREL, Constants.CategoryType.BEVERAGES], [Constants.SubCategoryType.CLOTHING, Constants.SubCategoryType.COFFEE], []);
        var brand2 = new Brand("2", "brand B", [Constants.CategoryType.APPAREL, Constants.CategoryType.BEVERAGES], [Constants.SubCategoryType.CLOTHING, Constants.SubCategoryType.COFFEE], []);
        var brand3 = new Brand("3", "brand C", [Constants.CategoryType.BEVERAGES], [Constants.SubCategoryType.TEA], []);
        const searchRequest1 = new SearchRequest(Constants.CategoryType.APPAREL, Constants.SubCategoryType.FOOTWEAR);
        const response1 = skuService.searchList([searchRequest1]);
        expect(response1.totalCount).to.be.equal(0);
        expect(response1.results).deep.to.equal([]);

        expect(skuService.add(brand1)).to.be.equal(true);
        expect(skuService.add(brand2)).to.be.equal(true);
        expect(skuService.add(brand3)).to.be.equal(true);

        const searchRequest2 = new SearchRequest(Constants.CategoryType.APPAREL, Constants.SubCategoryType.FOOTWEAR);
        const response2 = skuService.searchList([searchRequest2]);
        expect(response2.totalCount).to.be.equal(0);
        expect(response2.results).deep.to.equal([]);

        const searchRequest31 = new SearchRequest(Constants.CategoryType.APPAREL, Constants.SubCategoryType.FOOTWEAR);
        const searchRequest32 = new SearchRequest(Constants.CategoryType.APPAREL, Constants.SubCategoryType.CLOTHING);
        const response3 = skuService.searchList([searchRequest31, searchRequest32]);
        expect(response3.totalCount).to.be.equal(2);
        checkIfContainAllElements(response3.results, [brand1, brand2]);

        const searchRequest4 = new SearchRequest(Constants.CategoryType.APPAREL, Constants.SubCategoryType.CLOTHING);
        const response4 = skuService.searchList([searchRequest4]);
        expect(response4.totalCount).to.be.equal(2);
        checkIfContainAllElements(response4.results, [brand1, brand2]);

        const searchRequest51 = new SearchRequest(Constants.CategoryType.APPAREL, Constants.SubCategoryType.CLOTHING);
        const searchRequest52 = new SearchRequest(Constants.CategoryType.BEVERAGES, Constants.SubCategoryType.TEA);
        const response5 = skuService.searchList([searchRequest51, searchRequest52]);
        expect(response5.totalCount).to.be.equal(3);
        checkIfContainAllElements(response5.results, [brand1, brand2, brand3]);

        const searchRequest61 = new SearchRequest(Constants.CategoryType.APPAREL, Constants.SubCategoryType.CLOTHING);
        const searchRequest62 = new SearchRequest(Constants.CategoryType.APPAREL, Constants.SubCategoryType.FOOTWEAR);
        const searchRequest63 = new SearchRequest(Constants.CategoryType.BEVERAGES, Constants.SubCategoryType.COFFEE);
        const searchRequest64 = new SearchRequest(Constants.CategoryType.BEVERAGES, Constants.SubCategoryType.TEA);
        const response6 = skuService.searchList([searchRequest61, searchRequest62, searchRequest63, searchRequest64]);
        expect(response6.totalCount).to.be.equal(3);
        checkIfContainAllElements(response6.results, [brand1, brand2, brand3]);

        done();
	});

});

var checkIfContainAllElements = (array1, array2) => {
    array1.forEach(x => expect(array2).contain(x));
}

var getMockBrand= (id = uuid(), name = "brand A") => {
    return new Brand(id, name, [Constants.CategoryType.APPAREL, Constants.CategoryType.BEVERAGES], [Constants.SubCategoryType.CLOTHING, Constants.SubCategoryType.COFFEE], []);
}

