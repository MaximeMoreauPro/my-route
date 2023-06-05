import { Ride } from '../../domain/Ride';
import { User } from '../../domain/User';
import { RideRepository } from '../RideRepository';

export type ViewUserRidesQuery = {
  user: User;
};

export class ViewUserRidesUseCase {
  constructor(private readonly rideRepository: RideRepository) {}

  async handle(
    viewUserRidesQuery: ViewUserRidesQuery
  ): Promise<Ride[] | { message: string }> {
    const userRides = await this.rideRepository.getRidesByUser(
      viewUserRidesQuery.user
    );

    if (userRides.length === 0) {
      return {
        message: 'There is no ride',
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
