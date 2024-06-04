const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  creatorId: {
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

eventsSchema.statics.updateEvent = async function (
  eventId,
  name,
  date,
  description
) {
  try {
    await this.findByIdAndUpdate(eventId, {
      name,
      date,
      description,
    });
  } catch (error) {
    console.error("Error updating an event:", error);
    throw error;
  }
};

eventSchema.statics.createEvent = async function (
  name,
  creatorId,
  date,
  description
) {
  try {
    return await this.create({
      name,
      creatorId,
      date,
      description,
    });
  } catch (error) {
    console.error("Error creating an event:", error);
    throw error;
  }
};

eventSchema.statics.getEventById = async function (eventId) {
  try {
    return await this.findById(eventId);
  } catch (error) {
    console.error("Error getting an event:", error);
    throw error;
  }
};

eventSchema.statics.deleteEventById = async function (eventId) {
  try {
    await this.findByIdAndDelete(eventId);
  } catch (error) {
    console.error("Error deleting an event:", error);
    throw error;
  }
};

const EventModel = mongoose.model("events", eventSchema);

module.exports = EventModel;
