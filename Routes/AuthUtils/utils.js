const USER = require("../../Models/userSchema.js")

module.exports = {
  checkAuthenticated,
  checkNotAuthenticated,
  registerProcess,
  getUser,
  matchPassword,
}

// Function to check if user is authenticated
function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  } else {
    res.redirect("/auth/login")
  }
}

// Function to check if user is not authenticated
function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect("/")
  } else {
    return next()
  }
}

// Function to compare passwords
function matchPassword(password, savedPassword) {
  return password === savedPassword
}

// Function to register a user
async function registerProcess({ username, password }) {
  try {
    // Check if user already exists
    const existingUser = await getUser({ username })
    if (existingUser) return undefined

    // Create new user and save it to the database
    const newUser = new USER({ username, password })
    await saveUser(newUser)
    return newUser
  } catch (error) {
    throw error
  }
}

async function getUser(param) {
  return await USER.findOne(param)
}

async function saveUser(user) {
  await user.save()
}

// async function checkUser(req, res, next) {
//   const REMINDER_OWNER = (await getUser({ username: req.params.username }))._id

//   // console.log(req.user._id.equals(REMINDER_OWNER))

//   // If the user ID matches, call the next middleware function
//   if (req.user._id.equals(REMINDER_OWNER)) return next()

//   return res.status(403).json({ error: "Access denied" })
// }
