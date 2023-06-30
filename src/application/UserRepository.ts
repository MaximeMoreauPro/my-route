import { User } from '../domain/User';

export interface UserRepository {
  save: (user: User) => Promise<void>;
  getUser(userId: string): Promise<User | undefined>;
  getUserByName(userName: string): Promise<User | undefined>;
}
