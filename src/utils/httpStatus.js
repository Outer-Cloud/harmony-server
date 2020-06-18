/**
 * Constants enumerating the HTTP status codes.
 *
 * All status codes defined in RFC1945 (HTTP/1.0, RFC2616 (HTTP/1.1),
 * and RFC2518 (WebDAV) are supported.
 *
 */

const statusMessages = {};
const statusCodes = {};

//Informational 1xx (Request received, continuing process)
statusMessages[(statusCodes.CONTINUE = 100)] = "Continue";
statusMessages[(statusCodes.SWITCHING_PROTOCOLS = 101)] = "Switching Protocols";
statusMessages[(statusCodes.PROCESSING = 102)] = "Processing";

// Successful 2xx (The action was successfully received, understood, and accepted)
statusMessages[(statusCodes.OK = 200)] = "OK";
statusMessages[(statusCodes.CREATED = 201)] = "Created";
statusMessages[(statusCodes.ACCEPTED = 202)] = "Accepted";
statusMessages[(statusCodes.NON_AUTHORITATIVE_INFORMATION = 203)] =
  "Non Authoritative Information";
statusMessages[(statusCodes.NO_CONTENT = 204)] = "No Content";
statusMessages[(statusCodes.RESET_CONTENT = 205)] = "Reset Content";
statusMessages[(statusCodes.PARTIAL_CONTENT = 206)] = "Partial Content";
statusMessages[(statusCodes.MULTI_STATUS = 207)] = "Multi-Status";

// Redirection 3xx (Further action must be taken in order to complete the request)
statusMessages[(statusCodes.MULTIPLE_CHOICES = 300)] = "Multiple Choices";
statusMessages[(statusCodes.MOVED_PERMANENTLY = 301)] = "Moved Permanently";
statusMessages[(statusCodes.MOVED_TEMPORARILY = 302)] = "Moved Temporarily";
statusMessages[(statusCodes.SEE_OTHER = 303)] = "See Other";
statusMessages[(statusCodes.NOT_MODIFIED = 304)] = "Not Modified";
statusMessages[(statusCodes.USE_PROXY = 305)] = "Use Proxy";
statusMessages[(statusCodes.TEMPORARY_REDIRECT = 307)] = "Temporary Redirect";

// Client Error 4xx (The request contains bad syntax or cannot be fulfilled)
statusMessages[(statusCodes.BAD_REQUEST = 400)] = "Bad Request";
statusMessages[(statusCodes.UNAUTHORIZED = 401)] = "Unauthorized";
statusMessages[(statusCodes.PAYMENT_REQUIRED = 402)] = "Payment Required";
statusMessages[(statusCodes.FORBIDDEN = 403)] = "Forbidden";
statusMessages[(statusCodes.NOT_FOUND = 404)] = "Not Found";
statusMessages[(statusCodes.METHOD_NOT_ALLOWED = 405)] = "Method Not Allowed";
statusMessages[(statusCodes.NOT_ACCEPTABLE = 406)] = "Not Acceptable";
statusMessages[(statusCodes.PROXY_AUTHENTICATION_REQUIRED = 407)] =
  "Proxy Authentication Required";
statusMessages[(statusCodes.REQUEST_TIMEOUT = 408)] = "Request Timeout";
statusMessages[(statusCodes.CONFLICT = 409)] = "Conflict";
statusMessages[(statusCodes.GONE = 410)] = "Gone";
statusMessages[(statusCodes.LENGTH_REQUIRED = 411)] = "Length Required";
statusMessages[(statusCodes.PRECONDITION_FAILED = 412)] = "Precondition Failed";
statusMessages[(statusCodes.REQUEST_TOO_LONG = 413)] =
  "Request Entity Too Large";
statusMessages[(statusCodes.REQUEST_URI_TOO_LONG = 414)] =
  "Request-URI Too Long";
statusMessages[(statusCodes.UNSUPPORTED_MEDIA_TYPE = 415)] =
  "Unsupported Media Type";
statusMessages[(statusCodes.REQUESTED_RANGE_NOT_SATISFIABLE = 416)] =
  "Requested Range Not Satisfiable";
statusMessages[(statusCodes.EXPECTATION_FAILED = 417)] = "Expectation Failed";
statusMessages[(statusCodes.INSUFFICIENT_SPACE_ON_RESOURCE = 419)] =
  "Insufficient Space on Resource";
statusMessages[(statusCodes.METHOD_FAILURE = 420)] = "Method Failure";
statusMessages[(statusCodes.UNPROCESSABLE_ENTITY = 422)] =
  "Unprocessable Entity";
statusMessages[(statusCodes.LOCKED = 423)] = "Locked";
statusMessages[(statusCodes.FAILED_DEPENDENCY = 424)] = "Failed Dependency";
statusMessages[(statusCodes.PRECONDITION_REQUIRED = 428)] =
  "Precondition Required";
statusMessages[(statusCodes.TOO_MANY_REQUESTS = 429)] = "Too Many Requests";
statusMessages[(statusCodes.REQUEST_HEADER_FIELDS_TOO_LARGE = 431)] =
  "Request Header Fields Too Large";

// Server Error 5xx (The server failed to fulfill an apparently valid request)
statusMessages[(statusCodes.INTERNAL_SERVER_ERROR = 500)] = "Server Error";
statusMessages[(statusCodes.NOT_IMPLEMENTED = 501)] = "Not Implemented";
statusMessages[(statusCodes.BAD_GATEWAY = 502)] = "Bad Gateway";
statusMessages[(statusCodes.SERVICE_UNAVAILABLE = 503)] = "Service Unavailable";
statusMessages[(statusCodes.GATEWAY_TIMEOUT = 504)] = "Gateway Timeout";
statusMessages[(statusCodes.HTTP_VERSION_NOT_SUPPORTED = 505)] =
  "HTTP Version Not Supported";
statusMessages[(statusCodes.INSUFFICIENT_STORAGE = 507)] =
  "Insufficient Storage";
statusMessages[(statusCodes.NETWORK_AUTHENTICATION_REQUIRED = 511)] =
  "Network Authentication Required";

const getStatusText = (statusCode) => {
  if (statusMessages.hasOwnProperty(statusCode)) {
    return statusMessages[statusCode];
  } else {
    throw new Error("Status code does not exist: " + statusCode);
  }
};

module.exports = {
  statusCodes,
  getStatusText,
};
