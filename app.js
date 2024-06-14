require("dotenv").config();
const mongoose = require("mongoose");
const cors = require("cors");
const corsOptions = require("./Configs/CorsOptions");
const express = require("express");
const morgan = require("morgan");
const http = require("http");
const socketIO = require("socket.io");
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
const server = http.createServer(app);
const io = socketIO(server);
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

io.on("connection", (socket) => {
  socket.emit("connection", "Connected to server");
});

db.once("open", () => {
  const port = process.env.PORT || 8080;
  server.listen(port);
});
