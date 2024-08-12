class ResponseService {
  static success(res, data) {
    res.status(200).json({
      status: 'success',
      data
    });
  }

  static error(res, message, statusCode = 500) {
    res.status(statusCode).json({
      status: 'error',
      message
    });
  }
}

module.exports = ResponseService;
