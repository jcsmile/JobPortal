const express = require("express");

// recordRoutes is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /jobs.
const recordRoutes = express.Router();

// This will help us connect to the database
const dbo = require("../db/conn");
const logger = require("../utils/logger");

// Pagination API to get job positions
recordRoutes.get("/jobs", async function (req, res) {  
    try{    
        // Default values for page and limit
        const offset = parseInt(req.query.offset) || 0;
        let limit = parseInt(req.query.limit) || 50;
        limit = limit > 50 ? 50 : limit;

        let collection = dbo.getJobCollection();

        let jobs = await collection.find({})
            .skip(offset)
            .limit(limit)
            .toArray();
            
        const totalJobs = await collection.countDocuments();
        res.json({
            totalJobs,
            offset: offset,
            limit: limit,
            jobs
        }); 
    
    } catch (err){
        logger.error("Error query jobs: %o", err);
        res.status(500).json({message: "API error when querying jobs data" });
    }

});

function buildQueryForMultipleValue(requestBody, requestKey, queryFieldName )
{
    const arrayOfString = requestBody[requestKey];
    if(arrayOfString && typeof arrayOfString == "object" && arrayOfString.length > 0){
        let result = {};
        result[queryFieldName] = { $in: arrayOfString};
        return result;
    }
    else 
        return null;

}

// API for combined filter conditions and text search. Return pagination results.
//
recordRoutes.post("/jobs", async function (req, res) {
    // Get the filters from requests
    let requestQuery = req.body;
    let searchCriteria = {};

    try{

        const offset = parseInt(requestQuery.offset) || 0;
        let limit = parseInt(requestQuery.limit) || 50;
        limit = limit > 50 ? 50 : limit;
        let finalQuery = {};
        finalQuery["$and"] = [];

        // Text search
        if (requestQuery.searchText && requestQuery.searchText.length > 0) {
            searchCriteria.$text = { $search: requestQuery.searchText, $caseSensitive: false };
            finalQuery["$and"].push(searchCriteria);
        }          
        // Company filter
        let subFilter = buildQueryForMultipleValue(requestQuery, "company", "company");
        subFilter ? finalQuery["$and"].push(subFilter) : null;

        //if (requestQuery.company && requestQuery.company.length > 0){
        //    searchCriteria.company = requestQuery.company.length > 0 ? { $in: requestQuery.company } : null;
        //}

        // Location filter
        subFilter = buildQueryForMultipleValue(requestQuery, "location", "location");
        subFilter ? finalQuery["$and"].push(subFilter) : null;

        //if (requestQuery.location){
        //    searchCriteria.location = requestQuery.location.length > 0 ? { $in: requestQuery.location } : null;
        //}

        // Department filter
        subFilter = buildQueryForMultipleValue(requestQuery, "department", "department");
        subFilter ? finalQuery["$and"].push(subFilter) : null;
        let collection = dbo.getJobCollection();

        searchCriteria = finalQuery["$and"].length > 1 ? finalQuery : finalQuery["$and"].length == 1 ? finalQuery["$and"][0] : searchCriteria;
        // Execute the search
        const jobs = await collection.find(searchCriteria)
            .skip(offset)
            .limit(limit)
            .toArray();

        const totalJobs = await collection.countDocuments(searchCriteria);

        res.json({
        totalJobs: totalJobs,
        offset: offset,
        limit: limit,
        jobs
        });
    } catch (err){
        logger.error("Error query jobs: %o", err);
        res.status(500).json({message: "API error when querying jobs data" });
    }

});

recordRoutes.get("/companies", async function (req, res) {  
    try{

        let collection = dbo.getJobCollection();

        // Execute the search
        const arrayCompany = await collection.distinct("company");
        
        res.json({
            companies: arrayCompany
            });
    } catch (err){
        logger.error("Error query companies: %o", err);
        res.status(500).json({message: "API error when querying companies data" });
    }
});

recordRoutes.get("/locations", async function (req, res) {  
    try{
        let collection = dbo.getJobCollection();

        // Execute the search
        const arrayLocations = await collection.distinct("location");
        
        res.json({
            locations: arrayLocations
            });
    } catch (err){
        logger.error("Error query locations: %o", err);
        res.status(500).json({message: "API error when querying locations data" });
    }
});

recordRoutes.post("/locations", async function (req, res) {  
    try{
        const companies = req.body.companies;
        if (!companies){
            logger.warn('Request body is missing field companies.')
            res.status(400).json({
                message: 'Request body is missing field companies.'
            });
            return;
        }

        let collection = dbo.getJobCollection();

        // Execute the search
        const arrayLocations = await collection.distinct("location", {company: {$in: companies}});
        
        res.json({
            locations: arrayLocations
            });
    } catch (err){
        logger.error("Error query locations: %o", err);
        res.status(500).json({message: "API error when querying locations data" });
    }
});

recordRoutes.get("/departments", async function (req, res) {  
    try{

        let collection = dbo.getJobCollection();

        // Execute the search
        const arrayDepartments = await collection.distinct("function");
        
        res.json({
            departments: arrayDepartments
            });
    } catch (err){
        logger.error("Error query departments: %o", err);
        res.status(500).json({message: "API error when querying departments data" });
    }
});

module.exports = recordRoutes;
