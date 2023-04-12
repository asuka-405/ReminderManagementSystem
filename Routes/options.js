const EXPRESS = require("express")
const OPTIONS_ROUTER = EXPRESS.Router()
const DISABLE = false
const ENABLE = true
const {
  getReminder,
  modifyReminder,
  disableReminder,
  toggleReminder,
} = require("./ReminderUtils/reminder-crud.js")
const { processData } = require("./ReminderUtils/utils.js")

OPTIONS_ROUTER.get("/", async (req, res) => {
  const CUR_REMINDER = await getReminder({})
  console.log(CUR_REMINDER)
  res.render("options.ejs", { reminder: CUR_REMINDER })
})

OPTIONS_ROUTER.get("/modify/:reminderID", async (req, res) => {
  const CUR_REMINDER = await getReminder({ _id: req.params.reminderID })
  res.render("modify.ejs", { reminder: CUR_REMINDER })
})
OPTIONS_ROUTER.post("/modify/:reminderID", processData, async (req, res) => {
  await modifyReminder(req.body, req.params.reminderID)
  res.status(200).redirect(`/done`)
})

// same for delete, disable, enable

OPTIONS_ROUTER.get("/delete/:reminderID", (req, res) => {
  res.render("delete.ejs", { reminderID: req.params.reminderID })
})
OPTIONS_ROUTER.post("/delete/:reminderID", async (req, res) => {
  await deleteReminder(req.params.reminderID)
  res.status(200).redirect(`/done`)
})

OPTIONS_ROUTER.get("/disable/:reminderID", (req, res) => {
  res.render("disable.ejs", { reminderID: req.params.reminderID })
})
OPTIONS_ROUTER.post("/disable/:reminderID", async (req, res) => {
  await toggleReminder(req.params.reminderID, DISABLE)
  res.status(200).redirect(`/done`)
})

OPTIONS_ROUTER.get("/enable", (req, res) => {
  res.render("enable.ejs")
})
OPTIONS_ROUTER.post("/enable", async (req, res) => {
  await toggleReminder(req.params.reminderID, ENABLE)
  res.status(200).redirect(`/done`)
})

OPTIONS_ROUTER.use((error, req, res, next) => {
  res.status(500).render("error.ejs")
})

module.exports = OPTIONS_ROUTER
