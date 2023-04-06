export type PostRideCommand = {
  driver: string;
  departurePlace: string;
  departureTime: Date;
  destinationPlace: string;
  destinatioTime: Date;
};

export type Ride = {
  driver: string;
  departurePlace: string;
  departureTime: Date;
  destinationPlace: string;
  destinatioTime: Date;
  postedAt: Date;
};

export class PostRideUseCase {
  constructor(
    private readonly saveRide: (ride: Ride) => void,
    private readonly getNow: () => Date
  ) {}

  handle(postRideCommand: PostRideCommand) {
    this.saveRide({ ...postRideCommand, postedAt: this.getNow() });
  }
}
