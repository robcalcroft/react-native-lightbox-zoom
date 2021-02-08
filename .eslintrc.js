module.exports = {
  extends: ["airbnb", "prettier", "prettier/react"],
  plugins: ["prettier"],
  env: {
    browser: true,
    jest: true,
  },
  rules: {
    "prettier/prettier": 2,
    "react/jsx-filename-extension": 0,
  },
  globals: {
    // For puppeteer tests
    page: true,
  },
};
