// File: server.js

const express = require('express');

const { MongoClient } = require("mongodb");
const routes = require("./api/routes/jobPostings");

const app = express();

// Middleware to parse JSON
app.use(express.json());
app.use('/api', routes);

app.get('/', async (req, res) => {
    try {
        res.json({
            message: "Hello, this works!"
          });
    } catch (err) {
        console.error("Error fetching jobs:", err);
        res.status(500).json({ message: 'Server Error' });
    }
});

/*
// MongoDB connection
mongoose.connect('mongodb://localhost:27017/job_db', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("Connected to MongoDB"))
.catch(err => console.error("MongoDB connection error:", err));

// Define a JobPosition schema
const jobPositionSchema = new mongoose.Schema({
  companyName: { type: String, required: true },
  jobTitle: { type: String, required: true },
  locations: { type: [String], required: true }, // Array of locations
  department: { type: String, required: true },
  applicationUrl: { type: String, required: true }
});

// Create a JobPosition model
const JobPosition = mongoose.model('JobPosition', jobPositionSchema);

// Pagination API to get job positions
app.get('/api/jobs', async (req, res) => {
  try {
    // Default values for page and limit
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    // Calculate how many documents to skip
    const skip = (page - 1) * limit;

    // Fetch paginated job positions from MongoDB
    const jobs = await JobPosition.find()
      .skip(skip)
      .limit(limit);

    // Get total document count to calculate total pages
    const totalJobs = await JobPosition.countDocuments();

    res.json({
      page,
      limit,
      totalPages: Math.ceil(totalJobs / limit),
      totalJobs,
      jobs
    });
  } catch (err) {
    console.error("Error fetching jobs:", err);
    res.status(500).json({ message: 'Server Error' });
  }
});
*/

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
