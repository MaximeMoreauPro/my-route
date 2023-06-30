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
      await userRepository.save({ id: '1', name: 'Alex' });
    });

    it('should get User by its id', async () => {
      await userRepository.save({ id: '1', name: 'Alex' });
      await userRepository.save({ id: '2', name: 'Zoe' });

      const user = await userRepository.getUser('1');

      expect(user).toEqual({ id: '1', name: 'Alex' });
    });

    it('should get User by its name', async () => {
      await userRepository.save({ id: '1', name: 'Alex' });
      await userRepository.save({ id: '2', name: 'Zoe' });

      const user = await userRepository.getUserByName('Zoe');

      expect(user).toEqual({ id: '2', name: 'Zoe' });
    });
  });
}
