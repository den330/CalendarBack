const mongoose = require("mongoose");
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
    default: "",
  },
  ownedCalendar: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "calendars",
  },
  accessibleCalendars: [
    { type: mongoose.Schema.Types.ObjectId, ref: "calendars", default: [] },
  ],
  refreshToken: {
    type: String,
    default: "",
  },
});

userSchema.statics.addOwnedCalendar = async function (userId, session) {
  try {
    const user = await this.findById(userId).session(session);
    const userEmail = user.email;
    const emailPars = userEmail.split("@");
    const firstPart = emailPars[0];
    const calendar = await this.model("calendars").createCalendar(
      `${firstPart}'s calendar`,
      { session: session }
    );
    const result = await this.findByIdAndUpdate(
      userId,
      { ownedCalendar: calendar._id },
      { session: session }
    );
  } catch (error) {
    throw error;
  }
};

userSchema.statics.addAccessibleCalendar = async function (userId, calendarId) {
  try {
    await this.findByIdAndUpdate(userId, {
      $push: { accessibleCalendars: calendarId },
    });
  } catch (error) {
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
    throw error;
  }
};

userSchema.statics.addApprovedEmail = async function (userId, email) {
  try {
    const user = await this.findById(userId);
    if (user.approvedEmailList.includes(email)) {
      throw new Error("Email already approved");
    }
    if (user.email === email) {
      throw new Error("Cannot approve own email");
    }
    user.approvedEmailList.push(email);
    await user.save();
    const calendarId = user.ownedCalendar._id;
    await this.findOneAndUpdate(
      { email: email },
      { $push: { accessibleCalendars: calendarId } }
    );
  } catch (error) {
    throw error;
  }
};

userSchema.statics.removeApprovedEmail = async function (userId, email) {
  try {
    const user = await this.findById(userId);
    user.approvedEmailList = user.approvedEmailList.filter(
      (approvedEmail) => approvedEmail !== email
    );
    await user.save();
    const calendarId = user.ownedCalendar._id;
    await this.findOneAndUpdate(
      { email: email },
      { $pull: { accessibleCalendars: calendarId } }
    );
  } catch (error) {
    throw error;
  }
};

userSchema.statics.getAllAccessibleCalendars = async function (userId) {
  try {
    const user = await this.findById(userId);
    const calendars = [];
    for (let calendarId of user.accessibleCalendars) {
      const calendar = await this.model("calendars").getCalendarById(
        calendarId
      );
      calendars.push(calendar);
    }
    return calendars;
  } catch (error) {
    throw error;
  }
};

userSchema.statics.getOwnCalendar = async function (userId) {
  try {
    const user = await this.findById(userId);
    return await this.model("calendars").getCalendarById(user.ownedCalendar);
  } catch (error) {
    throw error;
  }
};

class ErrorWithCode extends Error {
  constructor(message, code) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
  }
}

userSchema.statics.createUser = async function (
  email,
  password,
  requirePassword
) {
  const session = await mongoose.startSession();
  try {
    if (!email || (!password && requirePassword)) {
      throw new Error("Email and password are required");
    }
    const existingUser = await this.findOne({ email });
    if (existingUser) {
      throw new ErrorWithCode("User already exists", 409);
    }

    session.startTransaction();
    const encryptedPassword = requirePassword
      ? await bcrypt.hash(password, 10)
      : "";
    const newUserArr = await this.create(
      [{ email: email, password: encryptedPassword }],
      { session: session }
    );
    const newUser = newUserArr[0];
    const users = await this.find({ approvedEmailList: email }).session(
      session
    );
    let idList = [];
    for (let user of users) {
      const ownCalendarId = user.ownedCalendar._id;
      idList.push(ownCalendarId);
    }
    newUser.accessibleCalendars = idList;
    await newUser.save({ session: session });
    await this.addOwnedCalendar(newUser._id, session);

    await session.commitTransaction();
    return newUser;
  } catch (error) {
    if (session.inTransaction()) {
      await session.abortTransaction();
    }
    throw error;
  } finally {
    session.endSession();
  }
};

userSchema.statics.login = async function (email, password, requirePassword) {
  try {
    const user = await this.findOne({ email });
    if (!user) {
      throw new Error("User not found");
    }

    if (requirePassword) {
      const isPasswordCorrect = await bcrypt.compare(password, user.password);
      if (!isPasswordCorrect) {
        throw new Error("Password is incorrect");
      }
    }
    return user;
  } catch (error) {
    throw error;
  }
};

userSchema.statics.findMatchingRefreshToken = async function (refreshToken) {
  try {
    return await this.findOne({ refreshToken });
  } catch (error) {
    throw error;
  }
};

userSchema.statics.getUserById = async function (userId) {
  try {
    return await this.findById(userId);
  } catch (error) {
    throw error;
  }
};

const UserModel = mongoose.model("users", userSchema);
module.exports = UserModel;
