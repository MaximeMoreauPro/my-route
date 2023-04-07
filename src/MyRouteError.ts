export type MyRouteErrorCode =
  | 'EmptyPlaceError'
  | 'DepartureTimeAfterDestinationTimeError'
  | 'PassedDepartureTimeError';

const DEFAULT_ERROR_MESSAGE: Record<MyRouteErrorCode, string> = {
  EmptyPlaceError: 'the place must not be empty',
  DepartureTimeAfterDestinationTimeError:
    'the departure time must be before the destination time',
  PassedDepartureTimeError: 'the departure time must be in the future',
};

export class MyRouteError extends Error {
  code: MyRouteErrorCode;

  constructor(code: MyRouteErrorCode, message?: string) {
    super(message || DEFAULT_ERROR_MESSAGE[code]);
    this.code = code;
  }
}
