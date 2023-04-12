const MONGOOSE = require("mongoose")

const REMINDER_SCHEMA = new MONGOOSE.Schema({
  user: { type: MONGOOSE.Schema.Types.ObjectId, ref: "USER" },
  date: { type: Date, required: true },
  subject: { type: String, required: true },
  description: { type: String },
  email: { type: String },
  contact: { type: String },
  sms: { type: String },
  reoccur: { type: Boolean, default: false },
  reminderFreq: { type: Number },
  enabled: { type: Boolean, default: true },
})

const REMINDER = MONGOOSE.model("REMINDER", REMINDER_SCHEMA)

module.exports = REMINDER
