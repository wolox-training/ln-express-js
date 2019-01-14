exports.config = {
  environment: 'production',
  isProduction: true,
  common: {
    session: {
      secret: process.env.PROD_SECRET
    }
  }
};
