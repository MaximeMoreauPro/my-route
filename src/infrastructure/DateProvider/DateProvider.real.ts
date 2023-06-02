import { DateProvider } from '../../application/DateProvider';

export class RealDateProvider implements DateProvider {
  getNow(): string {
    return new Date().toISOString();
  }
}
