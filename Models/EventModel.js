const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  creatorId: {
    type: String,
    required: true,
  },
  start: {
    type: Date,
    required: true,
  },
  description: {
    type: String,
    required: false,
    default: "",
  },
});

eventSchema.statics.updateEvent = async function (
  eventId,
  title,
  start,
  description
) {
  try {
    await this.findByIdAndUpdate(eventId, {
      title,
      start,
      description,
    });
  } catch (error) {
    throw error;
  }
};

eventSchema.statics.createEvent = async function (
  _id,
  title,
  creatorId,
  start,
  description
) {
  try {
    return await this.create({
      _id,
      title,
      creatorId,
      start,
      description,
    });
  } catch (error) {
    throw error;
  }
};

eventSchema.statics.getEventById = async function (eventId) {
  try {
    return await this.findById(eventId);
  } catch (error) {
    throw error;
  }
};

eventSchema.statics.deleteEventById = async function (eventId) {
  try {
    await this.findByIdAndDelete(eventId);
  } catch (error) {
    throw error;
  }
};

const EventModel = mongoose.model("events", eventSchema);

module.exports = EventModel;
