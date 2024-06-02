require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const signupRoute = require("./Routes/SignUpRoute");
const loginRoute = require("./Routes/LoginRoute");
const userRoute = require("./Routes/UserRoute");
const calendarRoute = require("./Routes/CalendarRoute");

mongoose.connect(`${process.env.dbUrl}`);
const db = mongoose.connection;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("dev"));

app.use("/signup", signupRoute);
app.use("/login", loginRoute);
app.use("/user", userRoute);
app.use("/calendar", calendarRoute);
app.use((err, req, res, next) => {
  res.status(500).json({ message: err.message });
});

db.once("open", () => {
  console.log("db connected");
  app.listen(3000);
});
