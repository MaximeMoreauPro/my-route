import { Ride } from '../domain/Ride';

export interface RideRepository {
  save: (ride: Ride) => Promise<void>;
  getRidesByUser(userId: string): Promise<Ride[]>;
}
