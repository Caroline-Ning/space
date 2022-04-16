const okta = require("@okta/okta-sdk-nodejs");

const client = new okta.Client({
  orgUrl: "https://dev-42183088.okta.com",
  token: "005MV15uHFpMExws-_WwSjyJQgE6ALZMBYNe3LUDu5",
});

module.exports = { client };
