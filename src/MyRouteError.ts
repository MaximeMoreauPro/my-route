export type MyRouteErrorCode =
  | 'SameDepartureAndDestinationTimeError'
  | 'EmptyPlaceError';

const DEFAULT_ERROR_MESSAGE: Record<MyRouteErrorCode, string> = {
  SameDepartureAndDestinationTimeError:
    'the departure and destination time must be different',
  EmptyPlaceError: 'the place must not be empty',
};

export class MyRouteError extends Error {
  code: MyRouteErrorCode;

  constructor(code: MyRouteErrorCode, message?: string) {
    super(message || DEFAULT_ERROR_MESSAGE[code]);
    this.code = code;
  }
}
