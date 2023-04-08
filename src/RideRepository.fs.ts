import * as path from 'path';
import * as fs from 'fs';

import { Ride, RideRepository } from './PostRide.use-case';

export class FileSystemRideRepository implements RideRepository {
  async save(rideToSave: Ride): Promise<void> {
    return fs.promises.writeFile(
      path.join(__dirname, 'ride.json'),
      JSON.stringify(rideToSave)
    );
  }
}
