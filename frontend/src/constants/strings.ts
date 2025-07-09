export const strings = {
  errors: {
    genericError: 'an unexpected error occurred',
    notAuth: 'you are not authorized to access this page',
    serverError: 'something went wrong. please try again later',
  },
  room: {
    roomKeyPlaceholder: 'XXXX-XXXX',
    messagePlaceholder: 'type here to chat...',
    errors: {
      regex: 'must follow c1A0-Df23 format',
      alreadyFull: 'room already full',
      notFound: 'room not found',
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
      couldNotFetchProfile: 'could not fetch profile',
      loginFail: 'login failed',
      registerFail: 'register failed',
    },
  },
};
