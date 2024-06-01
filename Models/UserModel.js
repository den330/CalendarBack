const mongoose = require("mongoose");
const CalendarModel = require("./CalendarModel");
const User = require("./UserModel");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  approvedEmailList: [{ type: String, default: [] }],
  password: {
    type: String,
    required: true,
  },
  ownedCalendar: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Calendars",
  },
  accessibleCalendars: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Calendars", default: [] },
  ],
});

userSchema.methods.addOwnedCalendar = async function () {
  try {
    const calendar = await CalendarModel.create({
      name: `My Calendar: ${this.email}`,
    });
    this.ownedCalendar = calendar._id;
    await this.save();
  } catch (error) {
    console.log(error);
    throw error;
  }
};

userSchema.userSchema.methods.addAccessibleCalendar = async function (
  calendarId
) {
  try {
    this.accessibleCalendars.push(calendarId);
    await this.save();
  } catch (error) {
    console.log(error);
    throw error;
  }
};

userSchema.methods.removeAccessibleCalendar = async function (calendarId) {
  try {
    this.accessibleCalendars = this.accessibleCalendars.filter(
      (id) => id.toString() !== calendarId.toString()
    );
    await this.save();
  } catch (error) {
    console.log(error);
    throw error;
  }
};

userSchema.methods.addApprovedEmail = async function (email) {
  try {
    this.approvedEmailList.push(email);
    await User.updateMany(
      { email: email },
      { $push: { accessibleCalendars: this.ownedCalendar } }
    );
    await this.save();
  } catch (error) {
    console.log(error);
    throw error;
  }
};

userSchema.methods.removeApprovedEmail = async function (email) {
  try {
    this.approvedEmailList = this.approvedEmailList.filter(
      (approvedEmail) => approvedEmail !== email
    );
    await User.updateMany(
      { email: email },
      { $pull: { accessibleCalendars: this.ownedCalendar } }
    );
    await this.save();
  } catch (error) {
    console.log(error);
    throw error;
  }
};

userSchema.methods.getAllAccessibleCalendars = async function () {
  try {
    const calendars = await CalendarModel.find({
      _id: { $in: this.accessibleCalendars },
    });
    return calendars;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

userSchema.post("save", async function () {
  console.log("user save post called");
  try {
    if (!this.ownedCalendar) {
      await this.addOwnedCalendar();
    }
    if (this.isModified("email")) {
      const otherUsers = await User.find({ approvedEmailList: this.email });
      for (let otherUser of otherUsers) {
        await this.addAccessibleCalendar(otherUser.ownedCalendar._id);
      }
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
});

userSchema.statics.createUser = async function (email, password) {
  try {
    if (!email || !password) {
      throw new Error("Email and password are required");
    }
    if (await this.findOne({ email })) {
      throw new Error("User already exists");
    }
    const encryptedPassword = await bcrypt.hash(password, 10);
    const newUser = await this.create({ email, password: encryptedPassword });
    return newUser;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const UserModel = mongoose.model("Users", userSchema);

module.exports = UserModel;
