import { DateProvider } from './PostRide.use-case';

export class StubDateProvider implements DateProvider {
  private now!: Date;

  getNow() {
    return this.now;
  }

  setNow(datetime: Date) {
    this.now = datetime;
  }
}
