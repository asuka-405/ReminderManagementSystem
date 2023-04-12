const REMINDER = require("../../Models/reminderSchema.js")
const { getUser } = require("../AuthUtils/utils.js")

module.exports = {
  setReminder,
  getReminder,
  getReminderAll,
  modifyReminder,
  checkOwner,
  toggleReminder,
  deleteReminder,
}

// function to set reminder based on reminderSchema
async function setReminder(reminderData) {
  try {
    // Create new reminder and save it to the database
    const newReminder = new REMINDER(reminderData)
    await saveReminder(newReminder)
  } catch (error) {
    throw error
  }
}

async function modifyReminder(reminderData, reminderID) {
  try {
    updateReminder({ _id: reminderID }, reminderData)
  } catch (error) {
    throw error
  }
}

async function toggleReminder(reminderID, toggleValue) {
  try {
    await updateReminder({ _id: reminderID }, { enabled: toggleValue })
  } catch (error) {
    throw error
  }
}

async function deleteReminder(reminderID) {
  try {
    await deleteReminder({ _id: reminderID })
  } catch (error) {
    throw error
  }
}

async function deleteReminder(condition) {
  return await REMINDER.findOneAndDelete(condition)
}

async function saveReminder(reminder) {
  return reminder.save()
}

async function updateReminder(condition, updateData) {
  return REMINDER.findOneAndUpdate(condition, updateData)
}

async function getReminder(param) {
  return REMINDER.findOne(param)
}
async function getReminderAll(param) {
  return await REMINDER.find(param)
}

async function checkOwner(req, res, next) {
  const reminderID = req.params.reminderID
  const userID = req.user._id
  const REMINDER = (await getReminder({ _id: reminderID })).user
  const USER = (await getUser({ _id: userID }))._id

  if (!REMINDER || !USER) return res.status(404).render("error.ejs")

  if (!REMINDER.equals(USER)) {
    return res
      .status(401)
      .send("Unauthorised | You are not the owner of this reminder")
  }
  return next()
}
