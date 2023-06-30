import { InMemoryUserRepository } from '../../infrastructure/UserRepository/UserRepository.in-memory';
import { FakeIdProvider } from '../../infrastructure/IdProvider/IdProvider.fake';
import { CreateUserUseCase, CreateUserCommand } from './CreateUser.use-case';

describe('Feature: create a user', () => {
  let fixture: Fixture;

  beforeEach(() => {
    fixture = createFixture();
  });

  test('The system can create a user', async () => {
    await fixture.whenSystemCreateAUser({
      name: 'Alex',
    });

    await fixture.thenTheCreatedUserHasTheId('Alex', fixture.getIdByIndex(0));
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
    async thenTheCreatedUserHasTheId(userName: string, expectedUserId: string) {
      const user = await userRepository.getUserByName(userName);

      expect(user?.id).toEqual(expectedUserId);
    },
    getIdByIndex(index: number): string {
      return idProvider.getIdByIndex(index);
    },
  };
};
