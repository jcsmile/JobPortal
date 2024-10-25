
const { MongoClient } = require("mongodb");
const connectionString = process.env.MONGO_URI || "";
const client = new MongoClient(connectionString);

let conn;
try {
  conn =  client.connect();
} catch(e) {
  console.error(e);
}

let db = client.db("jobs_db");

module.exports = {
  /*connectToServer: function (callback) {
    // Implement Database connection
    try {
        dbConnection = client.connect();
    } catch(e) {
        console.error(e);
        let errorMesage = "Connect to db failed";
        return callback(errorMesage);
    }
    
    // Provide the name of the database and collection you want to use.
    // If the database and/or collection do not exist, the driver and Atlas
    // will create them automatically when you first write data.
    const dbName = "jobs_db";
    const collectionName = "job_positions";
    db = client.db(dbName);
    jobCollection = db.collection(collectionName);
  },
*/
  getDb: function () {
    return db;
  },

  getJobCollection: function () {
    const collectionName = "job_positions";
    jobCollection = db.collection(collectionName);
    return jobCollection;
  },
};