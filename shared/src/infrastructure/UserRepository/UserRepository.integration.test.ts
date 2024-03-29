import { UserRepository } from '../../application/repositories/UserRepository';
import { Alex, Bob, Zoe } from '../tests/User.test-data';

import { InMemoryUserRepository } from './UserRepository.in-memory';

describe('UserRepository', () => {
  runUserRepositoryTests(
    'InMemoryUserRepository',
    () => new InMemoryUserRepository(),
  );
});

function runUserRepositoryTests(
  userRepositoryImplementation:
    | 'FileSystemUserRepository'
    | 'InMemoryUserRepository',
  userRepositoryFactory: () => UserRepository,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  reset: () => Promise<void> = async () => {},
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
      await userRepository.save(Alex);
    });

    it('should get User by its id', async () => {
      await userRepository.save(Alex);
      await userRepository.save(Zoe);
      await userRepository.save(Bob);

      const users = await Promise.all([
        userRepository.getUser(Alex.id),
        userRepository.getUser(Zoe.id),
        userRepository.getUser(Bob.id),
      ]);
      expect(users).toStrictEqual([Alex, Zoe, Bob]);
    });

    it('should get User by its email', async () => {
      await userRepository.save(Alex);
      await userRepository.save(Zoe);
      await userRepository.save(Bob);

      const users = await Promise.all([
        userRepository.getUserByEmail(Alex.email),
        userRepository.getUserByEmail(Zoe.email),
        userRepository.getUserByEmail(Bob.email),
      ]);
      expect(users).toStrictEqual([Alex, Zoe, Bob]);
    });
  });
}
