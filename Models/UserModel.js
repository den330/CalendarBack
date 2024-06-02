const mongoose = require("mongoose");
const CalendarModel = require("./CalendarModel");
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
  refreshToken: {
    type: String,
    default: "",
  },
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

userSchema.methods.addAccessibleCalendar = async function (calendarId) {
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
    await this.model("User").updateMany(
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
    await this.model("User").updateMany(
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

userSchema.methods.getOwnCalendar = async function () {
  try {
    const calendar = await CalendarModel.findById(this.ownedCalendar);
    return calendar;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

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
    if (!newUser.ownedCalendar) {
      await newUser.addOwnedCalendar();
    }
    const otherUsers = await this.model("User").find({
      approvedEmailList: newUser.email,
    });
    for (let otherUser of otherUsers) {
      await newUser.addAccessibleCalendar(otherUser.ownedCalendar._id);
    }
    return newUser;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

userSchema.statics.login = async function (email, password) {
  try {
    const user = await this.findOne({ email });
    if (!user) {
      throw new Error("User not found");
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      throw new Error("Password is incorrect");
    }
    return user;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

userSchema.statics.getUserById = async function (userId) {
  try {
    return await this.findById(userId);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const UserModel = mongoose.model("Users", userSchema);
module.exports = UserModel;
