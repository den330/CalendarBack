const allowedOrigins = require("./AllowedOrigins");

const corsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      console.log("Origins allowed: ", allowedOrigins);
      callback(null, true);
    } else {
      console.log(
        `Cors failed, incoming origin: ${origin}, allowed origins: ${allowedOrigins}`
      );
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  optionSuccessStatus: 200,
  allowedHeaders: ["Content-Type", "Authorization"],
};

module.exports = corsOptions;
