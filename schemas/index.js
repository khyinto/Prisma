const mongoose = require("mongoose");

function connectToDatabase() {
  const uri = "mongodb://localhost:27017/nodejs";
  try {
    mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected");
  } catch (err) {
    console.log("MongoDB connection error: ", err);
  }
}
module.exports = { connectToDatabase };
