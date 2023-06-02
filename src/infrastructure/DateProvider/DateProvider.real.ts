import { DateProvider } from '../../application/DateProvider';

export class RealDateProvider implements DateProvider {
  getNow() {
    return new Date();
  }
}
