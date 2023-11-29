import { DateProvider } from '@/application/providers/DateProvider.js';

export class RealDateProvider implements DateProvider {
  getNow(): string {
    return new Date().toISOString();
  }
}
