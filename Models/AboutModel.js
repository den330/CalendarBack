const mongoose = require("mongoose");

const aboutSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true,
    default: "Initial Page Message",
  },
});

aboutSchema.statics.updateMessage = async function (message) {
  try {
    const updatedAbout = await this.findOneAndUpdate(
      {},
      { message: message },
      {
        new: true,
        upsert: true,
      }
    );
    return updatedAbout;
  } catch (error) {
    throw error;
  }
};

aboutSchema.statics.createSingleton = async function () {
  try {
    const existing = await this.findOne();
    if (existing) return existing;
    const about = await this.create({});
    return about;
  } catch (error) {
    throw error;
  }
};

aboutSchema.statics.getCurrentMessage = async function () {
  try {
    const about = await this.findOne();
    if (!about) {
      throw new Error("No about instance found");
    }
    return about.message;
  } catch (error) {
    throw error;
  }
};

const AboutModel = mongoose.model("about", aboutSchema);
AboutModel.createSingleton();
module.exports = AboutModel;
