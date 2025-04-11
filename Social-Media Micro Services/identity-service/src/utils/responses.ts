export const Responces = {
  INCOMPLETE_INFORMATION: 422,
  TOO_MANY_RQSTS: 429,
  BAD_REQUEST: 400,
  CONFLICT_ERROR: 409,
  NOT_FOUND: 404,
  FORBIDDEN: 403,
  REQUEST_TIME_OUT: 408,
  CREATED: 201,
  SUCCESS: 200,
  LOGOUT: 204,
  UNAUTHORIZED: 401,
  INTERNAL_SERVER_ERROR: 500,
}

export const Messages = {
  INCOMPLETE_INFORMATION: 'Incomplete Information!',
  TOO_MANY_RQSTS: 'Too Many Requests',
  BAD_REQUEST: 'Bad Request!',
  CONFLICT_ERROR: 'Already Exist!',
  NOT_FOUND: 'User Not Found!',
  FORBIDDEN: 'The server refuses to authorize the request!',
  REQUEST_TIME_OUT: 'The server timed out!',
  CREATED: 'Successfully created!',
  SUCCESS: 'Success!',
  LOGOUT: 'Successfully logout!',
  UNAUTHORIZED: 'Unauthorized!',
  SESSION_EXPIRED: 'Your session has expired. Please log in again.',
}
