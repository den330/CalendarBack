const mongoose = require("mongoose");

const calendarSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  events: [
    { type: mongoose.Schema.Types.ObjectId, ref: "events", default: [] },
  ],
});

calendarSchema.statics.addEvent = async function (
  _id,
  calendar_id,
  eventId,
  title,
  creatorId,
  start,
  description
) {
  try {
    const event = await this.model("events").createEvent(
      _id,
      eventId,
      title,
      creatorId,
      start,
      description
    );
    const calendar = await this.findById(calendar_id);
    calendar.events.push(event._id);
    await calendar.save();
  } catch (error) {
    console.log(error);
    throw error;
  }
};

calendarSchema.statics.removeEvent = async function (eventId, calendarId) {
  try {
    await this.model("events").deleteEventById(eventId);
    const calendar = await this.findById(calendarId);
    calendar.events = calendar.events.filter(
      (id) => id.toString() !== eventId.toString()
    );
    await calendar.save();
  } catch (error) {
    console.log(error);
    throw error;
  }
};

calendarSchema.statics.updateEvent = async function (
  eventId,
  title,
  start,
  description
) {
  try {
    await this.model("events").updateEvent(eventId, title, start, description);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

calendarSchema.statics.removeAllEvents = async function (calendarId) {
  try {
    const calendar = await this.findById(calendarId);
    for (let eventId of calendar.events) {
      await this.model("events").deleteEventById(eventId);
    }
    calendar.events = [];
    await calendar.save();
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

calendarSchema.statics.getEvents = async function (calendarId) {
  try {
    const calendar = await this.findById(calendarId);
    const events = [];
    for (let eventId of calendar.events) {
      const event = await this.model("events").getEventById(eventId);
      events.push(event);
    }
    return events;
  } catch {
    console.error("Error getting events:", error);
    throw error;
  }
};

const CalendarModel = mongoose.model("calendars", calendarSchema);
module.exports = CalendarModel;
