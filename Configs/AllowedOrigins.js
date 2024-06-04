const allowedOrigins =
  process.env.NODE_ENV === "production"
    ? [process.env.PRODUCTION_FRONTEND_URL]
    : [process.env.TEST_FRONTEND_URL];

module.exports = allowedOrigins;
