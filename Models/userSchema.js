const MONGOOSE = require("mongoose")

const USER_SCHEMA = new MONGOOSE.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
})

const USER = MONGOOSE.model("USER", USER_SCHEMA)

module.exports = USER
