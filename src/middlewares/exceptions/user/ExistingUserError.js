const CustomError = require('./CustomError');

class ExistingUserError extends CustomError {
  constructor(message) {
    super(message, 400);
    this.name = 'ExistingUserError';
  }
}

