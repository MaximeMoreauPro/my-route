import { InMemoryUserRepository } from '@/infrastructure/UserRepository/UserRepository.in-memory.js';
import { FakeIdProvider } from '@/infrastructure/IdProvider/IdProvider.fake.js';

import { CreateUserUseCase, CreateUserCommand } from './CreateUser.use-case.js';

describe('Feature: create a user', () => {
  let fixture: Fixture;

  beforeEach(() => {
    fixture = createFixture();
  });

  test('The system can create a user', async () => {
    await fixture.whenSystemCreateAUser({
      firstName: 'Alex',
      lastName: 'Johnson',
      email: 'alex@johnson.com',
    });

    await fixture.thenTheCreatedUserHasTheId(
      'alex@johnson.com',
      fixture.getIdByIndex(0)
    );
  });
});

type Fixture = ReturnType<typeof createFixture>;

const createFixture = () => {
  const userRepository = new InMemoryUserRepository();
  const idProvider = new FakeIdProvider();
  const postRideUseCase = new CreateUserUseCase(userRepository, idProvider);

  return {
    async whenSystemCreateAUser(createUserCommand: CreateUserCommand) {
      await postRideUseCase.handle(createUserCommand);
    },
    async thenTheCreatedUserHasTheId(
      userEmail: string,
      expectedUserId: string
    ) {
      const user = await userRepository.getUserByEmail(userEmail);

      expect(user?.id).toEqual(expectedUserId);
    },
    getIdByIndex(index: number): string {
      return idProvider.getIdByIndex(index);
    },
  };
};
