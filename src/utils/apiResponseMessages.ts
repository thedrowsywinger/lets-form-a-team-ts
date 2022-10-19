const ApiResponseMessages = {
  SUCCESS: "Succesful",

  FAILED: "Failed",

  INVALID_JWT: "Invalid JWT. Please Include a proper JWT authorized key",
  INVALID_ACCOUNT_TYPE: "Invalid Account Type",
  INVALID_USER: "Invalid User",
  INVALID_LEAVE: "This leave entry is invalid",

  USERNAME_PASSWORD_MISMATCH:
    "This username and password combination does not match",
  USERNAME_ALREADY_EXISTS: function (username) {
    return `This username: '${username}' already exists`;
  },
  EMAIL_ALREADY_EXISTS: function (email) {
    return `This email: ' ${email} ' already exists`;
  },
  UNAUTHORIZED_ACCESS: "Current User does not have access.",
  NO_OTHER_USER_ALLOWED:
    "We are currently not allowing other types of user registration",
  NO_USERS: "There are no users at the moment",

  SYSTEM_ERROR: "Sorry, something went wrong",
  INVALID_POST_REQUEST: "Invalid POST Request",
};

export { ApiResponseMessages };