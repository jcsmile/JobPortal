const express = require("express");

// recordRoutes is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /jobs.
const recordRoutes = express.Router();

// This will help us connect to the database
const dbo = require("../db/conn");

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
        console.log("Error query jobs:", err);
        res.status(500).json({message: "API error when querying jobs data" });
    }

});

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

        // Text search
        if (requestQuery.searchText) {
            searchCriteria.$text = { $search: requestQuery.searchText };
        }  
        
        if (requestQuery.location){
            searchCriteria.location = requestQuery.location.length > 0 ? { $in: requestQuery.location } : null;
        }

        let collection = dbo.getJobCollection();

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
        console.log("Error query jobs:", err);
        res.status(500).json({message: "API error when querying jobs data" });
    }

});


module.exports = recordRoutes;