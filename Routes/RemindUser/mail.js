const { getUser } = require("../AuthUtils/utils.js")
const { getReminderAll } = require("../ReminderUtils/reminder-crud.js")
const NODEMAILER = require("nodemailer")
if (process.env.NODE_ENV !== "production") require("dotenv").config()

module.exports = { Mailman }

const TRANSPORTER = NODEMAILER.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_ID,
    pass: process.env.EMAIL_PASSWORD,
  },
})

async function Mailman() {
  // Get all reminders for today
  try {
    const date = new Date().toISOString().substring(0, 10)
    const reminders = await getReminderAll({ date })
    // Loop through each reminder and send an email to the user
    for (const reminder of reminders) {
      const user = await getUser({ _id: reminder.user })
      if (!reminder.email) continue
      // Compose the email message
      const message = {
        from: process.env.EMAIL_ID,
        to: reminder.email,
        subject: "Reminder for today",
        text: `Hello ${user.username},\n\nThis is a friendly reminder that you have a task to do today: ${reminder.subject}.\n\nBest regards,\nYour reminder app`,
      }

      console.log(message)

      // Send the email
      await TRANSPORTER.sendMail(message)
    }
  } catch (error) {
    console.error(error)
    return new Error("Something went wrong while sending reminder emails!")
  }
}
