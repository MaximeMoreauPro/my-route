import { RideData } from '@/domain/Ride.js';
import { User } from '@/domain/User.js';

export interface RideRepository {
  postRide: (ride: RideData) => Promise<void>;
  getRidesPostedByDriver(userId: string): Promise<RideData[]>;
  getRidesBookedByPassenger(userId: string): Promise<RideData[]>;
  bookRide(params: { user: User; ride: RideData }): Promise<void>;
}
