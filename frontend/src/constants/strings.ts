export const strings = {
  apiError: {
    requestError: 'failed to send request',
    requestFailError: 'request failed',
    noAuthMessage: 'you need to login to access this',
    wrongAuthMessage: 'you are not authorized to access this page',
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
      regex: 'must follow c1A0-Df23 format',
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
      invalidEmail: 'enter a valid email address',
      invalidPassword: {
        lowerCaseCharacter: 'password must contain at least one lowercase letter',
        upperCaseCharacter: 'password must contain at least one uppercase letter',
        number: 'password must contain at least one number',
        maxLength: 'password must be at most 16 characters long',
        minLength: 'password must be at least 8 characters long',
      },
      invalidDisplayName: 'display name is required',
      nonMatchingPassword: 'passwords do not match',
      loginFail: 'login failed',
      registerFail: 'register failed',
    },
  },
};
