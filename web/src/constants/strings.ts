export const strings = {
  apiError: {
    requestError: 'failed to send request',
    requestFailError: 'request failed',
    noAuthMessage: 'you need to login to access this',
    wrongAuthMessage: 'you are not authorized to access this',
    timeoutMessage: 'connection timed out. please try again later',
    networkMessage: 'could not connect with server. please check your connection',
    rateLimitMessage: 'too many requests. please try again later',
    unknownMessage: 'something went wrong. please try again later',
    genericMessage: 'an unexpected error occurred',
  },
  room: {
    roomKeyPlaceholder: 'XXXX-XXXX',
    messagePlaceholder: 'type here to chat...',
    errors: {
      roomJoinFail: 'could not join room',
      roomCreateFail: 'could not create room',
    },
  },
  auth: {
    passwordPlaceholder: 'password',
    confirmPasswordPlaceholder: 'confirm password',
    emailPlaceholder: 'email',
    displayNamePlaceholder: 'username',
    errors: {
      loginFail: 'login failed',
      registerFail: 'register failed',
    },
  },
};
