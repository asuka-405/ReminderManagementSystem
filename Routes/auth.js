const EXPRESS = require("express")
const PASSPORT = require("passport")
const {
  checkNotAuthenticated,
  registerProcess,
} = require("./AuthUtils/utils.js")
const { initPassport } = require("./AuthUtils/passport-config.js")

initPassport(PASSPORT)

const AUTH_ROUTER = EXPRESS.Router()

// Login and register pages and post routes
AUTH_ROUTER.get("/login", checkNotAuthenticated, (req, res) => {
  res.render("login.ejs")
})

AUTH_ROUTER.post(
  "/login",
  checkNotAuthenticated,
  PASSPORT.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/auth/error",
    failureFlash: true,
  })
)

AUTH_ROUTER.get("/error", (req, res) => {
  res.render("loginFailed.ejs")
})

AUTH_ROUTER.get("/register", checkNotAuthenticated, (req, res) => {
  res.render("register.ejs")
})

AUTH_ROUTER.post("/register", checkNotAuthenticated, async (req, res) => {
  try {
    const CREATED_USER = await registerProcess({
      username: req.body.username,
      password: req.body.password,
    })
    if (!CREATED_USER) return res.redirect("/auth/error")
    res.redirect("/auth/login")
  } catch (error) {
    res.redirect("/auth/error", { message: "Something went wrong" })
  }
})

// Logged out page
AUTH_ROUTER.get("/loggedOut", (req, res) => {
  res.render("loggedOut.ejs")
})

// Logout route
AUTH_ROUTER.post("/logout", (req, res, next) => {
  req.logout((error) => {
    if (error) {
      return next(error)
    }
  })
  res.redirect("/auth/loggedOut")
})

// Error handling middleware
AUTH_ROUTER.use((error, req, res, next) => {
  res.status(500).render("loginFailed.ejs")
})

module.exports = AUTH_ROUTER
