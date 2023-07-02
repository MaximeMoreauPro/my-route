import * as path from 'path';
import * as fs from 'fs';

import { FileSystemUserRepository } from './UserRepository.file-system';
import { InMemoryUserRepository } from './UserRepository.in-memory';
import { UserRepository } from '../../application/UserRepository';

const USERS_TEST_FILE = path.join(__dirname, 'users-test.json');

describe('UserRepository', () => {
  runUserRepositoryTests(
    'FileSystemUserRepository',
    () => new FileSystemUserRepository(USERS_TEST_FILE),
    () => {
      try {
        return fs.promises.rm(USERS_TEST_FILE, { force: true });
      } catch (e) {
        console.error(e);
      }
      return Promise.resolve();
    }
  );
  runUserRepositoryTests(
    'InMemoryUserRepository',
    () => new InMemoryUserRepository()
  );
});

function runUserRepositoryTests(
  userRepositoryImplementation:
    | 'FileSystemUserRepository'
    | 'InMemoryUserRepository',
  userRepositoryFactory: () => UserRepository,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  reset: () => Promise<void> = async () => {}
) {
  describe(userRepositoryImplementation, () => {
    let userRepository: UserRepository;

    beforeEach(async () => {
      await reset();

      userRepository = userRepositoryFactory();
    });

    afterAll(async () => {
      await reset();
    });

    it('should save a User', async () => {
      await userRepository.save({
        id: '1',
        firstName: 'Alex',
        lastName: 'Johnson',
        email: 'alex@johnson.com',
      });
    });

    it('should get User by its id', async () => {
      await userRepository.save({
        id: '1',
        firstName: 'Alex',
        lastName: 'Johnson',
        email: 'alex@johnson.com',
      });
      await userRepository.save({
        id: '2',
        firstName: 'Zoe',
        lastName: 'Davies',
        email: 'zoe@davies.com',
      });
      await userRepository.save({
        id: '3',
        firstName: 'Bob',
        lastName: 'Taylor',
        email: 'bob@taylor.com',
      });

      const user = await userRepository.getUser('3');

      expect(user).toStrictEqual({
        id: '3',
        firstName: 'Bob',
        lastName: 'Taylor',
        email: 'bob@taylor.com',
      });
    });

    it('should get User by its email', async () => {
      await userRepository.save({
        id: '1',
        firstName: 'Alex',
        lastName: 'Johnson',
        email: 'alex@johnson.com',
      });
      await userRepository.save({
        id: '2',
        firstName: 'Zoe',
        lastName: 'Davies',
        email: 'zoe@davies.com',
      });
      await userRepository.save({
        id: '3',
        firstName: 'Bob',
        lastName: 'Taylor',
        email: 'bob@taylor.com',
      });

      const user = await userRepository.getUserByEmail('bob@taylor.com');

      expect(user).toStrictEqual({
        id: '3',
        firstName: 'Bob',
        lastName: 'Taylor',
        email: 'bob@taylor.com',
      });
    });
  });
}
