import { User } from './User';

export type Ride = {
  driver: User;
  departurePlace: string;
  departureTime: Date;
  destinationPlace: string;
  destinationTime: Date;
  postedAt: Date;
};
