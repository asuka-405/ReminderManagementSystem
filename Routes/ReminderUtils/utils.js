const { getUser } = require("../AuthUtils/utils.js")

module.exports = {
  checkData,
  processData,
}

async function processData(req, res, next) {
  req.body.user = (await getUser({ username: req.user.username }))._id

  req.body = checkData(req, res)
  return next()
}

function checkData(req, res) {
  let { date, subject, description, email, contact, sms, reminderFreq } =
    req.body

  req.body.reoccur = false
  if (!subject) return res.status(400).render("error.ejs")
  if (!description) return res.status(400).render("error.ejs")
  if (!(email || contact || sms)) return res.status(400).render("error.ejs")
  if (!date) req.body.date = setDate(date)
  if (!reminderFreq) req.body.reminderFreq = 0
  if (reminderFreq < 0) req.body.reoccur = true
  req.body.reminderFreq = Number(reminderFreq)
  return req.body
}

function setDate(date) {
  const NOW = new Date()
  const DATE_STRING = NOW.toLocaleDateString("en-GB")
  const [DAY, MONTH, YEAR] = DATE_STRING.split("/").map(Number)
  date = new Date(YEAR, MONTH - 1, DAY)
  return date
}
