require("dotenv").config();
const mongoose = require("mongoose");
const cors = require("cors");
const corsOptions = require("./Configs/CorsOptions");
const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const signupRoute = require("./Routes/SignUpRoute");
const loginRoute = require("./Routes/LoginRoute");
const userRoute = require("./Routes/UserRoute");
const calendarRoute = require("./Routes/CalendarRoute");
const logoutRoute = require("./Routes/LogoutRoute");
const googleAuthRoute = require("./Routes/GoogleAuthRoute");
const verifyAndUpdateJWT = require("./Middleware/VerifyAndUpdateJWT");
require("./Models/UserModel");
require("./Models/CalendarModel");
require("./Models/EventModel");

mongoose.connect(`${process.env.dbUrl}`);
const db = mongoose.connection;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("dev"));
app.use(cors(corsOptions));
app.use("/signup", signupRoute);
app.use("/login", loginRoute);
app.use("/googleAuth", googleAuthRoute);

app.use(verifyAndUpdateJWT);
app.use("/logout", logoutRoute);
app.get("/logInStatus", (req, res) => {
  if (req.userId) {
    res.status(200).json({ logInStatus: true, userId: req.userId });
  } else {
    res.status(200).json({ logInStatus: false });
  }
});
app.use("/user", userRoute);
app.use("/calendar", calendarRoute);
app.use((err, req, res, next) => {
  res.status(500).json({ message: err.message });
});

db.once("open", () => {
  console.log("db connected");
  const port = process.env.PORT || 8080;
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
});
