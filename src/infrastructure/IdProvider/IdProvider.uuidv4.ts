import { v4 as uuidv4 } from 'uuid';

import { IdProvider } from '../../application/IdProvider';

export class UUIDv4IdProvider implements IdProvider {
  getId() {
    return uuidv4();
  }
}