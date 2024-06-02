const mongoose = require("mongoose");

const calendarSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  events: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Events", default: [] },
  ],
});

calendarSchema.methods.addEvent = async function (event) {
  try {
    this.events.push(event._id);
    await this.save();
  } catch (error) {
    console.log(error);
    throw error;
  }
};

calendarSchema.methods.removeEvent = async function (eventId) {
  try {
    this.events = this.events.filter(
      (id) => id.toString() !== eventId.toString()
    );
    await this.save();
  } catch (error) {
    console.log(error);
    throw error;
  }
};

calendarSchema.methods.removeAllEvents = async function () {
  try {
    this.events = [];
    await this.save();
  } catch (error) {
    console.log(error);
    throw error;
  }
};

calendarSchema.statics.createCalendar = async function (name) {
  try {
    return await this.create({
      name,
    });
  } catch (error) {
    console.error("Error creating a calendar:", error);
    throw error;
  }
};

calendarSchema.statics.getCalendarById = async function (calendarId) {
  try {
    return await this.findById(calendarId);
  } catch (error) {
    console.error("Error getting a calendar:", error);
    throw error;
  }
};

const CalendarModel = mongoose.model("Calendars", calendarSchema);
module.exports = CalendarModel;
