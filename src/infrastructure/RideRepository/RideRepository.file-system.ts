import * as fs from 'fs';

import { RideRepository } from '../../application/RideRepository';
import { Ride } from '../../domain/Ride';

export class FileSystemRideRepository implements RideRepository {
  constructor(private readonly _rideFile: string) {}

  async save(rideToSave: Ride): Promise<void> {
    const allRides = await this._readAllRidesFromFile();

    allRides.push(rideToSave);

    return fs.promises.writeFile(this._rideFile, JSON.stringify(allRides));
  }

  async getRidesByUser(userId: string): Promise<Ride[]> {
    const allRides = await this._readAllRidesFromFile();

    return allRides.filter(ride => ride.driver.id === userId);
  }

  private async _readAllRidesFromFile(): Promise<Ride[]> {
    try {
      const buffer = await fs.promises.readFile(this._rideFile);

      const rideData = JSON.parse(buffer.toString()) as Ride[];

      return rideData.map(ride => Ride.fromData(ride));
    } catch (e) {
      return [];
    }
  }
}
