const MONGOOSE = require("mongoose")

function initializeMongoose() {
  MONGOOSE.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
    .then(() => {
      console.log("Connected to the database!")
    })
    .catch((error) => {
      console.log("Failed to connect to the database:", error)
    })
}

module.exports = initializeMongoose
