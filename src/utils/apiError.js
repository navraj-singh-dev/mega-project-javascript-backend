class ApiError extends Error {
  constructor(
    statusCode,
    message = "Something Went Wrong",
    errors = [],
    stack = ""
  ) {
    super(message); // calls the constructor function of NodeJS Error class.
    this.statusCode = statusCode;
    this.message = message;
    this.errors = errors;
    this.success = false;
    this.data = null;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export { ApiError };
