const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

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

userSchema.statics.addOwnedCalendar = async function (userId, session) {
  try {
    const calendar = await this.model("Calendars").createCalendar(
      "My Calendar",
      { session: session }
    );
    await this.findByIdAndUpdate(
      userId,
      { ownedCalendar: calendar._id },
      { session: session }
    );
  } catch (error) {
    console.log(error);
    throw error;
  }
};

userSchema.statics.addAccessibleCalendar = async function (userId, calendarId) {
  try {
    await this.findByIdAndUpdate(userId, {
      $push: { accessibleCalendars: calendarId },
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
};

userSchema.statics.removeAccessibleCalendar = async function (
  userId,
  calendarId
) {
  try {
    await this.findByIdAndUpdate(userId, {
      $pull: { accessibleCalendars: calendarId },
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
};

userSchema.statics.addApprovedEmail = async function (userId, email) {
  try {
    await this.findByIdAndUpdate(userId, {
      $push: { approvedEmailList: email },
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
};

userSchema.statics.removeApprovedEmail = async function (userId, email) {
  try {
    await this.findByIdAndUpdate(userId, {
      $pull: { approvedEmailList: email },
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
};

userSchema.statics.getAllAccessibleCalendars = async function (userId) {
  try {
    const user = await this.findById(userId);
    const calendars = [];
    for (let calendarId of user.accessibleCalendars) {
      const calendar = await this.model("Calendars").getCalendarById(
        calendarId
      );
      calendars.push(calendar);
    }
    return calendars;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

userSchema.statics.getOwnCalendar = async function (userId) {
  try {
    const user = await this.findById(userId);
    return await this.model("Calendars").getCalendarById(user.ownedCalendar);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

userSchema.statics.createUser = async function (email, password) {
  const session = await mongoose.startSession();
  try {
    if (!email || !password) {
      throw new Error("Email and password are required");
    }
    const existingUser = await this.findOne({ email });
    if (existingUser) {
      throw new Error("User already exists");
    }

    session.startTransaction();
    const encryptedPassword = await bcrypt.hash(password, 10);
    const newUser = await this.create(
      [{ email, password: encryptedPassword }],
      { session: session }
    );

    await this.addOwnedCalendar(newUser._id, session);

    await session.commitTransaction();
    return newUser;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
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

userSchema.statics.findMatchingRefreshToken = async function (rawRefreshToken) {
  try {
    const users = await this.find({ refreshToken: { $ne: null } });

    for (const user of users) {
      const match = await bcrypt.compare(rawRefreshToken, user.refreshToken);
      if (match) {
        return user;
      }
    }
    return null;
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
