import * as path from 'path';
import * as fs from 'fs';

import { RideRepository } from './RideRepository';
import { Ride } from './Ride';

const RIDE_FILE = path.join(__dirname, 'ride.json');
export class FileSystemRideRepository implements RideRepository {
  async save(rideToSave: Ride): Promise<void> {
    return fs.promises.writeFile(RIDE_FILE, JSON.stringify(rideToSave));
  }

  async getRidesByUser(user: string): Promise<Ride[]> {
    const userRides = [];

    const ride = await fs.promises.readFile(RIDE_FILE);
    userRides.push(JSON.parse(ride.toString()) as Ride);
    return userRides;
  }
}
