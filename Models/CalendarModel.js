const mongoose = require("mongoose");

const calendarSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  events: [{ type: mongoose.Schema.Types.ObjectId, ref: "Events" }],
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

const CalendarModel = mongoose.model("Calendars", calendarSchema);
module.exports = CalendarModel;
