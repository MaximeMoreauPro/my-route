import { User } from '@/domain/User.js';

export interface UserRepository {
  save: (user: User) => Promise<void>;
  getUser(userId: string): Promise<User | undefined>;
  getUserByEmail(userEmail: string): Promise<User | undefined>;
}
