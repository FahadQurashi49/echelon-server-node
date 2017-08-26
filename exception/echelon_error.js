
function EcheloError(statusCode, message, errorCode) {
    this.message = message;
    this.statusCode = statusCode;
    this.errorCode = errorCode;
}

module.exports = EcheloError;