import { DateProvider } from '../../application/DateProvider';

export class StubDateProvider implements DateProvider {
  private now!: Date;

  getNow() {
    return this.now;
  }

  setNow(datetime: Date) {
    this.now = datetime;
  }
}
