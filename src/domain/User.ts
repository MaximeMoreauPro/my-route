import { Entity } from './Entity';

export class User extends Entity {
  private constructor(id: string, readonly name: string) {
    super(id);
  }
}
