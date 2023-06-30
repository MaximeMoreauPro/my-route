import { Ride } from '../../domain/Ride';
import { User } from '../../domain/User';
import { RideRepository } from '../RideRepository';

export type ViewUserRidesQuery = {
  user: User;
};

export class ViewUserRidesUseCase {
  constructor(private readonly rideRepository: RideRepository) {}

  async handle({
    user,
  }: ViewUserRidesQuery): Promise<Ride[] | { message: string }> {
    try {
      const userRides = await this.rideRepository.getRidesByUser(user);

      if (userRides.length === 0) {
        return {
          message: `${user} has no ride`,
        };
      }

      const ridesSortedByDepartureTime =
        this._sortRidesByDepartureTime(userRides);

      return Promise.resolve(ridesSortedByDepartureTime);
    } catch (e) {
      console.error(e);
      return {
        message: `${user}'s rides cannot be fetched. Please try later`,
      };
    }
  }

  private _sortRidesByDepartureTime(rides: Ride[]): Ride[] {
    return rides.sort((a, b) => a.departureTime.localeCompare(b.departureTime));
  }
}
