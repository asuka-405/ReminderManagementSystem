const EXPRESS = require("express")
const FLASH = require("express-flash")
const SESSION = require("express-session")
const PASSPORT = require("passport")
const AUTH_ROUTER = require("./Routes/auth.js")
const REMINDER_ROUTER = require("./Routes/reminders.js")
const { checkAuthenticated } = require("./Routes/AuthUtils/utils.js")
const INIT_MONGOOSE = require("./initMongoose.js")
// const CRON = require("node-cron")
// const { Mailman } = require("./Routes/RemindUser/mail.js")
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config()
}

const APP = EXPRESS()
const PORT = process.env.PORT || 3000
const SESSION_SECRET = process.env.SESSION_SECRET || "secret"

// Connect to the MongoDB database
INIT_MONGOOSE()

// middleware
APP.set("view engine", "ejs")
APP.use(
  SESSION({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
)
APP.use(FLASH())
APP.use(PASSPORT.initialize())
APP.use(PASSPORT.session())
APP.use(EXPRESS.static(__dirname + "/Static"))

APP.use(EXPRESS.urlencoded({ extended: false }))
APP.use("/auth", AUTH_ROUTER)
APP.use("/reminder", REMINDER_ROUTER)

APP.get("/", checkAuthenticated, (req, res) => {
  res.render("homepage.ejs", { username: req.user.username })
})

APP.get("/done", checkAuthenticated, (req, res) => {
  res.render("transactionComplete.ejs")
})

// CRON.schedule("52 11 * * *", () => {
//   Mailman()
// })

APP.listen(PORT, () => {
  console.log(`⚡ listening on http://localhost:${PORT}`)
})
