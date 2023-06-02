import * as path from 'path';
import * as fs from 'fs';

import { RideRepository } from '../../application/RideRepository';
import { Ride } from '../../domain/Ride';

const RIDE_FILE = path.join(__dirname, 'ride.json');

export class FileSystemRideRepository implements RideRepository {
  async save(rideToSave: Ride): Promise<void> {
    return fs.promises.writeFile(RIDE_FILE, JSON.stringify(rideToSave.data));
  }

  async getRidesByUser(user: string): Promise<Ride[]> {
    const userRides = [];

    const buffer = await fs.promises.readFile(RIDE_FILE);
    const rideData = JSON.parse(buffer.toString()) as Ride['data'];
    userRides.push(Ride.fromData(rideData));
    return userRides;
  }
}
