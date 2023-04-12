const EXPRESS = require("express")
const { checkAuthenticated, getUser } = require("./AuthUtils/utils.js")
const OPTIONS = require("./options.js")
const {
  setReminder,
  getReminder,
  getReminderAll,
  checkOwner,
} = require("./ReminderUtils/reminder-crud.js")
const { processData } = require("./ReminderUtils/utils.js")
const REMINDER_ROUTER = EXPRESS.Router()

REMINDER_ROUTER.use(checkAuthenticated)
REMINDER_ROUTER.use("/options", OPTIONS)

REMINDER_ROUTER.get("/create", (req, res) => {
  res.render("create.ejs")
})
REMINDER_ROUTER.post("/create", processData, async (req, res) => {
  await setReminder(req.body)
  res.status(200).redirect(`/done`)
})

REMINDER_ROUTER.get("/viewall", async (req, res) => {
  const USER_ID = (await getUser({ username: req.user.username }))._id
  let REMINDERS
  if (!req.query.date) REMINDERS = await getReminderAll({ user: USER_ID })
  else
    REMINDERS = await getReminderAll({
      user: USER_ID,
      date: req.query.date,
    })
  res.render("view.ejs", { reminders: REMINDERS })
})
REMINDER_ROUTER.get("/view/:reminderID", checkOwner, async (req, res) => {
  const REMINDER = await getReminder({ _id: req.params.reminderID })
  res.render("viewReminder.ejs", { reminder: REMINDER })
})

// Error handling middleware
REMINDER_ROUTER.use((error, req, res, next) => {
  res.status(500).render("error.ejs")
})

module.exports = REMINDER_ROUTER
