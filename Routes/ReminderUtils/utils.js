const { getUser } = require("../AuthUtils/utils.js")

module.exports = {
  processData,
}

async function processData(req, res, next) {
  const { subject, description, date, email, sms, contact, reminderFreq } =
    req.body
  req.body.user = req.user._id

  // Check if subject is not empty and is a string
  if (!subject || typeof subject !== "string") {
    res.render("error", { message: "Invalid subject" })
    return
  }

  // Check if description is not empty and is a string
  if (!description || typeof description !== "string") {
    res.render("error", { message: "Invalid description" })
    return
  }

  // Check if date is a valid date string
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    res.render("error", { message: "Invalid date" })
    return
  }

  // Set a default value for reminderFreq if it's not present
  const validReminderFreqs = [1, 2, 3, 5, 7]
  const defaultReminderFreq = 0
  const freq = validReminderFreqs.includes(Number(reminderFreq))
    ? Number(reminderFreq)
    : defaultReminderFreq

  // Set reoccur based on reminderFreq
  req.body.reoccur = freq !== defaultReminderFreq

  // Check if email or sms or contact is present
  if (!email && !sms && !contact) {
    res.render("error", { message: "Email or SMS or contact must be present" })
    return
  }
  return next()
}
