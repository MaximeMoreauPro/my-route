import { PrismaClient } from '@prisma/client';

import { RideRepository } from '../../application/RideRepository';
import { Ride } from '../../domain/Ride';

export class PrismaRideRepository implements RideRepository {
  constructor(private readonly _prisma: PrismaClient) {}

  async save({
    id,
    departurePlace,
    departureTime,
    destinationPlace,
    destinationTime,
    postedAt,
    driver: { id: driverId },
  }: Ride): Promise<void> {
    await this._prisma.ride.create({
      data: {
        id,
        departurePlace,
        departureTime,
        destinationPlace,
        destinationTime,
        postedAt,
        driverId,
      },
    });
  }

  async getRidesByUser(userId: string): Promise<Ride[]> {
    const userRides = await this._prisma.ride.findMany({
      where: { driverId: userId },
      select: {
        id: true,
        departurePlace: true,
        departureTime: true,
        destinationPlace: true,
        destinationTime: true,
        driver: true,
        postedAt: true,
      },
    });

    return userRides;
  }
}
