import mongoose from "mongoose";

// Function to connect to MongoDB
const dbConnection = function () {
  const dbURI =
    process.env.MONGODB_URI || "mongodb://mongodb://127.0.0.1:27017/mydatabase";

  mongoose.connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  } as mongoose.ConnectOptions);
};

// Export the DB  connection function
module.exports = {
  dbConnection,
  mongoose,
};
