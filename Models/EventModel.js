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
  },
});

eventSchema.statics.createEvent = async function (name, date, description) {
  try {
    const event = new this({
      name,
      date,
      description,
    });

    await event.save();
  } catch (error) {
    console.error("Error creating an event:", error);
    throw error;
  }
};
const EventModel = mongoose.model("Events", eventSchema);

module.exports = EventModel;
