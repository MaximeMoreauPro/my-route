import { Ride } from '../../domain/Ride';
import { User } from '../../domain/User';
import { RideRepository } from '../RideRepository';

export type ViewPersonalRidesQuery = {
  user: User;
};

export class ViewPersonalRidesUseCase {
  constructor(private readonly rideRepository: RideRepository) {}

  async handle(
    viewPersonalRidesQuery: ViewPersonalRidesQuery
  ): Promise<Ride[] | { message: string }> {
    const userRides = await this.rideRepository.getRidesByUser(
      viewPersonalRidesQuery.user
    );

    if (userRides.length === 0) {
      return {
        message: 'You have no ride',
      };
    }

    const ridesSortedByDepartureTime =
      this._sortRidesByDepartureTime(userRides);

    return Promise.resolve(ridesSortedByDepartureTime);
  }

  private _sortRidesByDepartureTime(rides: Ride[]): Ride[] {
    return rides.sort(
      (a, b) => a.departureTime.getTime() - b.departureTime.getTime()
    );
  }
}
