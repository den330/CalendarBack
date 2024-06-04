const allowedOrigins =
  NODE.ENV === "production"
    ? [NODE.ENV.PRODUCTION_FRONTEND_URL]
    : [NODE.ENV.TEST_FRONTEND_URL];
