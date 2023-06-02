import { IdProvider } from '../../application/IdProvider';

export class FakeIdProvider implements IdProvider {
  private _id = 0;

  getId() {
    this._id++;
    return `${this._id++}`;
  }
}
