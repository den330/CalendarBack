const mongoose = require("mongoose");
const { events } = require("./CalendarModel");

const eventSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  description: {
    type: String,
    required: false,
    default: "",
  },
});

eventSchema.statics.createEvent = async function (name, date, description) {
  try {
    return await this.create({
      name,
      date,
      description,
    });
  } catch (error) {
    console.error("Error creating an event:", error);
    throw error;
  }
};
const EventModel = mongoose.model("Events", eventSchema);

module.exports = EventModel;
