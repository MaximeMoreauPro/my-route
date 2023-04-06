import { DateProvider } from './PostRide.use-case';

export class RealDateProvider implements DateProvider {
  getNow() {
    return new Date();
  }
}
