const LocalStrategy = require("passport-local").Strategy
const { matchPassword, getUser } = require("./utils.js")

module.exports = { initPassport }

async function authenticateUser(username, password, done) {
  try {
    const USER = await getUser({ username })
    if (!USER)
      return done(null, false, { message: "No user with that username" })

    const passwordMatches = matchPassword(password, USER.password)
    if (passwordMatches) return done(null, USER)
    else return done(null, false, { message: "Password incorrect" })
  } catch (error) {
    done(error)
  }
}

function initPassport(passport) {
  passport.use(
    "local",
    new LocalStrategy({ usernameField: "username" }, authenticateUser)
  )

  passport.serializeUser((user, done) => {
    done(null, user._id)
  })

  passport.deserializeUser(async (_id, done) => {
    const user = await getUser({ _id })
    done(null, user)
  })
}
