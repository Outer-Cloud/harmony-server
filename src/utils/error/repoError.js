module.exports = [
  "httpStatus",
  (httpStatus) => {
    return {
      getRepoError: (err) => {
        const codes = httpStatus.statusCodes;

        if (err.name === "MongoError" && err.code === 11000) {
          return {
            status: codes.BAD_REQUEST,
            message: err.message,
          };
        }

        if (err.name === "ValidationError") {
          return {
            status: codes.BAD_REQUEST,
            message: err.message,
          };
        }
        return null;
      },
    };
  },
];
