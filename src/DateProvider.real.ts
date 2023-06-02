import { DateProvider } from './application/use-cases/PostRide.use-case';

export class RealDateProvider implements DateProvider {
  getNow() {
    return new Date();
  }
}
